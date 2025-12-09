import { prisma } from '../lib/prisma'
import { UserRoles } from '../utils/constants'
import { CreateUserInput, UpdateUserInput } from '../types'

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<any> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
  }

  /**
   * Find user by ID with profile
   */
  async findById(id: string): Promise<any> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        tenantProfile: true,
        landlordProfile: true,
      },
    })
  }

  /**
   * Create new user
   */
  async create(data: CreateUserInput & { hashedPassword: string }): Promise<any> {
    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.hashedPassword,
        phone: data.phone || '',
        state: 'Lagos', // Default state - can be updated via profile
        role: data.role || 'TENANT',
        profileImage: null,
      },
    })
  }

  /**
   * Update user
   */
  async update(id: string, data: UpdateUserInput & { hashedPassword?: string }): Promise<any> {
    const updateData: any = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    }

    if (data.hashedPassword) {
      updateData.password = data.hashedPassword
    }

    return prisma.user.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * Update user profile image
   */
  async updateProfileImage(id: string, imageUrl: string): Promise<any> {
    return prisma.user.update({
      where: { id },
      data: { profileImage: imageUrl },
    })
  }

  /**
   * Get user by email with password (for login)
   */
  async findByEmailWithPassword(email: string): Promise<any> {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        password: true,
        phone: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
    })
  }

  /**
   * Get user dashboard stats
   */
  async getUserStats(userId: string): Promise<any> {
    const user = await this.findById(userId)
    if (!user) return null

    if (user.role === 'TENANT') {
      const bookings = await prisma.booking.count({
        where: { tenantId: userId },
      })
      const reviews = await prisma.review.count({
        where: { tenantId: userId },
      })

      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        bookings,
        reviews,
      }
    }

    if (user.role === 'LANDLORD') {
      const properties = await prisma.property.count({
        where: { landlordId: userId },
      })
      const bookings = await prisma.booking.count({
        where: {
          unit: {
            property: { landlordId: userId },
          },
        },
      })

      return {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
        properties,
        bookings,
      }
    }

    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })
    return !!user
  }

  /**
   * Get all users (admin only)
   */
  async getAll(limit: number = 50, offset: number = 0): Promise<any[]> {
    return prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    }) as Promise<any[]>
  }

  /**
   * Delete user (admin only)
   */
  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    })
  }
}

// Export singleton instance
export const userRepository = new UserRepository()
