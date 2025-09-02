const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { body, validationResult } = require('express-validator')
const crypto = require('crypto')
const axios = require('axios')
const { protect, kycApproved } = require('../middleware/authMiddleware')

const router = express.Router()
const prisma = new PrismaClient()

// Settlement configuration
const SETTLEMENT_CONFIG = {
  fiatProviders: {
    stripe: {
      apiKey: process.env.STRIPE_SECRET_KEY,
      baseUrl: 'https://api.stripe.com/v1'
    },
    wise: {
      apiKey: process.env.WISE_API_KEY,
      baseUrl: 'https://api.transferwise.com/v1'
    }
  },
  cryptoProviders: {
    circle: {
      apiKey: process.env.CIRCLE_API_KEY,
      baseUrl: 'https://api.circle.com/v1'
    }
  },
  fees: {
    fiat: 0.025, // 2.5% for fiat settlements
    crypto: 0.01 // 1% for crypto settlements
  }
}

// @desc    Create merchant settlement request
// @route   POST /api/settlements/create
// @access  Private (Merchants only)
router.post('/create',
  protect,
  kycApproved,
  [
    body('settlementType').isIn(['FIAT', 'STABLECOIN']),
    body('currency').notEmpty(),
    body('amount').isFloat({ min: 10 }),
    body('bankAccount').optional().isObject(),
    body('walletAddress').optional().isEthereumAddress()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        })
      }

      const {
        settlementType,
        currency,
        amount,
        bankAccount,
        walletAddress
      } = req.body

      // Verify user is a merchant
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { 
          kycStatus: true,
          kycLevel: true,
          totalEarnings: true,
          totalSpent: true,
          userType: true
        }
      })

      if (user.kycStatus !== 'APPROVED') {
        return res.status(403).json({
          success: false,
          message: 'KYC verification required for settlements'
        })
      }

      // Check available balance
      const availableBalance = user.totalEarnings - user.totalSpent
      if (availableBalance < amount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient balance for settlement'
        })
      }

      // Validate settlement details
      if (settlementType === 'FIAT' && !bankAccount) {
        return res.status(400).json({
          success: false,
          message: 'Bank account details required for fiat settlements'
        })
      }

      if (settlementType === 'STABLECOIN' && !walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address required for stablecoin settlements'
        })
      }

      // Calculate fees
      const feeRate = settlementType === 'FIAT' 
        ? SETTLEMENT_CONFIG.fees.fiat 
        : SETTLEMENT_CONFIG.fees.crypto
      const fees = amount * feeRate
      const netAmount = amount - fees

      // Create settlement record
      const settlement = await prisma.merchantSettlement.create({
        data: {
          userId: req.user.id,
          settlementType,
          currency,
          amount,
          fees,
          netAmount,
          status: 'PENDING',
          bankAccount: settlementType === 'FIAT' ? bankAccount : null,
          walletAddress: settlementType === 'STABLECOIN' ? walletAddress : null,
          provider: settlementType === 'FIAT' ? 'WISE' : 'CIRCLE'
        }
      })

      // Process settlement based on type
      if (settlementType === 'FIAT') {
        await processFiatSettlement(settlement)
      } else {
        await processStablecoinSettlement(settlement)
      }

      // Update user balance
      await prisma.user.update({
        where: { id: req.user.id },
        data: { totalSpent: { increment: amount } }
      })

      // Emit WebSocket notification
      const io = req.app.get('io')
      if (io) {
        io.to(`user-${req.user.id}`).emit('settlement-created', {
          settlementId: settlement.id,
          type: 'settlement',
          message: `Settlement request created: ${netAmount} ${currency}`
        })
      }

      res.json({
        success: true,
        settlement: {
          id: settlement.id,
          settlementType,
          currency,
          amount,
          fees,
          netAmount,
          status: settlement.status
        },
        message: 'Settlement request created successfully'
      })

    } catch (error) {
      console.error('Settlement creation error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create settlement request'
      })
    }
  }
)

// @desc    Get merchant settlement history
// @route   GET /api/settlements/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    const settlements = await prisma.merchantSettlement.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        settlementType: true,
        currency: true,
        amount: true,
        fees: true,
        netAmount: true,
        status: true,
        provider: true,
        createdAt: true,
        processedAt: true
      }
    })

    const total = await prisma.merchantSettlement.count({
      where: { userId: req.user.id }
    })

    res.json({
      success: true,
      settlements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Settlement history error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settlement history'
    })
  }
})

