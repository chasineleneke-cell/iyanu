# RentNG - Nigerian Apartment Rental Frontend

> A production-ready, feature-complete Next.js frontend for a modern apartment rental platform optimized for Nigeria.

## ✨ New Features (v1.1.0)

### Authentication & Security
- ✅ **Middleware-based Route Protection**: Role-based access control for tenant/admin routes
- ✅ **Protected Routes Component**: Client-side route guarding with automatic redirects
- ✅ **Token Expiry Management**: Automatic logout when token expires
- ✅ **Secure Cookie Storage**: Tokens stored in httpOnly cookies for middleware access

### React Query Integration
- ✅ **useLogin / useRegister**: Authentication mutations with optimistic updates
- ✅ **useProperties**: Full property CRUD operations with cache invalidation
- ✅ **useBookings**: Booking lifecycle management (create, approve, reject, review)
- ✅ **useAdminDashboard**: Dashboard stats with automatic refetching
- ✅ **useListings**: Advanced search with filtering and pagination

### Form Validation (Zod + React Hook Form)
- ✅ **10+ Validation Schemas**: Login, Register, Profile, Property, Booking forms
- ✅ **Real-time Validation**: Type-safe, immediate feedback on form fields
- ✅ **Nigerian Phone Validation**: Custom validator for +234 format
- ✅ **Password Requirements**: Uppercase, lowercase, numbers validation
- ✅ **Date Validation**: Check-out after check-in, dates in future

### UI/UX Enhancements
- ✅ **Toast Notifications**: React Hot Toast with success/error/loading states
- ✅ **Skeleton Loaders**: Animated placeholders for listings, dashboards, tables
- ✅ **Empty States**: Friendly messages when no data available
- ✅ **Error Boundaries**: Graceful error handling with fallback UI
- ✅ **Global Error Handler**: Consistent error display across the app

### Image Management
- ✅ **Drag & Drop Upload**: Upload images directly or click to select
- ✅ **Cloudinary Integration**: Secure image hosting with CDN delivery
- ✅ **Image Preview**: Before/after upload status indicators
- ✅ **Batch Upload**: Upload multiple images at once (up to 10)
- ✅ **File Validation**: Type and size checking before upload
- ✅ **Image Transformation**: Automatic resizing, optimization, format conversion

### Admin Dashboard
- ✅ **KPI Cards**: Display key metrics (revenue, bookings, properties, occupancy)
- ✅ **Revenue Charts**: Area charts showing revenue trends over time
- ✅ **Booking Analytics**: Bar charts for booking status distribution
- ✅ **Occupancy Rate**: Visual occupancy metrics per property
- ✅ **Performance Comparison**: Multi-series line charts for property performance

### Search & Filtering
- ✅ **Advanced Filters**: State, price range, bedrooms, bathrooms, amenities
- ✅ **Pagination**: Smart pagination with page numbers and navigation
- ✅ **Sorting**: Sort by newest, price (low-high), price (high-low), rating
- ✅ **Filter State Management**: Persistent filter state with URL params support
- ✅ **Live Preview**: Real-time results as filters change

### SEO Optimization
- ✅ **Meta Tags**: Dynamic titles and descriptions for all pages
- ✅ **OG Tags**: Open Graph tags for social media sharing
- ✅ **Sitemap**: Auto-generated sitemap.xml for search engines
- ✅ **Robots.txt**: Search engine crawling instructions
- ✅ **Structured Data**: JSON-LD schema for rich snippets
- ✅ **Canonical URLs**: Avoid duplicate content issues

### Performance & Deployment
- ✅ **Image Optimization**: AVIF/WebP format support, automatic resizing
- ✅ **Bundle Analysis**: Identify and remove large dependencies
- ✅ **Security Headers**: X-Content-Type, X-Frame-Options, CSP
- ✅ **Environment Config**: Production-ready env setup for Vercel/self-hosted
- ✅ **Logging Utility**: Development-only console logs in production
- ✅ **Error Tracking**: Sentry integration support

## 🎯 Key Improvements Over v1.0

| Feature | v1.0 | v1.1 |
|---------|------|------|
| Route Protection | ❌ | ✅ Middleware + Client |
| Data Fetching | Manual | ✅ React Query |
| Form Validation | Basic | ✅ Zod + React Hook Form |
| Notifications | ❌ | ✅ Toast + Alerts |
| Loading States | Basic | ✅ Skeleton Loaders |
| Image Upload | ❌ | ✅ Cloudinary + Drag Drop |
| Analytics | ❌ | ✅ Charts + KPIs |
| SEO | Basic | ✅ Full Meta + Schema |
| Deployment Ready | Partial | ✅ Production Checklist |

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.2
- **Styling**: Tailwind CSS 3.3
- **State Management**: Zustand 4.4
- **HTTP Client**: Axios 1.6
- **Data Fetching**: React Query 5.28
- **Forms**: React Hook Form 7.48 + Zod 3.22
- **Charts**: Recharts 3.5
- **Notifications**: React Hot Toast 2.6
- **Database ORM**: Prisma (for future backend)

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/rentng-frontend.git
cd rentng-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Edit .env.local with your settings:
# - NEXT_PUBLIC_API_URL: Your backend API URL
# - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: Your Cloudinary account
# - Other API keys and configuration

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

