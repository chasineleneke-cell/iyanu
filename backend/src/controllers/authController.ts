import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService'
import { authSchemas } from '../utils/validations'
import { AuthRequest, CreateUserInput } from '../types'
import { AuthenticationError, ValidationError } from '../utils/errors'

export class AuthController {
  /**
   * Register endpoint
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validated = authSchemas.register.parse(req.body) as CreateUserInput

      // Register user
      const result = await authService.register(validated)

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Login endpoint
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const validated = authSchemas.login.parse(req.body)

      // Login user
      const result = await authService.login(validated.email, validated.password)

      // Set refresh token as httpOnly cookie
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Logout endpoint
   * POST /api/auth/logout
   */
  async logout(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Clear refresh token cookie
      res.clearCookie('refreshToken')

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Refresh token endpoint
   * POST /api/auth/refresh
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Get refresh token from cookie
      const refreshToken = req.cookies.refreshToken

      if (!refreshToken) {
        throw new AuthenticationError('Refresh token not found')
      }

      // Refresh token
      const result = await authService.refreshToken(refreshToken)

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: result.accessToken,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const user = await authService.getProfile(req.user.userId)

      res.status(200).json({
        success: true,
        message: 'Profile fetched successfully',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update profile
   * PUT /api/auth/profile
   */
  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      // Validate request body
      const validated = authSchemas.updateProfile.parse(req.body)

      const user = await authService.updateProfile(req.user.userId, validated)

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Change password
   * POST /api/auth/change-password
   */
  async changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      // Validate request body
      const validated = authSchemas.changePassword.parse(req.body)

      await authService.changePassword(
        req.user.userId,
        validated.oldPassword,
        validated.newPassword
      )

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update profile image
   * POST /api/auth/profile-image
   */
  async updateProfileImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      // Validate request body
      if (!req.body.imageUrl) {
        throw new ValidationError('Image URL is required')
      }

      const user = await authService.updateProfileImage(req.user.userId, req.body.imageUrl)

      res.status(200).json({
        success: true,
        message: 'Profile image updated successfully',
        data: user,
      })
    } catch (error) {
      next(error)
    }
  }
}

// Export singleton instance
export const authController = new AuthController()