// @desc    Get settlement status
// @route   GET /api/settlements/status/:settlementId
// @access  Private
router.get('/status/:settlementId', protect, async (req, res) => {
  try {
    const { settlementId } = req.params

    const settlement = await prisma.merchantSettlement.findFirst({
      where: {
        id: settlementId,
        userId: req.user.id
      }
    })

    if (!settlement) {
      return res.status(404).json({
        success: false,
        message: 'Settlement not found'
      })
    }

    // Check external status if available
    if (settlement.externalId) {
      try {
        const externalStatus = await checkExternalSettlementStatus(settlement)
        if (externalStatus && externalStatus !== settlement.status) {
          await prisma.merchantSettlement.update({
            where: { id: settlement.id },
            data: { 
              status: externalStatus,
              processedAt: externalStatus === 'COMPLETED' ? new Date() : null
            }
          })
          settlement.status = externalStatus
        }
      } catch (error) {
        console.error('External status check failed:', error)
      }
    }

    res.json({
      success: true,
      settlement: {
        id: settlement.id,
        settlementType: settlement.settlementType,
        currency: settlement.currency,
        amount: settlement.amount,
        fees: settlement.fees,
        netAmount: settlement.netAmount,
        status: settlement.status,
        createdAt: settlement.createdAt,
        processedAt: settlement.processedAt
      }
    })

  } catch (error) {
    console.error('Settlement status error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to check settlement status'
    })
  }
})

// @desc    Cancel settlement request
// @route   POST /api/settlements/cancel/:settlementId
// @access  Private
router.post('/cancel/:settlementId', protect, async (req, res) => {
  try {
    const { settlementId } = req.params

    const settlement = await prisma.merchantSettlement.findFirst({
      where: {
        id: settlementId,
        userId: req.user.id,
        status: 'PENDING'
      }
    })

    if (!settlement) {
      return res.status(404).json({
        success: false,
        message: 'Settlement not found or cannot be cancelled'
      })
    }

    // Update settlement status
    await prisma.merchantSettlement.update({
      where: { id: settlement.id },
      data: { status: 'CANCELLED' }
    })

    // Refund the amount to user balance
    await prisma.user.update({
      where: { id: req.user.id },
      data: { totalSpent: { decrement: settlement.amount } }
    })

    res.json({
      success: true,
      message: 'Settlement cancelled successfully'
    })

  } catch (error) {
    console.error('Settlement cancellation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to cancel settlement'
    })
  }
})

// @desc    Get settlement options and fees
// @route   GET /api/settlements/options
// @access  Private
router.get('/options', protect, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { 
        totalEarnings: true,
        totalSpent: true,
        kycStatus: true
      }
    })

    const availableBalance = user.totalEarnings - user.totalSpent

    const options = {
      availableBalance,
      minimumAmount: 10,
      fiatOptions: [
        { currency: 'USD', name: 'US Dollar', fee: '2.5%' },
        { currency: 'EUR', name: 'Euro', fee: '2.5%' },
        { currency: 'GBP', name: 'British Pound', fee: '2.5%' }
      ],
      stablecoinOptions: [
        { currency: 'USDC', name: 'USD Coin', fee: '1.0%' },
        { currency: 'USDT', name: 'Tether', fee: '1.0%' },
        { currency: 'DAI', name: 'Dai Stablecoin', fee: '1.0%' }
      ],
      kycRequired: user.kycStatus !== 'APPROVED'
    }

    res.json({
      success: true,
      options
    })

  } catch (error) {
    console.error('Settlement options error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settlement options'
    })
  }
})

// Helper functions
async function processFiatSettlement(settlement) {
  try {
    // Mock Wise API integration
    const wiseResponse = await mockWiseTransfer(settlement)
    
    await prisma.merchantSettlement.update({
      where: { id: settlement.id },
      data: {
        status: 'PROCESSING',
        externalId: wiseResponse.transferId,
        provider: 'WISE'
      }
    })

    console.log(`Fiat settlement initiated: ${settlement.id}`)
  } catch (error) {
    console.error('Fiat settlement processing error:', error)
    await prisma.merchantSettlement.update({
      where: { id: settlement.id },
      data: { status: 'FAILED' }
    })
  }
}

async function processStablecoinSettlement(settlement) {
  try {
    // Mock Circle API integration
    const circleResponse = await mockCircleTransfer(settlement)
    
    await prisma.merchantSettlement.update({
      where: { id: settlement.id },
      data: {
        status: 'PROCESSING',
        externalId: circleResponse.transferId,
        provider: 'CIRCLE'
      }
    })

    console.log(`Stablecoin settlement initiated: ${settlement.id}`)
  } catch (error) {
    console.error('Stablecoin settlement processing error:', error)
    await prisma.merchantSettlement.update({
      where: { id: settlement.id },
      data: { status: 'FAILED' }
    })
  }
}

async function mockWiseTransfer(settlement) {
  // Mock Wise API response
  return {
    transferId: `wise_${settlement.id}_${Date.now()}`,
    status: 'processing',
    estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  }
}

async function mockCircleTransfer(settlement) {
  // Mock Circle API response
  return {
    transferId: `circle_${settlement.id}_${Date.now()}`,
    status: 'pending',
    txHash: `0x${crypto.randomBytes(32).toString('hex')}`
  }
}

async function checkExternalSettlementStatus(settlement) {
  if (settlement.provider === 'WISE') {
    // Mock Wise status check
    return Math.random() > 0.5 ? 'COMPLETED' : 'PROCESSING'
  } else if (settlement.provider === 'CIRCLE') {
    // Mock Circle status check
    return Math.random() > 0.3 ? 'COMPLETED' : 'PROCESSING'
  }
  return settlement.status
}

module.exports = router
