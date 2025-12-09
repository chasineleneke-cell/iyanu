/**
 * Input Component
 * Reusable text input with validation states and Nigerian phone support
 */

import React from 'react'
import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  isNigerianPhone?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, isNigerianPhone = false, className, ...props }, ref) => {
    const inputClasses = clsx(
      'w-full px-4 py-2.5 border rounded-lg font-medium transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-blue-500',
      error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white',
      isNigerianPhone && 'placeholder:text-sm',
      icon && 'pl-10',
      className,
    )

    return (
      <div className="w-full">
        {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{icon}</div>}
          <input
            ref={ref}
            className={inputClasses}
            placeholder={isNigerianPhone ? '(+234 or 0) 9XX XXXXXXX' : props.placeholder}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export default Input
