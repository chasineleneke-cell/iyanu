'use client'

import { useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import {
  uploadToCloudinary,
  validateImageFile,
  getImageDimensions,
} from '@/utils/cloudinary'
import { toastError, toastSuccess } from '@/utils/toast'

interface ImageUploadProps {
  onImageSelect: (urls: string[]) => void
  maxImages?: number
  maxSizeMB?: number
  accept?: string
}

interface UploadedImage {
  url: string
  preview: string
  uploading: boolean
  error?: string
}

/**
 * Image Upload Component with Drag-and-Drop
 * 
 * Allows users to upload images via drag-and-drop or file picker.
 * Uploads to Cloudinary and returns secure URLs.
 * 
 * @example
 * ```tsx
 * const [imageUrls, setImageUrls] = useState<string[]>([])
 * 
 * return (
 *   <>
 *     <ImageUpload
 *       onImageSelect={setImageUrls}
 *       maxImages={5}
 *       maxSizeMB={10}
 *     />
 *     <p>Selected: {imageUrls.join(', ')}</p>
 *   </>
 * )
 * ```
 */
export function ImageUpload({
  onImageSelect,
  maxImages = 5,
  maxSizeMB = 5,
  accept = 'image/jpeg,image/png,image/webp',
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file validation and upload
  const handleFiles = useCallback(
    async (files: FileList) => {
      const filesArray = Array.from(files)

      // Check total image count
      if (images.length + filesArray.length > maxImages) {
        toastError(`Maximum ${maxImages} images allowed`)
        return
      }

      // Process each file
      for (const file of filesArray) {
        // Validate file
        const validation = validateImageFile(file, maxSizeMB)
        if (!validation.valid) {
          toastError(validation.error || 'Invalid image')
          continue
        }

        // Create preview
        const reader = new FileReader()
        reader.onload = async (event) => {
          const preview = event.target?.result as string
          const newImage: UploadedImage = {
            url: '',
            preview,
            uploading: true,
          }

          setImages((prev) => [...prev, newImage])

          try {
            // Upload to Cloudinary
            const url = await uploadToCloudinary(file)

            setImages((prev) =>
              prev.map((img) =>
                img.preview === preview
                  ? { ...img, url, uploading: false }
                  : img
              )
            )

            toastSuccess('Image uploaded successfully')
          } catch (error) {
            setImages((prev) =>
              prev.map((img) =>
                img.preview === preview
                  ? {
                      ...img,
                      uploading: false,
                      error: 'Upload failed',
                    }
                  : img
              )
            )
            toastError('Failed to upload image')
          }
        }

        reader.readAsDataURL(file)
      }
    },
    [images.length, maxImages, maxSizeMB]
  )

  // Update parent component with uploaded URLs
  const handleSubmit = useCallback(() => {
    const uploadedUrls = images
      .filter((img) => img.url && !img.uploading)
      .map((img) => img.url)

    if (uploadedUrls.length === 0) {
      toastError('Please upload at least one image')
      return
    }

    onImageSelect(uploadedUrls)
    setImages([])
    toastSuccess('Images added successfully')
  }, [images, onImageSelect])

  // Remove image
  const removeImage = (preview: string) => {
    setImages((prev) => prev.filter((img) => img.preview !== preview))
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="space-y-2">
          <div className="text-3xl">📸</div>
          <p className="font-semibold text-gray-900">
            Drag and drop images here
          </p>
          <p className="text-sm text-gray-600">
            or click to select files
          </p>
          <p className="text-xs text-gray-500">
            Max {maxImages} images, {maxSizeMB}MB each
          </p>
        </div>
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.preview}
              className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square"
            >
              <Image
                src={image.preview}
                alt="Preview"
                fill
                className="object-cover"
              />

              {/* Loading Indicator */}
              {image.uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}

              {/* Error Indicator */}
              {image.error && (
                <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex items-center justify-center text-white text-xs text-center p-2">
                  {image.error}
                </div>
              )}

              {/* Remove Button */}
              {!image.uploading && !image.error && (
                <button
                  onClick={() => removeImage(image.preview)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              )}

              {/* Success Indicator */}
              {image.url && !image.uploading && (
                <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submit Button */}
      {images.some((img) => img.url && !img.uploading) && (
        <Button onClick={handleSubmit} variant="primary" fullWidth>
          Add Images ({images.filter((img) => img.url && !img.uploading).length})
        </Button>
      )}
    </div>
  )
}

export default ImageUpload
