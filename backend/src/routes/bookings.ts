import { Router } from 'express'
import { bookingController } from '../controllers/bookingController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

// POST /api/bookings - Create booking
router.post('/', authMiddleware, (req, res, next) => bookingController.createBooking(req, res, next))

// GET /api/bookings - Get user's bookings
router.get('/', authMiddleware, (req, res, next) => bookingController.getMyBookings(req, res, next))

// GET /api/bookings/landlord/all - Get landlord's bookings
router.get('/landlord/all', authMiddleware, (req, res, next) =>
  bookingController.getLandlordBookings(req, res, next)
)

// GET /api/bookings/units/:unitId/availability - Check availability
router.get('/units/:unitId/availability', (req, res, next) =>
  bookingController.checkAvailability(req, res, next)
)

// GET /api/bookings/:id - Get single booking
router.get('/:id', authMiddleware, (req, res, next) => bookingController.getBookingById(req, res, next))

// POST /api/bookings/:id/cancel - Cancel booking
router.post('/:id/cancel', authMiddleware, (req, res, next) =>
  bookingController.cancelBooking(req, res, next)
)

// POST /api/bookings/:id/approve - Approve booking (landlord only)
router.post('/:id/approve', authMiddleware, (req, res, next) =>
  bookingController.approveBooking(req, res, next)
)

// POST /api/bookings/:id/reject - Reject booking (landlord only)
router.post('/:id/reject', authMiddleware, (req, res, next) =>
  bookingController.rejectBooking(req, res, next)
)

export default router
