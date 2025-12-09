import { prisma } from '../lib/prisma'
import { BookingStatus, PropertyStatus } from '../utils/constants'
import { Property, Unit } from '../types'

export class ListingRepository {
  /**
   * Get all listings with filters
   */
  async getAllListings(
    limit: number = 20,
    offset: number = 0,
    filters: {
      state?: string
      minPrice?: number
      maxPrice?: number
      bedrooms?: number
    } = {}
  ): Promise<{ listings: any[]; total: number }> {
    const where: any = {
      status: PropertyStatus.ACTIVE,
      deletedAt: null,
    }

    if (filters.state) {
      where.state = filters.state
    }

    // Price filter on units
    if (filters.minPrice || filters.maxPrice) {
      where.units = {
        some: {
          pricePerMonth: {
            gte: filters.minPrice || 0,
            lte: filters.maxPrice || 999999999,
          },
        },
      }
    }

    // Bedroom filter
    if (filters.bedrooms) {
      where.units = {
        some: {
          bedroomCount: filters.bedrooms,
        },
      }
    }

    const listings = await prisma.property.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        landlord: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        units: {
          select: {
            id: true,
            unitNumber: true,
            bedroomCount: true,
            bathroomCount: true,
            size: true,
            pricePerMonth: true,
            isAvailable: true,
            imageUrls: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.property.count({ where })

    return { listings, total }
  }

  /**
   * Get single listing by ID
   */
  async getListingById(id: string): Promise<any> {
    return prisma.property.findUnique({
      where: { id },
      include: {
        landlord: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            profileImage: true,
          },
        },
        units: {
          include: {
            bookings: {
              where: {
                status: 'APPROVED',
              },
              select: {
                checkInDate: true,
                checkOutDate: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   * Search listings
   */
  async searchListings(query: string, limit: number = 20): Promise<any[]> {
    return prisma.property.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { city: { contains: query } },
          { address: { contains: query } },
        ],
        status: PropertyStatus.ACTIVE,
        deletedAt: null,
      },
      take: limit,
      include: {
        units: {
          select: {
            id: true,
            unitNumber: true,
            pricePerMonth: true,
            bedroomCount: true,
          },
        },
      },
    })
  }

  /**
   * Get featured listings
   */
  async getFeaturedListings(limit: number = 6): Promise<any[]> {
    return prisma.property.findMany({
      where: { 
        status: PropertyStatus.ACTIVE,
        deletedAt: null,
      },
      take: limit,
      include: {
        landlord: {
          select: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        units: {
          select: {
            id: true,
            pricePerMonth: true,
            bedroomCount: true,
            bathroomCount: true,
            imageUrls: true,
          },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Get listings by landlord
   */
  async getListingsByLandlord(landlordId: string, limit: number = 20, offset: number = 0): Promise<Property[]> {
    return prisma.property.findMany({
      where: { landlordId },
      take: limit,
      skip: offset,
      include: {
        units: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Create property
   */
  async createProperty(landlordId: string, data: any): Promise<any> {
    const imageUrls = Array.isArray(data.imageUrls) ? JSON.stringify(data.imageUrls) : JSON.stringify([])
    const amenities = Array.isArray(data.amenities) ? JSON.stringify(data.amenities) : JSON.stringify([])

    return prisma.property.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        imageUrls: imageUrls as any,
        amenities: amenities as any,
        landlordId,
        status: PropertyStatus.ACTIVE,
      },
    })
  }

  /**
   * Update property
   */
  async updateProperty(id: string, data: any): Promise<any> {
    const updateData: any = {
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      state: data.state,
    }

    if (data.imageUrls) {
      updateData.imageUrls = Array.isArray(data.imageUrls) ? JSON.stringify(data.imageUrls) : JSON.stringify([])
    }

    if (data.amenities) {
      updateData.amenities = Array.isArray(data.amenities) ? JSON.stringify(data.amenities) : JSON.stringify([])
    }

    return prisma.property.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * Delete property
   */
  async deleteProperty(id: string): Promise<void> {
    await prisma.property.update({
      where: { id },
      data: { deletedAt: new Date() },
    })
  }

  /**
   * Add unit to property
   */
  async addUnit(propertyId: string, data: any): Promise<any> {
    const imageUrls = Array.isArray(data.imageUrls) ? JSON.stringify(data.imageUrls) : JSON.stringify([])
    const amenities = Array.isArray(data.amenities) ? JSON.stringify(data.amenities) : JSON.stringify([])

    return prisma.unit.create({
      data: {
        propertyId,
        unitNumber: data.unitNumber,
        bedroomCount: data.bedroomCount,
        bathroomCount: data.bathroomCount,
        size: data.size,
        pricePerMonth: data.pricePerMonth,
        imageUrls: imageUrls as any,
        amenities: amenities as any,
        isAvailable: true,
      },
    })
  }

  /**
   * Update unit
   */
  async updateUnit(id: string, data: any): Promise<any> {
    const updateData: any = {
      unitNumber: data.unitNumber,
      bedroomCount: data.bedroomCount,
      bathroomCount: data.bathroomCount,
      size: data.size,
      pricePerMonth: data.pricePerMonth,
    }

    if (data.imageUrls) {
      updateData.imageUrls = Array.isArray(data.imageUrls) ? JSON.stringify(data.imageUrls) : JSON.stringify([])
    }

    if (data.amenities) {
      updateData.amenities = Array.isArray(data.amenities) ? JSON.stringify(data.amenities) : JSON.stringify([])
    }

    return prisma.unit.update({
      where: { id },
      data: updateData,
    })
  }

  /**
   * Delete unit
   */
  async deleteUnit(id: string): Promise<void> {
    await prisma.unit.delete({
      where: { id },
    })
  }

  /**
   * Get unit by ID
   */
  async getUnitById(id: string): Promise<any | null> {
    return prisma.unit.findUnique({
      where: { id },
    })
  }
}

export const listingRepository = new ListingRepository()
