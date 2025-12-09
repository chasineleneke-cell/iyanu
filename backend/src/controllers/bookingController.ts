import { Response, NextFunction } from 'express'
import { bookingService } from '../services/bookingService'
import { bookingSchemas } from '../utils/validations'
import { AuthRequest } from '../types'
import { AuthenticationError, ValidationError } from '../utils/errors'

export class BookingController {
  /**
   * Create booking
   * POST /api/bookings
   */
  async createBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const validated = bookingSchemas.createBooking.parse(req.body)
      const booking = await bookingService.createBooking(req.user.userId, validated)

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get user's bookings
   * GET /api/bookings
   */
  async getMyBookings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20

      const result = await bookingService.getUserBookings(req.user.userId, page, limit)

      res.status(200).json({
        success: true,
        message: 'Bookings fetched successfully',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get landlord's bookings
   * GET /api/bookings/landlord/all
   */
  async getLandlordBookings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20

      const result = await bookingService.getLandlordBookings(req.user.userId, page, limit)

      res.status(200).json({
        success: true,
        message: 'Landlord bookings fetched successfully',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get single booking
   * GET /api/bookings/:id
   */
  async getBookingById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const { id } = req.params
      const booking = await bookingService.getBookingById(id, req.user.userId)

      res.status(200).json({
        success: true,
        message: 'Booking fetched successfully',
        data: booking,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Cancel booking
   * POST /api/bookings/:id/cancel
   */
  async cancelBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const { id } = req.params
      const { reason } = req.body

      const booking = await bookingService.cancelBooking(id, req.user.userId, reason)

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Approve booking
   * POST /api/bookings/:id/approve
   */
  async approveBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const { id } = req.params
      const booking = await bookingService.approveBooking(id, req.user.userId)

      res.status(200).json({
        success: true,
        message: 'Booking approved successfully',
        data: booking,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Reject booking
   * POST /api/bookings/:id/reject
   */
  async rejectBooking(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const { id } = req.params
      const { reason } = req.body

      const booking = await bookingService.rejectBooking(id, req.user.userId, reason)

      res.status(200).json({
        success: true,
        message: 'Booking rejected successfully',
        data: booking,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Check unit availability
   * GET /api/bookings/units/:unitId/availability
   */
  async checkAvailability(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { unitId } = req.params
      const { checkInDate, checkOutDate } = req.query

      if (!checkInDate || !checkOutDate) {
        throw new ValidationError('Check-in and check-out dates are required')
      }

      const isAvailable = await bookingService.getUnitAvailability(
        unitId,
        checkInDate as string,
        checkOutDate as string
      )

      res.status(200).json({
        success: true,
        message: 'Availability checked',
        data: { available: isAvailable },
      })
    } catch (error) {
      next(error)
    }
  }
}

export const bookingController = new BookingController()
