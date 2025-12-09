'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { NIGERIAN_STATES, BEDROOM_OPTIONS, PRICE_RANGES } from '@/utils/nigerian-locale'
import { COMMON_AMENITIES } from '@/utils/nigerian-locale'
import type { SearchFilters } from '@/types'

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void
  loading?: boolean
}

/**
 * Search Filters Component
 * 
 * Provides filtering options for apartment listings
 * 
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<SearchFilters>({})
 * 
 * return (
 *   <SearchFilters
 *     onFiltersChange={setFilters}
 *   />
 * )
 * ```
 */
export function SearchFilters({
  onFiltersChange,
  loading = false,
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
  }

  const handleAmenityToggle = (amenityId: string) => {
    const updated = selectedAmenities.includes(amenityId)
      ? selectedAmenities.filter((id) => id !== amenityId)
      : [...selectedAmenities, amenityId]

    setSelectedAmenities(updated)
    handleFilterChange('amenities', updated.length > 0 ? updated : undefined)
  }

  const handleApplyFilters = () => {
    onFiltersChange(filters)
  }

  const handleReset = () => {
    setFilters({})
    setSelectedAmenities([])
    onFiltersChange({})
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

      {/* State Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State
        </label>
        <Select
          options={NIGERIAN_STATES.map((state) => ({
            value: state.toLowerCase(),
            label: state,
          }))}
          placeholder="Select state"
          value={filters.state || ''}
          onChange={(value) => handleFilterChange('state', value || undefined)}
        />
      </div>

      {/* Bedrooms Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bedrooms
        </label>
        <Select
          options={BEDROOM_OPTIONS.map((num) => {
            const numStr = typeof num === 'string' ? num : num.toString()
            return {
              value: numStr,
              label: numStr,
            }
          })}
          placeholder="Select bedrooms"
          value={filters.bedrooms ? filters.bedrooms.toString() : ''}
          onChange={(e) => {
            const value = (e.target as HTMLSelectElement).value
            handleFilterChange(
              'bedrooms',
              value
                ? value === '5+'
                  ? 5
                  : parseInt(value, 10)
                : undefined
            )
          }}
        />
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price Range
        </label>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="price-range"
                checked={
                  filters.minPrice === range.min && filters.maxPrice === range.max
                }
                onChange={() => {
                  handleFilterChange('minPrice', range.min)
                  handleFilterChange('maxPrice', range.max)
                }}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Amenities
        </label>
        <div className="grid grid-cols-2 gap-3">
          {COMMON_AMENITIES.slice(0, 6).map((amenity) => (
            <label
              key={amenity.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity.id)}
                onChange={() => handleAmenityToggle(amenity.id)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">{amenity.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <Select
          options={[
            { value: 'newest', label: 'Newest' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'rating', label: 'Top Rated' },
          ]}
          placeholder="Sort by"
          value={filters.sortBy || ''}
          onChange={(e) => {
            const value = (e.target as HTMLSelectElement).value as
              | 'newest'
              | 'price-low'
              | 'price-high'
              | 'rating'
              | undefined
            handleFilterChange('sortBy', value || undefined)
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-gray-200">
        <Button
          onClick={handleApplyFilters}
          variant="primary"
          fullWidth
          disabled={loading}
        >
          Apply Filters
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          fullWidth
          disabled={loading}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

export default SearchFilters
