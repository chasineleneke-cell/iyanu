'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/common/Navbar'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/states/EmptyState'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { useGetProperties, useCreateProperty } from '@/hooks/useProperties'
import { toastSuccess, toastError } from '@/utils/toast'

interface PropertyForm {
  name: string
  description: string
  address: string
  state: string
  city: string
  amenities: string[]
}

const AMENITIES = [
  'WiFi', 'Kitchen', 'Parking', 'Pool', 'Gym', 'CCTV', 'Generator', 
  'Water Tank', 'AC', 'Fan', 'Bed', 'TV', 'Sofa', 'Fridge'
]

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
  'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
  'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
]

export default function AdminPropertiesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<PropertyForm>({
    name: '',
    description: '',
    address: '',
    state: '',
    city: '',
    amenities: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: propertiesResponse, isLoading } = useGetProperties()
  const { mutate: createProperty, isPending: isCreating } = useCreateProperty()

  const properties = propertiesResponse?.data || []

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Property name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const onSuccess = () => {
      toastSuccess(editingId ? 'Property updated' : 'Property created')
      setShowModal(false)
      resetForm()
    }
    const onError = (err: any) => {
      toastError(err.message || 'Operation failed')
    }
    // For now, only support create (edit/delete coming soon)
    createProperty({ ...formData, imageUrls: [] }, { onSuccess, onError })
  }

  const handleEdit = (property: any) => {
    setFormData({
      name: property.name,
      description: property.description,
      address: property.address,
      state: property.state,
      city: property.city,
      amenities: property.amenities || []
    })
    setEditingId(property.id)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      toastSuccess('Delete feature coming soon')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      state: '',
      city: '',
      amenities: []
    })
    setEditingId(null)
    setErrors({})
  }

  const openNew = () => {
    resetForm()
    setShowModal(true)
  }

  return (
    <>
      <Navbar isAuthenticated={true} userRole="admin" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Properties</h1>
            <p className="text-gray-600">Manage your apartment properties and units</p>
          </div>
          <Button variant="primary" onClick={openNew}>
            + Add Property
          </Button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <EmptyState 
            title="No Properties" 
            description="You haven't added any properties yet. Start by creating your first property."
            action={{ label: 'Add Property', onClick: () => openNew() }}
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map(property => (
              <div key={property.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition">
                {/* Placeholder Image */}
                <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-4xl">🏠</span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">{property.name}</h3>
                    <p className="text-sm text-gray-600">{property.address}, {property.city}</p>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{property.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-2 rounded">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-semibold">Apartment</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className="font-semibold text-green-600">Active</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {property.amenities.slice(0, 3).map((amenity: any) => (
                        <span key={String(amenity)} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {String(amenity)}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">+{property.amenities.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Link href={`/admin/properties/${property.id}/units`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Units
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(property)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(property.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Property Form Modal */}
      <Modal
        isOpen={showModal}
        title={editingId ? 'Edit Property' : 'Add Property'}
        description={editingId ? 'Update your property details' : 'Create a new property listing'}
        onClose={() => {
          setShowModal(false)
          resetForm()
        }}
      >
          <div className="space-y-4 py-4 max-h-[500px] overflow-y-auto">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Property Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="e.g., Downtown Apartments"
                error={errors.name}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Describe your property..."
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Full address"
                error={errors.address}
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select state</option>
                {NIGERIAN_STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                placeholder="City"
                error={errors.city}
              />
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium mb-2">Amenities</label>
              <div className="grid grid-cols-3 gap-2">
                {AMENITIES.map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="ml-2 text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button 
              variant="outline"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleSubmit}
              disabled={isCreating}
            >
              {isCreating ? 'Saving...' : 'Create Property'}
            </Button>
          </div>
        </Modal>
      </>
    )
  }
