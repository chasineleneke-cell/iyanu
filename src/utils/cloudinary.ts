/**
 * Cloudinary Configuration and Utilities
 * 
 * Handles image uploads to Cloudinary and URL management
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo'
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'unsigned-upload'

interface UploadResponse {
  event?: string
  info?: {
    secure_url: string
    public_id: string
    width: number
    height: number
    bytes: number
  }
}

/**
 * Upload image to Cloudinary
 * 
 * @example
 * ```tsx
 * const imageUrl = await uploadToCloudinary(file)
 * ```
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image to Cloudinary')
  }
}

/**
 * Generate Cloudinary URL with transformations
 * 
 * @example
 * ```tsx
 * const thumbnailUrl = generateCloudinaryUrl(publicId, {
 *   width: 200,
 *   height: 200,
 *   crop: 'fill',
 *   quality: 'auto'
 * })
 * ```
 */
interface TransformOptions {
  width?: number
  height?: number
  crop?: 'fill' | 'fit' | 'pad'
  quality?: 'auto' | 'lowest' | 'low' | 'medium' | 'high' | 'highest'
  gravity?: string
}

export function generateCloudinaryUrl(
  publicId: string,
  options: TransformOptions = {}
): string {
  const {
    width,
    height,
    crop = 'fit',
    quality = 'auto',
    gravity = 'auto',
  } = options

  const transformations = [
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
    quality && `q_${quality}`,
    gravity && `g_${gravity}`,
  ]
    .filter(Boolean)
    .join(',')

  const url = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`

  if (transformations) {
    return `${url}/${transformations}/${publicId}`
  }

  return `${url}/${publicId}`
}

/**
 * Delete image from Cloudinary
 * Note: Requires backend support or unsigned delete token
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    // This would typically be done through your backend API
    // to keep Cloudinary credentials secure
    await fetch(`/api/cloudinary/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    })
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    throw new Error('Failed to delete image')
  }
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSizeMB = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
): { valid: boolean; error?: string } {
  const maxSizeBytes = maxSizeMB * 1024 * 1024

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Image type must be one of: ${allowedTypes.join(', ')}`,
    }
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `Image size must not exceed ${maxSizeMB}MB`,
    }
  }

  return { valid: true }
}

/**
 * Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{width: number; height: number}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        reject(new Error('Failed to read image dimensions'))
      }
      img.src = event.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsDataURL(file)
  })
}
