'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface ChartDataPoint {
  name: string
  [key: string]: string | number
}

interface RevenueChartProps {
  data: ChartDataPoint[]
  title?: string
  dataKey?: string
  height?: number
}

/**
 * Revenue Chart Component
 * 
 * Displays revenue trends over time using a line chart
 * 
 * @example
 * ```tsx
 * <RevenueChart
 *   data={[
 *     { date: 'Jan', revenue: 50000 },
 *     { date: 'Feb', revenue: 75000 },
 *     { date: 'Mar', revenue: 60000 },
 *   ]}
 *   title="Monthly Revenue"
 *   dataKey="revenue"
 * />
 * ```
 */
export function RevenueChart({
  data,
  title = 'Revenue Trend',
  dataKey = 'revenue',
  height = 300,
}: RevenueChartProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => `₦${Number(value).toLocaleString()}`}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

/**
 * Bookings Chart Component
 * 
 * Displays booking trends with multiple data series
 */
export function BookingsChart({
  data,
  title = 'Bookings Overview',
  height = 300,
}: Omit<RevenueChartProps, 'dataKey'>) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="confirmed" fill="#10b981" name="Confirmed" />
            <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
            <Bar dataKey="cancelled" fill="#ef4444" name="Cancelled" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

/**
 * Occupancy Rate Chart Component
 * 
 * Displays occupancy rates across properties
 */
interface OccupancyData {
  name: string
  occupancy: number
}

export function OccupancyChart({
  data,
  title = 'Property Occupancy Rate',
  height = 300,
}: {
  data: OccupancyData[]
  title?: string
  height?: number
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar
              dataKey="occupancy"
              fill="#8b5cf6"
              name="Occupancy %"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

/**
 * Performance Comparison Chart
 * 
 * Compares metrics across multiple properties
 */
interface PerformanceData {
  name: string
  revenue: number
  bookings: number
}

export function PerformanceChart({
  data,
  title = 'Property Performance',
  height = 300,
}: {
  data: PerformanceData[]
  title?: string
  height?: number
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="bookings"
              stroke="#3b82f6"
              name="Bookings"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default RevenueChart
