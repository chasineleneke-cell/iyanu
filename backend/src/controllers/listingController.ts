import { Response, NextFunction } from 'express'
import { listingService } from '../services/listingService'
import { listingSchemas } from '../utils/validations'
import { AuthRequest } from '../types'
import { AuthenticationError, ValidationError } from '../utils/errors'

export class ListingController {
  /**
   * Get all listings with filters
   * GET /api/listings
   */
  async getAllListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
      const filters = {
        state: req.query.state as string,
        minPrice: req.query.minPrice as string,
        maxPrice: req.query.maxPrice as string,
        bedrooms: req.query.bedrooms as string,
      }

      const result = await listingService.getAllListings(page, limit, filters)

      res.status(200).json({
        success: true,
        message: 'Listings fetched successfully',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get single listing
   * GET /api/listings/:id
   */
  async getListingById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const listing = await listingService.getListingById(id)

      res.status(200).json({
        success: true,
        message: 'Listing fetched successfully',
        data: listing,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Search listings
   * GET /api/listings/search?q=query
   */
  async searchListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.q as string
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20

      if (!query) {
        throw new ValidationError('Search query is required')
      }

      const listings = await listingService.searchListings(query, limit)

      res.status(200).json({
        success: true,
        message: 'Search completed successfully',
        data: listings,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get featured listings
   * GET /api/listings/featured
   */
  async getFeaturedListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 6
      const listings = await listingService.getFeaturedListings(limit)

      res.status(200).json({
        success: true,
        message: 'Featured listings fetched successfully',
        data: listings,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get my listings (landlord only)
   * GET /api/listings/my-listings
   */
  async getMyListings(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const page = req.query.page ? parseInt(req.query.page as string) : 1
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20

      const result = await listingService.getListingsByLandlord(req.user.userId, page, limit)

      res.status(200).json({
        success: true,
        message: 'Your listings fetched successfully',
        data: result,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Create new property (landlord only)
   * POST /api/listings
   */
  async createProperty(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      // Validate
      const validated = listingSchemas.createProperty.parse(req.body)

      const property = await listingService.createProperty(req.user.userId, validated)

      res.status(201).json({
        success: true,
        message: 'Property created successfully',
        data: property,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update property (landlord only)
   * PUT /api/listings/:id
   */
  async updateProperty(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const { id } = req.params
      const validated = listingSchemas.updateProperty.parse(req.body)

      const property = await listingService.updateProperty(id, req.user.userId, validated)

      res.status(200).json({
        success: true,
        message: 'Property updated successfully',
        data: property,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete property (landlord only)
   * DELETE /api/listings/:id
   */
  async deleteProperty(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const { id } = req.params
      await listingService.deleteProperty(id, req.user.userId)

      res.status(200).json({
        success: true,
        message: 'Property deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Add unit to property (landlord only)
   * POST /api/listings/:id/units
   */
  async addUnit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const { id } = req.params
      const validated = listingSchemas.addUnit.parse(req.body)

      const unit = await listingService.addUnit(id, req.user.userId, validated)

      res.status(201).json({
        success: true,
        message: 'Unit added successfully',
        data: unit,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update unit (landlord only)
   * PUT /api/listings/:propertyId/units/:unitId
   */
  async updateUnit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const { unitId } = req.params
      const validated = listingSchemas.addUnit.parse(req.body)

      const unit = await listingService.updateUnit(unitId, req.user.userId, validated)

      res.status(200).json({
        success: true,
        message: 'Unit updated successfully',
        data: unit,
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Delete unit (landlord only)
   * DELETE /api/listings/:propertyId/units/:unitId
   */
  async deleteUnit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('User not found')
      }

      const { unitId } = req.params
      await listingService.deleteUnit(unitId, req.user.userId)

      res.status(200).json({
        success: true,
        message: 'Unit deleted successfully',
      })
    } catch (error) {
      next(error)
    }
  }
}

export const listingController = new ListingController()
