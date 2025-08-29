import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

import { errorHandler, notFound } from './middleware/errorMiddleware'
import { rateLimiter } from './middleware/rateLimiter'
import logger from './utils/logger'

// Import routes
import authRoutes from './routes/auth'
import walletRoutes from './routes/wallet'
import tasksRoutes from './routes/tasks'
import rewardsRoutes from './routes/rewards'
import userRoutes from './routes/user'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true
}))
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(rateLimiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/tasks', tasksRoutes)
app.use('/api/rewards', rewardsRoutes)
app.use('/api/user', userRoutes)

// Socket.IO for real-time features
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`)

  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`)
    logger.info(`User ${userId} joined their room`)
  })

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`)
  })
})

// Make io available to routes
app.set('io', io)

// Error handling
app.use(notFound)
app.use(errorHandler)

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 VPay Backend running on port ${PORT}`)
  logger.info(`📊 Health check: http://localhost:${PORT}/health`)
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
