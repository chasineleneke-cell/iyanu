/**
 * Modal Component
 * Reusable modal/dialog component with overlay
 */

import React, { useEffect } from 'react'
import clsx from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeButton?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-lg',
    xl: 'w-full max-w-xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className={clsx('relative bg-white rounded-lg shadow-xl z-10', sizeClasses[size])}>
        {/* Header */}
        {(title || closeButton) && (
          <div className="flex items-center justify-between border-b border-gray-200 p-6">
            <div>
              {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
              {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
            </div>
            {closeButton && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                ✕
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Footer */}
        {footer && <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex gap-3 justify-end rounded-b-lg">{footer}</div>}
      </div>
    </div>
  )
}

export default Modal
