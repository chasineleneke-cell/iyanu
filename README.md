# RentNG - Nigerian Apartment Rental Web App (Frontend)

A modern, production-ready React/Next.js frontend for a single-landlord apartment rental platform optimized for Nigeria.

## 🚀 Features

### Tenant Features
- **Search & Browse**: Filter apartments by location (Nigerian states), price, bedrooms, amenities
- **Listing Details**: Full apartment details with image galleries, amenities, location maps, landlord info
- **Booking Management**: Request apartments, track booking status, cancel if needed
- **Payments**: Integration with Paystack/Flutterwave for secure payments
- **Messaging**: Direct chat with landlord
- **Reviews & Ratings**: Rate apartments and leave feedback
- **Dashboard**: View bookings, messages, profile management
- **Localization**: NGN currency, Nigerian phone format, local date formatting

### Landlord/Admin Features
- **Property Management**: Add, edit, delete properties with multiple units
- **Booking Requests**: View, approve, reject tenant booking requests
- **Revenue Tracking**: Monitor income and payment history
- **Messaging**: Communicate with tenants directly
- **Dashboard**: Overview of properties, bookings, and analytics

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── search/                  # Search/browse apartments
│   ├── login/                   # Tenant login
│   ├── register/                # Tenant registration
│   ├── listing/[id]/            # Listing detail page
│   ├── booking/[id]/            # Booking checkout
│   ├── tenant/                  # Tenant pages
│   │   ├── dashboard/           # Tenant dashboard
│   │   ├── bookings/            # Booking history
│   │   ├── messages/            # Messaging
│   │   └── profile/             # Profile management
│   └── admin/                   # Admin/Landlord pages
│       ├── login/               # Landlord login
│       ├── dashboard/           # Admin dashboard
│       ├── properties/          # Property management
│       ├── bookings/            # Booking management
│       └── messages/            # Admin messaging
│
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx          # Button with variants
│   │   ├── Input.tsx           # Input field
│   │   ├── Card.tsx            # Card container
│   │   ├── Badge.tsx           # Status badges
│   │   ├── Modal.tsx           # Modal dialog
│   │   └── Select.tsx          # Dropdown select
│   ├── common/                  # Shared components
│   │   ├── Navbar.tsx          # Top navigation
│   │   └── Footer.tsx          # Footer
│   ├── tenant/                  # Tenant-specific components
│   │   ├── ListingCard.tsx     # Listing preview card
│   │   ├── BookingForm.tsx     # Booking form
│   │   └── SearchFilters.tsx   # Search filter UI
│   └── admin/                   # Admin-specific components
│       ├── PropertyForm.tsx    # Property add/edit form
│       ├── BookingReview.tsx   # Booking approval card
│       └── StatsDashboard.tsx  # Dashboard stats
│
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts              # Authentication hook
│   ├── useListings.ts          # Listings query hook
│   ├── useBookings.ts          # Bookings query hook
│   ├── useApi.ts               # Generic API call hook
│   └── useLocalStorage.ts      # Local storage hook
│
├── store/                       # Zustand state management
│   ├── authStore.ts            # Auth state (login, user, tokens)
│   ├── listingStore.ts         # Listings cache and filters
│   └── bookingStore.ts         # Booking state
│
├── services/                    # API client & services
│   ├── api.ts                  # Axios instance with interceptors
│   └── [specific services]     # Service-specific APIs
│
├── types/                       # TypeScript type definitions
│   └── index.ts                # All app types (User, Property, Booking, etc)
│
├── utils/                       # Utility functions
│   ├── nigerian-locale.ts      # NGN formatting, phone validation, states
│   ├── validation.ts           # Form validation helpers
│   └── helpers.ts              # General utilities
│
├── constants/                   # App constants
│   └── index.ts                # Amenities, price ranges, error messages
│
└── layouts/                     # Layout components
    ├── TenantLayout.tsx        # Tenant dashboard layout
    └── AdminLayout.tsx         # Admin dashboard layout
```

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand (with localStorage persistence)
- **API Client**: Axios with interceptors
- **Data Fetching**: React Query (TanStack Query)
- **Form Validation**: React Hook Form + Zod
- **Icons**: React Icons + Lucide React
- **Notifications**: React Hot Toast
- **Localization**: date-fns, custom Nigerian utilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running (see backend roadmap)

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=RentNG
```

## 📝 Key Components & Usage

### Authentication Flow
1. User registers/logs in at `/login` or `/register`
2. Backend returns JWT + refresh token
3. Tokens stored in Zustand auth store + localStorage
4. Axios interceptor automatically adds token to requests
5. Role-based redirect: `/tenant/dashboard` or `/admin/dashboard`

### Listing Search
- Filter by state, bedrooms, price, amenities
- Server-side pagination with React Query
- Client-side caching for improved UX
- Nigerian state dropdown + currency formatting

### Booking Flow
1. Tenant views listing details
2. Clicks "Book Now" → booking form
3. Selects check-in/out dates, enters info
4. Payment initialization (Paystack/Flutterwave)
5. Payment webhook received → booking approved
6. Confirmation email + SMS sent

