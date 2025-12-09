import { bookingRepository } from '../repositories/bookingRepository'
import { listingRepository } from '../repositories/listingRepository'
import { ValidationError, NotFoundError, AuthorizationError } from '../utils/errors'
import { BookingStatus } from '../utils/constants'

export class BookingService {
  /**
   * Create booking
   */
  async createBooking(userId: string, data: any): Promise<any> {
    // Verify unit exists
    const unit = await listingRepository.getUnitById(data.unitId)
    if (!unit) {
      throw new NotFoundError("Unit not found")
    }

    // Parse dates
    const checkInDate = new Date(data.checkInDate)
    const checkOutDate = new Date(data.checkOutDate)

    // Validate dates
    if (checkInDate >= checkOutDate) {
      throw new ValidationError("Check-out date must be after check-in date")
    }

    if (checkInDate < new Date()) {
      throw new ValidationError("Check-in date must be in the future")
    }

    // Check availability
    const isAvailable = await bookingRepository.isUnitAvailable(data.unitId, checkInDate, checkOutDate)
    if (!isAvailable) {
      throw new ValidationError("Unit is not available for the selected dates")
    }

    // Create booking
    const booking = await bookingRepository.createBooking({
      userId,
      unitId: data.unitId,
      checkInDate,
      checkOutDate,
      notes: data.notes,
    })

    return booking
  }

  /**
   * Get user's bookings
   */
  async getUserBookings(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const offset = (page - 1) * limit

    const { bookings, total } = await bookingRepository.getUserBookings(userId, limit, offset)

    return {
      bookings: bookings.map(this.formatBooking),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get landlord's bookings
   */
  async getLandlordBookings(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const offset = (page - 1) * limit

    const { bookings, total } = await bookingRepository.getLandlordBookings(userId, limit, offset)

    return {
      bookings: bookings.map(this.formatBooking),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(id: string, userId: string): Promise<any> {
    const booking = await bookingRepository.getBookingById(id)
    if (!booking) {
      throw new NotFoundError("Booking not found")
    }

    // Verify access (user or landlord)
    if (booking.userId !== userId && booking.unit.property.userId !== userId) {
      throw new AuthorizationError("Unauthorized")
    }

    return this.formatBooking(booking)
  }

  /**
   * Cancel booking
   */
  async cancelBooking(id: string, userId: string, reason?: string): Promise<any> {
    const booking = await bookingRepository.getBookingById(id)
    if (!booking) {
      throw new NotFoundError("Booking not found")
    }

    // Verify ownership
    if (booking.userId !== userId) {
      throw new AuthorizationError("Unauthorized")
    }

    // Check if can be cancelled
    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.APPROVED) {
      throw new ValidationError("Cannot cancel this booking")
    }

    const cancelled = await bookingRepository.cancelBooking(id, reason)
    return this.formatBooking(cancelled)
  }

  /**
   * Approve booking (landlord only)
   */
  async approveBooking(id: string, userId: string): Promise<any> {
    const booking = await bookingRepository.getBookingById(id)
    if (!booking) {
      throw new NotFoundError("Booking not found")
    }

    // Verify landlord
    if (booking.unit.property.userId !== userId) {
      throw new AuthorizationError("Unauthorized")
    }

    // Check status
    if (booking.status !== BookingStatus.PENDING) {
      throw new ValidationError("Booking is not pending")
    }

    const approved = await bookingRepository.approveBooking(id)
    return this.formatBooking(approved)
  }

  /**
   * Reject booking (landlord only)
   */
  async rejectBooking(id: string, userId: string, reason?: string): Promise<any> {
    const booking = await bookingRepository.getBookingById(id)
    if (!booking) {
      throw new NotFoundError("Booking not found")
    }

    // Verify landlord
    if (booking.unit.property.userId !== userId) {
      throw new AuthorizationError("Unauthorized")
    }

    // Check status
    if (booking.status !== BookingStatus.PENDING) {
      throw new ValidationError("Booking is not pending")
    }

    const rejected = await bookingRepository.rejectBooking(id, reason)
    return this.formatBooking(rejected)
  }

  /**
   * Get unit availability
   */
  async getUnitAvailability(unitId: string, checkInDate: string, checkOutDate: string): Promise<boolean> {
    const isAvailable = await bookingRepository.isUnitAvailable(
      unitId,
      new Date(checkInDate),
      new Date(checkOutDate)
    )
    return isAvailable
  }

  /**
   * Calculate booking duration in nights
   */
  private calculateNights(checkIn: Date, checkOut: Date): number {
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  }

  /**
   * Format booking for response
   */
  private formatBooking(booking: any): any {
    const nights = this.calculateNights(booking.checkInDate, booking.checkOutDate)
    const totalPrice = nights * booking.unit.pricePerMonth

    return {
      id: booking.id,
      userId: booking.tenantId,
      unitId: booking.unitId,
      checkInDate: booking.checkInDate,
      checkOutDate: booking.checkOutDate,
      nights,
      totalPrice,
      status: booking.status,
      notes: booking.notes,
      unit: booking.unit,
      createdAt: booking.createdAt,
    }
  }
}

export const bookingService = new BookingService()
