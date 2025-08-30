import express from 'express'
import { PrismaClient } from '@prisma/client'
import { body, validationResult } from 'express-validator'
import { asyncHandler } from '../middleware/errorMiddleware'
import { protect } from '../middleware/authMiddleware'
import multer from 'multer'
import path from 'path'

const router = express.Router()
const prisma = new PrismaClient()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req: any, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      username: true,
      walletAddress: true,
      isVerified: true,
      kycStatus: true,
      bio: true,
      avatar: true,
      skills: true,
      totalEarnings: true,
      totalSpent: true,
      rewardPoints: true,
      tier: true,
      createdAt: true,
      updatedAt: true,
    }
  })

  res.json({
    success: true,
    user
  })
}))

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile',
  protect,
  [
    body('username').optional().isLength({ min: 3 }).isAlphanumeric(),
    body('bio').optional().isLength({ max: 500 }),
    body('skills').optional().isArray(),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { username, bio, skills } = req.body
    const updateData: any = {}

    if (username) {
      // Check if username is already taken
      const existingUser = await prisma.user.findFirst({
        where: {
          username,
          id: { not: req.user.id }
        }
      })

      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' })
      }
      updateData.username = username
    }

    if (bio !== undefined) updateData.bio = bio
    if (skills) updateData.skills = skills

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        walletAddress: true,
        isVerified: true,
        kycStatus: true,
        bio: true,
        avatar: true,
        skills: true,
        totalEarnings: true,
        totalSpent: true,
        rewardPoints: true,
        tier: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    res.json({
      success: true,
      user
    })
  })
)

// @desc    Upload avatar
// @route   POST /api/users/avatar
// @access  Private
router.post('/avatar',
  protect,
  upload.single('avatar'),
  asyncHandler(async (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarPath },
      select: {
        id: true,
        username: true,
        avatar: true
      }
    })

    res.json({
      success: true,
      user,
      message: 'Avatar uploaded successfully'
    })
  })
)

// @desc    Connect wallet
// @route   PUT /api/users/wallet
// @access  Private
router.put('/wallet',
  protect,
  [
    body('walletAddress').isEthereumAddress(),
  ],
  asyncHandler(async (req: any, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { walletAddress } = req.body

    // Check if wallet is already connected to another user
    const existingUser = await prisma.user.findFirst({
      where: {
        walletAddress,
        id: { not: req.user.id }
      }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Wallet already connected to another account' })
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { walletAddress },
      select: {
        id: true,
        username: true,
        walletAddress: true,
        isVerified: true
      }
    })

    res.json({
      success: true,
      user,
      message: 'Wallet connected successfully'
    })
  })
)

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, asyncHandler(async (req: any, res) => {
  const [
    totalTransactions,
    completedTasks,
    createdTasks,
    totalAchievements,
    userAchievements
  ] = await Promise.all([
    prisma.transaction.count({
      where: {
        OR: [
          { fromUserId: req.user.id },
          { toUserId: req.user.id }
        ]
      }
    }),
    prisma.task.count({
      where: {
        assigneeId: req.user.id,
        status: 'COMPLETED'
      }
    }),
    prisma.task.count({
      where: { creatorId: req.user.id }
    }),
    prisma.achievement.count({
      where: { isActive: true }
    }),
    prisma.userAchievement.count({
      where: { userId: req.user.id }
    })
  ])

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      totalEarnings: true,
      totalSpent: true,
      rewardPoints: true,
      tier: true
    }
  })

  res.json({
    success: true,
    stats: {
      totalTransactions,
      completedTasks,
      createdTasks,
      totalEarnings: user?.totalEarnings || 0,
      totalSpent: user?.totalSpent || 0,
      rewardPoints: user?.rewardPoints || 0,
      tier: user?.tier || 'BRONZE',
      achievementsUnlocked: userAchievements,
      totalAchievements
    }
  })
}))

// @desc    Get public user profile
// @route   GET /api/users/:username
// @access  Public
router.get('/:username', asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      skills: true,
      tier: true,
      createdAt: true,
      createdTasks: {
        where: { status: { in: ['COMPLETED', 'IN_PROGRESS'] } },
        select: { id: true, title: true, status: true, createdAt: true }
      },
      assignedTasks: {
        where: { status: 'COMPLETED' },
        select: { id: true, title: true, completedAt: true }
      }
    }
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.json({
    success: true,
    user: {
      ...user,
      tasksCompleted: user.assignedTasks.length,
      tasksCreated: user.createdTasks.length
    }
  })
}))

// @desc    Search users
// @route   GET /api/users/search/:query
// @access  Public
router.get('/search/:query', asyncHandler(async (req, res) => {
  const query = req.params.query
  const limit = parseInt(req.query.limit as string) || 10

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: query, mode: 'insensitive' } },
        { bio: { contains: query, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      bio: true,
      tier: true,
      skills: true
    },
    take: limit
  })

  res.json({
    success: true,
    users
  })
}))

export default router
