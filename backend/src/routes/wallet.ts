import express from 'express'
import { PrismaClient } from '@prisma/client'
import { body, validationResult } from 'express-validator'
import { asyncHandler } from '../middleware/errorMiddleware'
import { protect, kycApproved } from '../middleware/authMiddleware'

const router = express.Router()
const prisma = new PrismaClient()

// @desc    Get wallet balance
// @route   GET /api/wallet/balance
// @access  Private
router.get('/balance', protect, asyncHandler(async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      walletAddress: true,
      totalEarnings: true,
      totalSpent: true,
    }
  })

  // In a real implementation, you'd query the blockchain for actual balance
  const balance = user?.totalEarnings || 0 - (user?.totalSpent || 0)

  res.json({
    success: true,
    balance,
    walletAddress: user?.walletAddress,
    totalEarnings: user?.totalEarnings,
    totalSpent: user?.totalSpent,
  })
}))

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
router.get('/transactions', protect, asyncHandler(async (req: any, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skip = (page - 1) * limit

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        { fromUserId: req.user.id },
        { toUserId: req.user.id }
      ]
    },
    include: {
      fromUser: {
        select: { username: true, avatar: true }
      },
      toUser: {
        select: { username: true, avatar: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  })

  const total = await prisma.transaction.count({
    where: {
      OR: [
        { fromUserId: req.user.id },
        { toUserId: req.user.id }
      ]
    }
  })

  res.json({
    success: true,
    transactions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  })
}))

// @desc    Send payment
// @route   POST /api/wallet/send
// @access  Private
router.post('/send',
  protect,
  kycApproved,
  [
    body('to').notEmpty(),
    body('amount').isFloat({ min: 0.01 }),
    body('message').optional().isLength({ max: 500 }),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { to, amount, message } = req.body

    // Find recipient
    const recipient = await prisma.user.findFirst({
      where: {
        OR: [
          { walletAddress: to },
          { username: to },
          { email: to }
        ]
      }
    })

    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' })
    }

    if (recipient.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot send payment to yourself' })
    }

    // Check sender balance (simplified - in real app, check blockchain)
    const sender = await prisma.user.findUnique({
      where: { id: req.user.id }
    })

    const senderBalance = (sender?.totalEarnings || 0) - (sender?.totalSpent || 0)
    if (senderBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' })
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        fromUserId: req.user.id,
        toUserId: recipient.id,
        amount,
        type: 'PAYMENT',
        status: 'CONFIRMED',
        message,
        // In real implementation, you'd interact with blockchain here
        blockchainTxHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      },
      include: {
        fromUser: {
          select: { username: true, avatar: true }
        },
        toUser: {
          select: { username: true, avatar: true }
        }
      }
    })

    // Update user balances
    await prisma.user.update({
      where: { id: req.user.id },
      data: { totalSpent: { increment: amount } }
    })

    await prisma.user.update({
      where: { id: recipient.id },
      data: { totalEarnings: { increment: amount } }
    })

    // Emit real-time notification
    const io = req.app.get('io')
    io.to(`user-${recipient.id}`).emit('payment-received', {
      transaction,
      message: `You received ${amount} VRC from ${req.user.username}`
    })

    res.json({
      success: true,
      transaction,
      message: 'Payment sent successfully'
    })
  })
)

// @desc    Create payment request
// @route   POST /api/wallet/request
// @access  Private
router.post('/request',
  protect,
  [
    body('amount').isFloat({ min: 0.01 }),
    body('description').optional().isLength({ max: 500 }),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { amount, description } = req.body

    // Generate payment request QR code data
    const paymentRequest = {
      id: `req_${Date.now()}`,
      userId: req.user.id,
      username: req.user.username,
      amount,
      description,
      createdAt: new Date().toISOString(),
    }

    res.json({
      success: true,
      paymentRequest,
      qrData: JSON.stringify(paymentRequest),
    })
  })
)

export default router
