import { listingRepository } from '../repositories/listingRepository'
import { ValidationError, NotFoundError, AuthorizationError } from '../utils/errors'

export class ListingService {
  /**
   * Get all listings with pagination and filters
   */
  async getAllListings(
    page: number = 1,
    limit: number = 20,
    filters: any = {}
  ): Promise<{ listings: any[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const offset = (page - 1) * limit

    const { listings, total } = await listingRepository.getAllListings(limit, offset, {
      state: filters.state,
      minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined,
      bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
    })

    return {
      listings: listings.map(this.formatListing),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get single listing
   */
  async getListingById(id: string): Promise<any> {
    const listing = await listingRepository.getListingById(id)
    if (!listing) {
      throw new NotFoundError("Listing not found")
    }
    return this.formatListingDetail(listing)
  }

  /**
   * Search listings
   */
  async searchListings(query: string, limit: number = 20): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      throw new ValidationError("Search query must be at least 2 characters")
    }

    const listings = await listingRepository.searchListings(query, limit)
    return listings.map(this.formatListing)
  }

  /**
   * Get featured listings
   */
  async getFeaturedListings(limit: number = 6): Promise<any[]> {
    const listings = await listingRepository.getFeaturedListings(limit)
    return listings.map(this.formatListing)
  }

  /**
   * Get listings by landlord
   */
  async getListingsByLandlord(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ listings: any[]; pagination: { page: number; limit: number; total: number; pages: number } }> {
    const offset = (page - 1) * limit

    // Count total
    const total = await (
      await import('../lib/prisma')
    ).prisma.property.count({
      where: { landlordId: userId },
    })

    const listings = await listingRepository.getListingsByLandlord(userId, limit, offset)

    return {
      listings: listings.map(this.formatListing),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Create new property
   */
  async createProperty(userId: string, data: any): Promise<any> {
    const property = await listingRepository.createProperty(userId, data)
    return property
  }

  /**
   * Update property
   */
  async updateProperty(id: string, userId: string, data: any): Promise<any> {
    // Verify ownership
    const property = await listingRepository.getListingById(id)
    if (!property) {
      throw new NotFoundError("Property not found")
    }
    if (property.userId !== userId) {
      throw new AuthorizationError("Unauthorized")
    }

    const updated = await listingRepository.updateProperty(id, data)
    return updated
  }

  /**
   * Delete property
   */
  async deleteProperty(id: string, userId: string): Promise<void> {
    // Verify ownership
    const property = await listingRepository.getListingById(id)
    if (!property) {
      throw new NotFoundError("Property not found")
    }
    if (property.userId !== userId) {
      throw new AuthorizationError("Unauthorized")
    }

    await listingRepository.deleteProperty(id)
  }

  /**
   * Add unit to property
   */
  async addUnit(propertyId: string, userId: string, data: any): Promise<any> {
    // Verify property ownership
    const property = await listingRepository.getListingById(propertyId)
    if (!property) {
      throw new NotFoundError("Property not found")
    }
    if (property.userId !== userId) {
      throw new AuthorizationError("Unauthorized")
    }

    const unit = await listingRepository.addUnit(propertyId, data)
    return unit
  }

  /**
   * Update unit
   */
  async updateUnit(unitId: string, userId: string, data: any): Promise<any> {
    const unit = await listingRepository.getUnitById(unitId)
    if (!unit) {
      throw new NotFoundError("Unit not found")
    }

    // Verify ownership through property
    const property = await listingRepository.getListingById(unit.propertyId)
    if (!property || property.userId !== userId) {
      throw new AuthorizationError("Unauthorized")
    }

    const updated = await listingRepository.updateUnit(unitId, data)
    return updated
  }

  /**
   * Delete unit
   */
  async deleteUnit(unitId: string, userId: string): Promise<void> {
    const unit = await listingRepository.getUnitById(unitId)
    if (!unit) {
      throw new NotFoundError("Unit not found")
    }

    // Verify ownership
    const property = await listingRepository.getListingById(unit.propertyId)
    if (!property || property.userId !== userId) {
      throw new AuthorizationError("Unauthorized")
    }

    await listingRepository.deleteUnit(unitId)
  }

  /**
   * Format listing for response
   */
  private formatListing(listing: any): any {
    const avgRating =
      listing.reviews.length > 0
        ? (listing.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / listing.reviews.length).toFixed(1)
        : 0

    const minPrice =
      listing.units.length > 0
        ? Math.min(...listing.units.map((u: any) => u.pricePerMonth))
        : 0

    return {
      id: listing.id,
      name: listing.name,
      description: listing.description,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      imageUrls: listing.imageUrls,
      amenities: listing.amenities,
      minPrice,
      reviewCount: listing.reviews.length,
      avgRating: typeof avgRating === 'string' ? parseFloat(avgRating) : avgRating,
      landlord: listing.user,
    }
  }

  /**
   * Format listing detail for response
   */
  private formatListingDetail(listing: any): any {
    const avgRating =
      listing.reviews.length > 0
        ? (listing.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / listing.reviews.length).toFixed(1)
        : 0

    return {
      id: listing.id,
      name: listing.name,
      description: listing.description,
      address: listing.address,
      city: listing.city,
      state: listing.state,
      imageUrls: listing.imageUrls,
      amenities: listing.amenities,
      landlord: listing.user,
      units: listing.units,
      reviews: listing.reviews.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        user: r.user,
        createdAt: r.createdAt,
      })),
      avgRating: typeof avgRating === 'string' ? parseFloat(avgRating) : avgRating,
      reviewCount: listing.reviews.length,
      createdAt: listing.createdAt,
    }
  }
}

export const listingService = new ListingService()
