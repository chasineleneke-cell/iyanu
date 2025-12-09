/**
 * Nigerian Localization Utilities
 * Currency formatting, phone validation, state data, etc.
 */

// ===== Currency Formatting =====
export const formatNGN = (amount: number, options?: { showSymbol?: boolean; decimals?: number }): string => {
  const { showSymbol = true, decimals = 0 } = options || {}
  const formatted = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)

  return showSymbol ? formatted : formatted.replace('₦', '').trim()
}

export const parseNGN = (value: string): number => {
  const cleaned = value.replace(/[^\d.]/g, '')
  return parseFloat(cleaned) || 0
}

// ===== Phone Number Handling =====
export const NIGERIAN_PHONE_REGEX = /^(\+234|0)[789]\d{9}$/
export const NIGERIAN_PHONE_PATTERN = '(+234|0)[789]xxxxxxxxx'

export const formatPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, '')

  // Remove leading 0 if exists and add country code
  if (cleaned.startsWith('0')) {
    cleaned = '234' + cleaned.slice(1)
  }

  // Add country code if not present
  if (!cleaned.startsWith('234')) {
    cleaned = '234' + cleaned
  }

  return '+' + cleaned
}

export const displayPhoneNumber = (phone: string): string => {
  const cleaned = formatPhoneNumber(phone).replace('+234', '0')
  return cleaned.slice(0, 4) + ' ' + cleaned.slice(4, 7) + ' ' + cleaned.slice(7)
}

export const validatePhoneNumber = (phone: string): boolean => {
  const formatted = formatPhoneNumber(phone)
  return /^\+234[789]\d{9}$/.test(formatted)
}

// ===== Nigerian States =====
export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
  'Federal Capital Territory',
]

export const getStateName = (stateCode: string): string | undefined => {
  return NIGERIAN_STATES.find((s) => s.toLowerCase() === stateCode.toLowerCase())
}

// ===== Date & Time Formatting =====
export const formatDateNG = (date: Date | string, format: 'short' | 'long' = 'short'): string => {
  const d = new Date(date)
  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }
      : {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }

  return d.toLocaleDateString('en-NG', options)
}

export const formatTimeNG = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export const formatDateTimeNG = (date: Date | string): string => {
  return `${formatDateNG(date, 'short')} ${formatTimeNG(date)}`
}

// ===== Common Amenities in Nigeria =====
export const COMMON_AMENITIES = [
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'parking', name: 'Parking', icon: '🚗' },
  { id: 'gen', name: 'Generator', icon: '⚡' },
  { id: 'water', name: '24/7 Water', icon: '💧' },
  { id: 'ac', name: 'Air Conditioning', icon: '❄️' },
  { id: 'kitchen', name: 'Fitted Kitchen', icon: '🍳' },
  { id: 'balcony', name: 'Balcony', icon: '🌳' },
  { id: 'tv_cable', name: 'TV Cable', icon: '📺' },
  { id: 'security', name: '24/7 Security', icon: '🔒' },
  { id: 'gym', name: 'Gym', icon: '💪' },
  { id: 'pool', name: 'Swimming Pool', icon: '🏊' },
  { id: 'garden', name: 'Garden', icon: '🌲' },
]

// ===== Room Count Variants =====
export const BEDROOM_OPTIONS = [
  { value: 1, label: '1 Bedroom' },
  { value: 2, label: '2 Bedrooms' },
  { value: 3, label: '3 Bedrooms' },
  { value: 4, label: '4 Bedrooms' },
  { value: 5, label: '5+ Bedrooms' },
]

export const BATHROOM_OPTIONS = [
  { value: 1, label: '1 Bathroom' },
  { value: 2, label: '2 Bathrooms' },
  { value: 3, label: '3 Bathrooms' },
  { value: 4, label: '4+ Bathrooms' },
]

// ===== Price Ranges =====
export const PRICE_RANGES = [
  { min: 0, max: 50000, label: 'Under ₦50k' },
  { min: 50000, max: 100000, label: '₦50k - ₦100k' },
  { min: 100000, max: 200000, label: '₦100k - ₦200k' },
  { min: 200000, max: 500000, label: '₦200k - ₦500k' },
  { min: 500000, max: 1000000, label: '₦500k - ₦1M' },
  { min: 1000000, max: Infinity, label: 'Above ₦1M' },
]
