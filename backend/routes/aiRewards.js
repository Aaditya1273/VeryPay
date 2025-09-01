const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { RewardRedemptionService } = require('../services/rewardRedemptionService');

const router = express.Router();
const redemptionService = new RewardRedemptionService();

// Mock AI recommendation data for demonstration
const mockRecommendations = [
  {
    id: 'rec_1',
    rewardType: 'CASHBACK',
    title: '5% Cashback on Next Payment',
    description: 'Based on your payment history, earn 5% cashback on your next transaction over $50.',
    value: 2.50,
    confidence: 0.85,
    reasoning: 'You frequently make payments in the $50-100 range and have a high completion rate.',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'rec_2',
    rewardType: 'BONUS_TOKENS',
    title: '50 Bonus VPay Tokens',
    description: 'Complete 3 more tasks this week to earn 50 bonus VPay tokens.',
    value: 50,
    confidence: 0.92,
    reasoning: 'Your task completion rate is 95% and you typically complete 5+ tasks per week.',
    status: 'PENDING',
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'rec_3',
    rewardType: 'NFT',
    title: 'Exclusive VPay Achievement NFT',
    description: 'Unlock a rare achievement NFT for reaching Silver tier status.',
    value: 25,
    confidence: 0.78,
    reasoning: 'You are 200 points away from Silver tier and have been consistently active.',
    status: 'VIEWED',
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const mockAnalytics = {
  spendingAnalysis: {
    totalSpent: 1250.75,
    avgTransactionAmount: 78.50,
    transactionFrequency: 16,
    topCategories: [
      { category: 'Digital Services', amount: 450.25, frequency: 8 },
      { category: 'Freelance Payments', amount: 380.50, frequency: 5 },
      { category: 'Marketplace', amount: 420.00, frequency: 3 }
    ],
    spendingTrend: 'INCREASING',
    riskProfile: 'LOW'
  },
  recommendationStats: [
    { status: 'PENDING', _count: { _all: 2 } },
    { status: 'VIEWED', _count: { _all: 1 } },
    { status: 'CLAIMED', _count: { _all: 3 } }
  ],
  spendingPatterns: [
    { category: 'Digital Services', totalAmount: 450.25, frequency: 8, trendDirection: 'UP' },
    { category: 'Freelance Payments', totalAmount: 380.50, frequency: 5, trendDirection: 'STABLE' },
    { category: 'Marketplace', totalAmount: 420.00, frequency: 3, trendDirection: 'UP' }
  ]
};

// GET /api/rewards/recommend - Get personalized AI recommendations
router.get('/recommend', authMiddleware, async (req, res) => {
  try {
    // In a real implementation, this would:
    // 1. Fetch user's transaction history
    // 2. Analyze spending patterns
    // 3. Generate AI recommendations
    // 4. Store recommendations in database
    
    const recommendations = mockRecommendations.map(rec => ({
      ...rec,
      // Simulate some personalization based on user
      confidence: Math.min(0.95, rec.confidence + Math.random() * 0.1)
    }));

    res.json({
      success: true,
      data: {
        recommendations,
        totalCount: recommendations.length,
        pendingCount: recommendations.filter(r => r.status === 'PENDING').length
      }
    });
  } catch (error) {
    console.error('Error fetching AI recommendations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations'
    });
  }
});

// GET /api/rewards/analytics - Get user spending analytics
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    // In a real implementation, this would:
    // 1. Analyze user's transaction patterns
    // 2. Calculate spending trends
    // 3. Generate insights and recommendations
    
    res.json({
      success: true,
      data: mockAnalytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

// POST /api/rewards/recommend/:id/claim - Claim a recommendation
router.post('/recommend/:id/claim', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userAddress = req.user.walletAddress || req.body.walletAddress;
    const recommendation = mockRecommendations.find(r => r.id === id);
    
    if (!recommendation) {
      return res.status(404).json({
        success: false,
        error: 'Recommendation not found'
      });
    }

    if (recommendation.status === 'CLAIMED') {
      return res.status(400).json({
        success: false,
        error: 'Recommendation already claimed'
      });
    }

    if (recommendation.expiresAt && new Date(recommendation.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Recommendation has expired'
      });
    }

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address required for reward processing'
      });
    }

    // Process the reward using the redemption service
    const redemptionResult = await redemptionService.processRewardRedemption(userAddress, recommendation);

    // Update recommendation status
    recommendation.status = 'CLAIMED';

    res.json({
      success: true,
      data: {
        recommendation,
        redemption: redemptionResult,
        claimedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error claiming recommendation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to claim recommendation'
    });
  }
});

// GET /api/rewards/recommend/history - Get recommendation history
router.get('/recommend/history', authMiddleware, async (req, res) => {
  try {
    const { status, limit = 10 } = req.query;
    
    let filteredRecommendations = mockRecommendations;
    if (status) {
      filteredRecommendations = mockRecommendations.filter(r => r.status === status);
    }

    const recommendations = filteredRecommendations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        recommendations,
        totalCount: filteredRecommendations.length
      }
    });
  } catch (error) {
    console.error('Error fetching recommendation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendation history'
    });
  }
});

// GET /api/rewards/redemption/history - Get user's redemption history
router.get('/redemption/history', authMiddleware, async (req, res) => {
  try {
    const userAddress = req.user.walletAddress || req.query.walletAddress;
    const { limit = 10 } = req.query;

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address required'
      });
    }

    const history = await redemptionService.getUserRedemptionHistory(userAddress, parseInt(limit));

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching redemption history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch redemption history'
    });
  }
});

// POST /api/rewards/nft/mint - Mint custom reward NFT
router.post('/nft/mint', authMiddleware, async (req, res) => {
  try {
    const { walletAddress, rewardData } = req.body;
    
    if (!walletAddress || !rewardData) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address and reward data required'
      });
    }

    const result = await redemptionService.mintRewardNFT(walletAddress, rewardData);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mint NFT'
    });
  }
});

// POST /api/rewards/tokens/transfer - Transfer bonus tokens
router.post('/tokens/transfer', authMiddleware, async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;
    
    if (!walletAddress || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address and amount required'
      });
    }

    const result = await redemptionService.transferBonusTokens(walletAddress, amount);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error transferring tokens:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to transfer tokens'
    });
  }
});

module.exports = router;
