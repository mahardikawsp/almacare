# BayiCare App

Progressive Web Application untuk memantau tumbuh kembang anak berdasarkan standar WHO dan Kemenkes RI.

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom baby-friendly theme
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth
- **State Management**: Zustand
- **Data Fetching**: SWR
- **PWA**: next-pwa plugin
- **Charts**: Recharts

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── offline/           # Offline page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── providers/         # Context providers
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   └── swr-config.ts     # SWR configuration
├── stores/               # Zustand stores
│   ├── childStore.ts     # Child management
│   ├── growthStore.ts    # Growth tracking
│   └── notificationStore.ts # Notifications
└── types/               # TypeScript definitions
```

## Features Implemented

### ✅ Core Infrastructure
- [x] Next.js 14+ with TypeScript and App Router
- [x] Tailwind CSS with baby-friendly color theme
- [x] PostgreSQL database with Prisma ORM
- [x] NextAuth.js with Google OAuth provider
- [x] Zustand stores for state management
- [x] SWR configuration for data fetching
- [x] PWA configuration with service worker
- [x] Offline support page
- [x] Health check API endpoint

### 🎨 Design System
- **Colors**: Soft, nurturing palette optimized for parents
- **Typography**: Inter font family
- **Components**: Accessible, mobile-first design
- **Icons**: SVG-based with proper accessibility

### 📱 PWA Features
- **Manifest**: Complete PWA manifest with shortcuts
- **Service Worker**: Caching strategies for offline support
- **Icons**: Multiple sizes for different devices
- **Offline Page**: User-friendly offline experience

## Environment Setup

1. Copy `.env` file and configure:
   ```bash
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/bayicare_db"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Run database migrations:
   ```bash
   npx prisma db push
   ```

## Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

## Next Steps

The core infrastructure is now complete. The next tasks will implement:

1. Database schema and models
2. Authentication system
3. Core layout and navigation
4. Child profile management
5. WHO growth standards integration
6. Growth tracking system
7. Immunization schedule management
8. MPASI recipe system
9. Notification system
10. Dashboard and visualization

## Performance Optimizations

- Code splitting by routes
- Image optimization with Next.js Image
- SWR caching with 5-minute stale time
- Service worker caching strategies
- Optimized bundle size with tree shaking