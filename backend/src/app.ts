import express, { Express } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { errorHandler, notFoundHandler } from './middlewares/errorHandler'

// Import routes (will be created)
import authRoutes from './routes/auth'
import listingRoutes from './routes/listings'
import bookingRoutes from './routes/bookings'
import propertyRoutes from './routes/properties'
import messageRoutes from './routes/messages'
import paymentRoutes from './routes/payments'
import userRoutes from './routes/user'
import adminRoutes from './routes/admin'

export const createApp = (): Express => {
  const app = express()

  // Middleware
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  app.use(cookieParser())

  // CORS
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )

  // Rate limiting
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  })
  app.use(limiter)

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    })
  })

  // API Routes
  app.use('/api/auth', authRoutes)
  app.use('/api/listings', listingRoutes)
  app.use('/api/bookings', bookingRoutes)
  app.use('/api/admin/properties', propertyRoutes)
  app.use('/api/messages', messageRoutes)
  app.use('/api/payments', paymentRoutes)
  app.use('/api/profile', userRoutes)
  app.use('/api/admin', adminRoutes)

  // 404 handler
  app.use(notFoundHandler)

  // Error handling middleware (must be last)
  app.use(errorHandler)

  return app
}
