import express from 'express'
import { PrismaClient } from '@prisma/client'
import { body, validationResult } from 'express-validator'
import { asyncHandler } from '../middleware/errorMiddleware'
import { protect, kycApproved } from '../middleware/authMiddleware'

const router = express.Router()
const prisma = new PrismaClient()

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
router.get('/', asyncHandler(async (req: any, res: any) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 20
  const category = req.query.category as string
  const status = req.query.status as string
  const search = req.query.search as string
  const skip = (page - 1) * limit

  const where: any = {}
  
  if (category) where.category = category
  if (status) where.status = status
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      creator: {
        select: { id: true, username: true, avatar: true, tier: true }
      },
      assignee: {
        select: { id: true, username: true, avatar: true }
      },
      applications: {
        select: { id: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
  })

  const total = await prisma.task.count({ where })

  res.json({
    success: true,
    tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    }
  })
}))

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
router.get('/:id', asyncHandler(async (req: any, res: any) => {
  const task = await prisma.task.findUnique({
    where: { id: req.params.id },
    include: {
      creator: {
        select: { id: true, username: true, avatar: true, tier: true }
      },
      assignee: {
        select: { id: true, username: true, avatar: true }
      },
      applications: {
        include: {
          applicant: {
            select: { id: true, username: true, avatar: true, tier: true }
          }
        }
      },
      attachments: true
    }
  })

  if (!task) {
    return res.status(404).json({ message: 'Task not found' })
  }

  res.json({
    success: true,
    task
  })
}))

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/',
  protect,
  kycApproved,
  [
    body('title').notEmpty().isLength({ min: 5, max: 100 }),
    body('description').notEmpty().isLength({ min: 20, max: 2000 }),
    body('category').notEmpty(),
    body('budget').isFloat({ min: 1 }),
    body('deadline').isISO8601(),
    body('skills').isArray(),
  ],
  asyncHandler(async (req: any, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, description, category, budget, deadline, skills, location, isRemote } = req.body

    const task = await prisma.task.create({
      data: {
        title,
        description,
        category,
        budget,
        deadline: new Date(deadline),
        skills,
        location,
        isRemote: isRemote ?? true,
        creatorId: req.user.id,
      },
      include: {
        creator: {
          select: { id: true, username: true, avatar: true, tier: true }
        }
      }
    })

    res.status(201).json({
      success: true,
      task
    })
  })
)

// @desc    Apply to task
// @route   POST /api/tasks/:id/apply
// @access  Private
router.post('/:id/apply',
  protect,
  kycApproved,
  [
    body('proposal').notEmpty().isLength({ min: 50, max: 1000 }),
    body('bidAmount').isFloat({ min: 1 }),
    body('estimatedTime').notEmpty(),
  ],
  asyncHandler(async (req: any, res: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.creatorId === req.user.id) {
      return res.status(400).json({ message: 'Cannot apply to your own task' })
    }

    if (task.status !== 'OPEN') {
      return res.status(400).json({ message: 'Task is not open for applications' })
    }

    // Check if already applied
    const existingApplication = await prisma.taskApplication.findUnique({
      where: {
        taskId_applicantId: {
          taskId: req.params.id,
          applicantId: req.user.id
        }
      }
    })

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this task' })
    }

    const { proposal, bidAmount, estimatedTime } = req.body

    const application = await prisma.taskApplication.create({
      data: {
        taskId: req.params.id,
        applicantId: req.user.id,
        proposal,
        bidAmount,
        estimatedTime,
      },
      include: {
        applicant: {
          select: { id: true, username: true, avatar: true, tier: true }
        }
      }
    })

    // Notify task creator
    const io = req.app.get('io')
    io.to(`user-${task.creatorId}`).emit('task-application', {
      application,
      message: `New application received for "${task.title}"`
    })

    res.status(201).json({
      success: true,
      application
    })
  })
)

// @desc    Accept task application
// @route   PUT /api/tasks/:id/applications/:applicationId/accept
// @access  Private
router.put('/:id/applications/:applicationId/accept',
  protect,
  asyncHandler(async (req: any, res: any) => {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id }
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const application = await prisma.taskApplication.findUnique({
      where: { id: req.params.applicationId },
      include: { applicant: true }
    })

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    // Update application and task
    await prisma.$transaction([
      prisma.taskApplication.update({
        where: { id: req.params.applicationId },
        data: { status: 'ACCEPTED' }
      }),
      prisma.task.update({
        where: { id: req.params.id },
        data: {
          status: 'IN_PROGRESS',
          assigneeId: application.applicantId,
          escrowAmount: application.bidAmount
        }
      }),
      // Reject other applications
      prisma.taskApplication.updateMany({
        where: {
          taskId: req.params.id,
          id: { not: req.params.applicationId }
        },
        data: { status: 'REJECTED' }
      })
    ])

    // Notify accepted applicant
    const io = req.app.get('io')
    io.to(`user-${application.applicantId}`).emit('application-accepted', {
      task,
      message: `Your application for "${task.title}" has been accepted!`
    })

    res.json({
      success: true,
      message: 'Application accepted successfully'
    })
  })
)

// @desc    Complete task
// @route   PUT /api/tasks/:id/complete
// @access  Private
router.put('/:id/complete',
  protect,
  asyncHandler(async (req: any, res: any) => {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: { assignee: true }
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (task.status !== 'IN_PROGRESS') {
      return res.status(400).json({ message: 'Task is not in progress' })
    }

    // Update task and create payment transaction
    const updatedTask = await prisma.$transaction(async (tx: any) => {
      const task = await tx.task.update({
        where: { id: req.params.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date()
        }
      })

      // Create payment transaction
      await tx.transaction.create({
        data: {
          fromUserId: task.creatorId,
          toUserId: task.assigneeId!,
          amount: task.escrowAmount!,
          type: 'TASK_PAYMENT',
          status: 'CONFIRMED',
          blockchainTxHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        }
      })

      // Update user balances
      await tx.user.update({
        where: { id: task.creatorId },
        data: { totalSpent: { increment: task.escrowAmount! } }
      })

      await tx.user.update({
        where: { id: task.assigneeId! },
        data: { totalEarnings: { increment: task.escrowAmount! } }
      })

      return task
    })

    // Notify assignee
    const io = req.app.get('io')
    io.to(`user-${task.assigneeId}`).emit('task-completed', {
      task: updatedTask,
      message: `Task "${task.title}" has been completed! Payment sent.`
    })

    res.json({
      success: true,
      task: updatedTask
    })
  })
)

export default router
