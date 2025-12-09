import { UserRoles } from '../utils/constants'
import { userRepository } from '../repositories/userRepository'
import { hashPassword, comparePassword } from '../utils/hash'
import { generateTokens, verifyRefreshToken } from '../utils/jwt'
import { AuthenticationError, NotFoundError, ValidationError } from '../utils/errors'
import { CreateUserInput } from '../types'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    phone: string | null
    profileImage: string | null
  }
  tokens: AuthTokens
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(input: CreateUserInput): Promise<AuthResponse> {
    // Check if email already exists
    const existingUser = await userRepository.findByEmail(input.email)
    if (existingUser) {
      throw new ValidationError('Email already registered')
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password)

    // Create user
    const user = await userRepository.create({
      ...input,
      hashedPassword,
    })

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: this.formatUserResponse(user),
      tokens,
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Find user with password field
    const user = await userRepository.findByEmailWithPassword(email)
    if (!user) {
      throw new AuthenticationError('Invalid email or password')
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password')
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: this.formatUserResponse(user),
      tokens,
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken)

      // Get user
      const user = await userRepository.findById(decoded?.userId || '')
      if (!user) {
        throw new AuthenticationError('User not found')
      }

      // Generate new tokens
      const tokens = generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      return {
        accessToken: tokens.accessToken,
      }
    } catch (error) {
      throw new AuthenticationError('Invalid refresh token')
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<any> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }

    return this.formatUserResponse(user)
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: any): Promise<any> {
    const user = await userRepository.update(userId, {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    })

    return this.formatUserResponse(user)
  }

  /**
   * Change password
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.findByEmailWithPassword(
      (await userRepository.findById(userId))?.email || ''
    )

    if (!user) {
      throw new NotFoundError('User not found')
    }

    // Verify old password
    const isPasswordValid = await comparePassword(oldPassword, user.password)
    if (!isPasswordValid) {
      throw new AuthenticationError('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update user
    await userRepository.update(userId, {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      hashedPassword,
    })
  }

  /**
   * Update profile image
   */
  async updateProfileImage(userId: string, imageUrl: string): Promise<any> {
    const user = await userRepository.updateProfileImage(userId, imageUrl)
    return this.formatUserResponse(user)
  }

  /**
   * Verify user email (stub for future implementation)
   */
  async verifyEmail(userId: string): Promise<void> {
    // TODO: Implement email verification
    return
  }

  /**
   * Format user response (remove sensitive fields)
   */
  private formatUserResponse(user: any) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone || null,
      profileImage: user.profileImage || null,
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
