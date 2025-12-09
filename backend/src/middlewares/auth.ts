import { Response, NextFunction } from 'express'
import { verifyAccessToken, verifyRefreshToken } from '../utils/jwt'
import { AuthenticationError, AuthorizationError } from '../utils/errors'
import { UserRoles } from '../utils/constants'
import { AuthRequest } from '../types'

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AuthenticationError('No authorization token provided')
    }

    const token = authHeader.substring(7)
    const payload = verifyAccessToken(token)

    if (!payload) {
      throw new AuthenticationError('Invalid or expired token')
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    }

    next()
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      })
    }
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    })
  }
}

export const roleMiddleware = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - insufficient permissions',
      })
    }

    next()
  }
}

export const optionalAuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const payload = verifyAccessToken(token)
      
      if (payload) {
        req.user = {
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        }
      }
    }
    next()
  } catch (error) {
    next()
  }
}
