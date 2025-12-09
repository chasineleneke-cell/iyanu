'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/common/Navbar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Skeleton } from '@/components/ui/Skeleton'
import Modal from '@/components/ui/Modal'
import { useGetProfile, useUpdateProfile, useChangePassword } from '@/hooks/useAuth'
import { toastSuccess, toastError } from '@/utils/toast'
import { validatePhoneNumber } from '@/utils/nigerian-locale'

export default function TenantProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'avatar'>('profile')
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Profile form
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    state: '',
    bio: ''
  })

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  // Hooks
  const { data: profile, isLoading } = useGetProfile()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
  const { mutate: changePassword, isPending: isChanging } = useChangePassword()

  // Load profile data
  useState(() => {
    if (profile) {
      setProfileData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        state: profile.state || '',
        bio: ''
      })
    }
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    setProfileErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    setPasswordErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateProfileForm = () => {
    const errors: Record<string, string> = {}

    if (!profileData.firstName.trim()) errors.firstName = 'First name is required'
    if (!profileData.lastName.trim()) errors.lastName = 'Last name is required'
    if (!profileData.email.includes('@')) errors.email = 'Valid email is required'
    if (profileData.phone && !validatePhoneNumber(profileData.phone)) {
      errors.phone = 'Invalid Nigerian phone number'
    }

    setProfileErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {}

    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required'
    if (!passwordData.newPassword || passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters'
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setPasswordErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUpdateProfile = () => {
    if (!validateProfileForm()) return

    updateProfile(profileData, {
      onSuccess: () => {
        toastSuccess('Profile updated successfully')
      },
      onError: (err: any) => {
        toastError(err.message || 'Failed to update profile')
      }
    })
  }

  const handleChangePassword = () => {
    if (!validatePasswordForm()) return

    changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    }, {
      onSuccess: () => {
        toastSuccess('Password changed successfully')
        setShowPasswordModal(false)
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      },
      onError: (err: any) => {
        toastError(err.message || 'Failed to change password')
      }
    })
  }

  if (isLoading) {
    return (
      <>
        <Navbar isAuthenticated={true} userRole="tenant" />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full" />
        </main>
      </>
    )
  }

  const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River',
    'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
    'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
  ]

  return (
    <>
      <Navbar isAuthenticated={true} userRole="tenant" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          {(['profile', 'password', 'avatar'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  placeholder="First name"
                  error={profileErrors.firstName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  placeholder="Last name"
                  error={profileErrors.lastName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  placeholder="Email address"
                  error={profileErrors.email}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  placeholder="+234 or 0..."
                  error={profileErrors.phone}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">State</label>
                <select
                  name="state"
                  value={profileData.state}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell landlords about yourself..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={handleUpdateProfile}
                disabled={isUpdating}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white border rounded-lg p-6">
            <p className="text-gray-600 mb-6">Change your password to keep your account secure</p>
            
            <Button 
              variant="primary"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </Button>
          </div>
        )}

        {/* Avatar Tab */}
        {activeTab === 'avatar' && (
          <div className="bg-white border rounded-lg p-6">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">👤</span>
              </div>
              
              <Input 
                type="file"
                accept="image/*"
                className="mb-4"
              />
              
              <Button variant="primary">
                Upload Avatar
              </Button>
              
              <p className="text-sm text-gray-500 mt-4">
                Recommended size: 400x400px (JPG, PNG)
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        title="Change Password"
          description="Enter your current password and new password"
          onClose={() => setShowPasswordModal(false)}
        >
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <Input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Current password"
                error={passwordErrors.currentPassword}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <Input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="New password (min 8 characters)"
                error={passwordErrors.newPassword}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                error={passwordErrors.confirmPassword}
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              variant="outline"
              onClick={() => setShowPasswordModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={handleChangePassword}
              disabled={isChanging}
            >
              {isChanging ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </Modal>
    </>
  )
}
