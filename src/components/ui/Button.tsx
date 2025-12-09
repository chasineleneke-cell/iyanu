/**
 * Button Component
 * Reusable button with multiple variants and sizes
 */

import React from 'react'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, fullWidth = false, className, children, icon, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400',
      secondary: 'bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400',
      danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400',
      success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 disabled:opacity-50',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-gray-400',
    }

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          isLoading && 'opacity-70 cursor-wait',
          className,
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <span className="animate-spin">⏳</span> : icon}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

export default Button
