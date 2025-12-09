/**
 * Select/Dropdown Component
 * Reusable select dropdown for forms
 */

import React from 'react'
import clsx from 'clsx'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}
        <select
          ref={ref}
          className={clsx(
            'w-full px-4 py-2.5 border rounded-lg font-medium transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white',
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'

export default Select