## 🚀 Usage Examples

### Authentication
```tsx
import { useLogin } from '@/hooks/useAuth'

function LoginForm() {
  const { mutate: login, isPending } = useLogin()
  
  const handleSubmit = async (data) => {
    login(data, {
      onSuccess: () => router.push('/tenant/dashboard'),
      onError: (error) => toast.error(error.message)
    })
  }
}
```

### Fetching Data
```tsx
import { useSearchListings } from '@/hooks/useListings'

function ListingsPage() {
  const { data, isLoading, error } = useSearchListings({
    state: 'Lagos',
    bedrooms: 2,
    minPrice: 100000,
    maxPrice: 500000
  })
  
  if (isLoading) return <ListingsGridSkeleton count={6} />
  if (error) return <ErrorState title="Failed to load listings" onRetry={() => {}} />
  if (!data?.data.length) return <EmptyState title="No listings found" />
  
  return <ListingsGrid listings={data.data} />
}
```

### Image Upload
```tsx
import { ImageUpload } from '@/components/ImageUpload'

function PropertyForm() {
  const [images, setImages] = useState<string[]>([])
  
  return (
    <ImageUpload 
      onImageSelect={setImages}
      maxImages={10}
      maxSizeMB={5}
    />
  )
}
```

### Forms with Validation
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/utils/validation'

function LoginForm() {
  const { register, formState: { errors }, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema)
  })
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register('email')} error={errors.email?.message} />
      <Input {...register('password')} type="password" error={errors.password?.message} />
    </form>
  )
}
```

### Dashboard Analytics
```tsx
import { useAdminDashboard } from '@/hooks/useAdminDashboard'
import { RevenueChart, BookingsChart } from '@/components/dashboard/Charts'
import { KPIGrid } from '@/components/dashboard/KPICard'

function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard()
  
  if (isLoading) return <DashboardGridSkeleton count={4} />
  
  return (
    <>
      <KPIGrid cards={[
        { title: 'Total Revenue', value: data?.totalRevenue, icon: '💰' },
        { title: 'Occupancy', value: `${data?.occupancyRate}%`, icon: '📊' }
      ]} />
      <RevenueChart data={monthlyData} />
      <BookingsChart data={bookingTrends} />
    </>
  )
}
```

## 📋 Available Commands

```bash
# Development
npm run dev           # Start dev server with hot reload

# Production
npm run build         # Build for production
npm start             # Start production server
npm run type-check    # TypeScript type checking
npm run lint          # Run ESLint

# Analysis
npm run analyze       # Analyze bundle size (requires @next/bundle-analyzer)
```

## 🔐 Security Checklist

- [ ] Environment variables secured (never commit .env.local)
- [ ] API tokens stored in httpOnly cookies
- [ ] CORS properly configured on backend
- [ ] Input validation on all forms
- [ ] HTTPS enforced in production
- [ ] Security headers configured (see next.config.ts)
- [ ] No sensitive data in localStorage
- [ ] Error messages don't leak sensitive info

## 📊 Performance Metrics (Target)

- **Lighthouse Score**: > 90
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **Bundle Size**: < 200KB (gzipped)

## 🌍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📚 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Installation & troubleshooting
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment
- [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) - Pre-deployment checklist
- [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) - Build statistics

## 🤝 Backend Integration

This frontend expects the following API structure:

```
POST   /api/auth/login              # Login
POST   /api/auth/register           # Register
POST   /api/auth/logout             # Logout
POST   /api/auth/refresh            # Refresh token

GET    /api/listings                # Search listings
GET    /api/listings/:id            # Get listing details
GET    /api/listings/:id/reviews    # Get reviews

POST   /api/bookings                # Create booking
GET    /api/bookings                # List user bookings
POST   /api/bookings/:id/approve    # Approve booking (admin)
POST   /api/bookings/:id/reject     # Reject booking (admin)

GET    /api/properties              # List properties (admin)
POST   /api/properties              # Create property (admin)
PUT    /api/properties/:id          # Update property (admin)
DELETE /api/properties/:id          # Delete property (admin)

GET    /api/admin/dashboard         # Admin dashboard stats
```

See `.env.example` for API base URL configuration.

## 🐛 Troubleshooting

### Environment Variables Not Loading
- Check `.env.local` exists in root directory
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Restart dev server after changing variables

### Build Fails
- Clear `.next` directory: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node --version` (should be 18+)

### Images Not Displaying
- Verify Cloudinary credentials in `.env.local`
- Check image domain in `next.config.ts`
- Use Next.js Image component instead of `<img>`

### API Calls Failing
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS configuration
- Inspect browser Network tab for requests

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📧 Support

For issues, questions, or suggestions:
- Create an GitHub issue
- Contact: support@rentng.app
- Documentation: https://rentng.app/docs

---

**Made with ❤️ for Nigerian renters and landlords**
