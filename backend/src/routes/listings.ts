import { Router } from 'express'
import { listingController } from '../controllers/listingController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

// GET /api/listings - Get all listings with filters
router.get('/', (req, res, next) => listingController.getAllListings(req, res, next))

// GET /api/listings/featured - Get featured listings
router.get('/featured', (req, res, next) => listingController.getFeaturedListings(req, res, next))

// GET /api/listings/search - Search listings
router.get('/search', (req, res, next) => listingController.searchListings(req, res, next))

// GET /api/listings/my-listings - Get user's listings (landlord only)
router.get('/my-listings', authMiddleware, (req, res, next) => listingController.getMyListings(req, res, next))

// POST /api/listings - Create new property (landlord only)
router.post('/', authMiddleware, (req, res, next) => listingController.createProperty(req, res, next))

// GET /api/listings/:id - Get single listing
router.get('/:id', (req, res, next) => listingController.getListingById(req, res, next))

// PUT /api/listings/:id - Update property (landlord only)
router.put('/:id', authMiddleware, (req, res, next) => listingController.updateProperty(req, res, next))

// DELETE /api/listings/:id - Delete property (landlord only)
router.delete('/:id', authMiddleware, (req, res, next) => listingController.deleteProperty(req, res, next))

// POST /api/listings/:id/units - Add unit (landlord only)
router.post('/:id/units', authMiddleware, (req, res, next) => listingController.addUnit(req, res, next))

// PUT /api/listings/:propertyId/units/:unitId - Update unit (landlord only)
router.put('/:propertyId/units/:unitId', authMiddleware, (req, res, next) =>
  listingController.updateUnit(req, res, next)
)

// DELETE /api/listings/:propertyId/units/:unitId - Delete unit (landlord only)
router.delete('/:propertyId/units/:unitId', authMiddleware, (req, res, next) =>
  listingController.deleteUnit(req, res, next)
)

export default router
