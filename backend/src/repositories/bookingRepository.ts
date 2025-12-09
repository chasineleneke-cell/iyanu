import { prisma } from '../lib/prisma'
import { BookingStatus } from '../utils/constants'
import { Booking } from '../types'

export class BookingRepository {
  /**
   * Get all bookings with filters
   */
  async getAllBookings(
    userId?: string,
    status?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<{ bookings: any[]; total: number }> {
    const where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status
    }

    const bookings = await prisma.booking.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                address: true,
                city: true,
                state: true,
                imageUrls: true,
                landlord: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.booking.count({ where })

    return { bookings, total }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string): Promise<any> {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            property: true,
          },
        },
        tenant: true,
        review: true,
      },
    })
  }

  /**
   * Create booking
   */
  async createBooking(data: {
    userId: string
    unitId: string
    checkInDate: Date
    checkOutDate: Date
    notes?: string
  }): Promise<any> {
    // Get unit with property info to extract propertyId
    const unit = await prisma.unit.findUnique({
      where: { id: data.unitId },
      select: { propertyId: true },
    })

    if (!unit) {
      throw new Error('Unit not found')
    }

    return prisma.booking.create({
      data: {
        tenantId: data.userId,
        propertyId: unit.propertyId,
        unitId: data.unitId,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        notes: data.notes,
        status: 'PENDING',
      },
    })
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(id: string, status: string): Promise<any> {
    return prisma.booking.update({
      where: { id },
      data: { status },
    })
  }

  /**
   * Cancel booking
   */
  async cancelBooking(id: string, reason?: string): Promise<any> {
    return prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancellationReason: reason,
      },
    })
  }

  /**
   * Get bookings for a unit
   */
  async getUnitBookings(unitId: string): Promise<any[]> {
    return prisma.booking.findMany({
      where: { unitId },
      select: {
        checkInDate: true,
        checkOutDate: true,
        status: true,
      },
    })
  }

  /**
   * Check if unit is available for dates
   */
  async isUnitAvailable(unitId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
    const conflicts = await prisma.booking.count({
      where: {
        unitId,
        status: {
          in: [BookingStatus.APPROVED, BookingStatus.PENDING],
        },
        AND: [
          {
            checkInDate: {
              lt: checkOutDate,
            },
          },
          {
            checkOutDate: {
              gt: checkInDate,
            },
          },
        ],
      },
    })

    return conflicts === 0
  }

  /**
   * Get user bookings
   */
  async getUserBookings(userId: string, limit: number = 20, offset: number = 0): Promise<{ bookings: any[]; total: number }> {
    const bookings = await prisma.booking.findMany({
      where: { tenantId: userId },
      take: limit,
      skip: offset,
      include: {
        unit: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                imageUrls: true,
              },
            },
          },
        },
        review: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.booking.count({ where: { tenantId: userId } })

    return { bookings, total }
  }

  /**
   * Get landlord's bookings
   */
  async getLandlordBookings(userId: string, limit: number = 20, offset: number = 0): Promise<{ bookings: any[]; total: number }> {
    const bookings = await prisma.booking.findMany({
      where: {
        unit: {
          property: {
            landlordId: userId,
          },
        },
      },
      take: limit,
      skip: offset,
      include: {
        unit: {
          include: {
            property: true,
          },
        },
        tenant: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.booking.count({
      where: {
        unit: {
          property: {
            landlordId: userId,
          },
        },
      },
    })

    return { bookings, total }
  }

  /**
   * Approve booking
   */
  async approveBooking(id: string): Promise<any> {
    return prisma.booking.update({
      where: { id },
      data: { status: 'APPROVED' },
    })
  }

  /**
   * Reject booking
   */
  async rejectBooking(id: string, reason?: string): Promise<any> {
    return prisma.booking.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
      },
    })
  }
}

export const bookingRepository = new BookingRepository()