### Admin Property Management
- Add/edit property with multiple units
- Image uploads to S3/Cloudinary (via backend)
- View booking requests with tenant info
- Approve/reject bookings with notifications

## 🎨 Design System

### Color Palette
- **Primary**: Blue-600 (`#2563eb`)
- **Secondary**: Purple-600 (`#7c3aed`)
- **Success**: Green-600 (`#10b981`)
- **Warning**: Amber-600 (`#d97706`)
- **Danger**: Red-600 (`#dc2626`)

### Button Variants
- `primary` - Main CTA
- `secondary` - Alternative action
- `danger` - Destructive action
- `ghost` - Minimal style
- `outline` - Border only

## 🔐 Authentication & Security

- **JWT + Refresh Token** pattern
- **HTTPOnly cookies** for token storage (backend responsibility)
- **Role-based route protection**
- **CORS** configured for backend
- **Input validation** with Zod
- **XSS protection** via React's default escaping

## 🌍 Nigerian Localization

- **Currency**: NGN (₦) formatting with `formatNGN()`
- **Phone**: Nigerian phone validation `validatePhoneNumber()`
- **States**: Complete list of 36 states + FCT
- **Date/Time**: Local formatting with `formatDateNG()`, `formatTimeNG()`
- **Amenities**: Common Nigerian apartment features (generator, water, WiFi, etc)

**Usage**:
```typescript
import { formatNGN, NIGERIAN_STATES, validatePhoneNumber } from '@/utils/nigerian-locale'

formatNGN(250000) // ₦250,000.00
NIGERIAN_STATES[0] // "Abia"
validatePhoneNumber('+2349012345678') // true
```

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Tailwind Grid** for layouts
- **Mobile navigation** with hamburger menu

## 🔌 API Integration Checklist

Backend endpoints needed (stubs provided in `src/services/api.ts`):

### Auth
- [ ] `POST /auth/login` - Tenant & landlord login
- [ ] `POST /auth/register` - Register new user
- [ ] `POST /auth/refresh` - Refresh access token
- [ ] `POST /auth/logout` - Logout

### Listings
- [ ] `GET /listings` - Search with filters & pagination
- [ ] `GET /listings/:id` - Get listing details
- [ ] `GET /listings/:id/reviews` - Get reviews

### Bookings
- [ ] `POST /bookings` - Create booking request
- [ ] `GET /bookings` - Tenant's bookings
- [ ] `GET /admin/bookings` - Landlord's booking requests
- [ ] `POST /admin/bookings/:id/approve` - Approve booking
- [ ] `POST /admin/bookings/:id/reject` - Reject booking

### Properties (Admin)
- [ ] `POST /admin/properties` - Create property
- [ ] `GET /admin/properties` - List landlord's properties
- [ ] `PUT /admin/properties/:id` - Update property
- [ ] `POST /admin/properties/:id/units` - Add unit
- [ ] `DELETE /admin/properties/:id` - Delete property

### Messaging
- [ ] `GET /messages/conversations` - List conversations
- [ ] `GET /messages/conversations/:userId` - Get messages
- [ ] `POST /messages` - Send message

### Payments
- [ ] `POST /payments/initialize` - Initialize Paystack/Flutterwave payment
- [ ] `POST /payments/verify` - Verify payment status

### User
- [ ] `GET /profile` - Get user profile
- [ ] `PUT /profile` - Update profile
- [ ] `POST /profile/avatar` - Upload avatar

## 🧪 Testing

### Component Tests
```bash
npm run test -- components/ui/Button.test.tsx
```

### E2E Tests (Booking Flow)
```bash
npm run test:e2e
```

## 📦 Build & Deploy

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel
```

### Deploy to Other Platforms
See [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🐛 Common Issues & Solutions

### 1. "Cannot GET /listing/123"
**Problem**: Dynamic route not working  
**Solution**: Ensure file is named `[id]/page.tsx` not `[id].tsx`

### 2. Tailwind classes not applied
**Problem**: Missing Tailwind setup  
**Solution**: Run `npm install && npm run dev`

### 3. "Module not found" errors
**Problem**: Path aliases not working  
**Solution**: Restart dev server after tsconfig changes

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Query Docs](https://react-query-v3.tanstack.com/)
- [Zod Validation](https://zod.dev/)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📄 License

MIT License - See LICENSE file

## 🎯 Next Steps

1. **Install dependencies**: `npm install`
2. **Setup backend**: Configure backend API endpoints in `.env.local`
3. **Implement API calls**: Replace TODO comments in `src/services/api.ts`
4. **Add real listing data**: Connect search/listing pages to backend
5. **Setup authentication**: Integrate with backend auth endpoints
6. **Payment integration**: Configure Paystack/Flutterwave webhooks
7. **Deploy**: Push to Vercel or preferred hosting

---

**Built with ❤️ for Nigeria's rental market**
