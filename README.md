# Warenpakete Portal

B2B Warenpakete-Portal built with Turborepo.

## Structure

- `apps/web` - Next.js 14 Frontend (App Router, Tailwind, shadcn/ui, Clerk, Stripe)
- `apps/api` - NestJS Backend (Prisma, Swagger, Clerk, Stripe, Resend)
- `packages/types` - Shared TypeScript Types

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
```

3. Run the development servers:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps
- `npm run lint` - Lint all apps
- `npm run test` - Run tests
- `npm run clean` - Clean all build artifacts

## Tech Stack

### Frontend (apps/web)
- Next.js 14 with App Router
- Tailwind CSS
- shadcn/ui
- Clerk (Authentication)
- Stripe (Payments)
- React Query
- Zustand (State Management)

### Backend (apps/api)
- NestJS
- Prisma ORM
- PostgreSQL
- Redis
- Swagger/OpenAPI
- Clerk (Authentication)
- Stripe (Payments)
- Resend (Email)
