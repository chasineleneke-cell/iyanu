'use client'

import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  purple: 'bg-purple-50 text-purple-700',
  orange: 'bg-orange-50 text-orange-700',
}

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
}

/**
 * KPI Card Component for Dashboard
 * 
 * Displays key performance indicators with optional trend indicator
 * 
 * @example
 * ```tsx
 * <KPICard
 *   title="Total Revenue"
 *   value="₦2.5M"
 *   change={12.5}
 *   changeLabel="vs last month"
 *   icon="💰"
 *   color="green"
 * />
 * ```
 */
export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  color = 'blue',
}: KPICardProps) {
  const isPositive = change ? change > 0 : false

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl md:text-3xl font-bold text-gray-900">
                {value}
              </p>
              {change !== undefined && (
                <div
                  className={`text-sm font-semibold ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isPositive ? '↑' : '↓'} {Math.abs(change)}%
                </div>
              )}
            </div>
            {changeLabel && (
              <p className="text-xs text-gray-500 mt-1">{changeLabel}</p>
            )}
          </div>

          {icon && (
            <div
              className={`text-3xl p-3 rounded-lg ${colorClasses[color]}`}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * KPI Grid Component
 * 
 * Displays multiple KPI cards in a responsive grid
 * 
 * @example
 * ```tsx
 * <KPIGrid
 *   cards={[
 *     { title: 'Total Properties', value: 12, icon: '🏢', color: 'blue' },
 *     { title: 'Active Bookings', value: 24, icon: '📅', color: 'green' },
 *     { title: 'Total Revenue', value: '₦2.5M', icon: '💰', color: 'purple' },
 *     { title: 'Occupancy Rate', value: '87%', icon: '📊', color: 'orange' },
 *   ]}
 * />
 * ```
 */
interface KPIGridProps {
  cards: KPICardProps[]
}

export function KPIGrid({ cards }: KPIGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <KPICard key={index} {...card} />
      ))}
    </div>
  )
}

export default KPICard
