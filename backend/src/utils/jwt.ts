import jwt from 'jsonwebtoken'
import { JwtPayload, Tokens } from '../types'

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'secret-access-key'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'secret-refresh-key'
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m'
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d'

/**
 * Generate access and refresh tokens
 */
export function generateTokens(payload: JwtPayload): Tokens {
  const accessToken = jwt.sign(payload as any, ACCESS_SECRET as any, {
    expiresIn: '15m',
  } as any)

  const refreshToken = jwt.sign(payload as any, REFRESH_SECRET as any, {
    expiresIn: '7d',
  } as any)

  return { accessToken, refreshToken }
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET as any) as JwtPayload
  } catch (error) {
    return null
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET as any) as JwtPayload
  } catch (error) {
    return null
  }
}

/**
 * Decode token without verification
 */
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload
  } catch (error) {
    return null
  }
}
