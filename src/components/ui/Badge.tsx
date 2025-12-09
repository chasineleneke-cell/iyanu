/**
 * Badge Component
 * Status badge for listings, bookings, payments, etc.
 */

import clsx from 'clsx'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'pending'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children, ...props }) => {
  const variantClasses = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    pending: 'bg-orange-100 text-orange-800',
  }

  return (
    <span
      className={clsx('inline-block px-3 py-1 rounded-full text-xs font-semibold', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge
