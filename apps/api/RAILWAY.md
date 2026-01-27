# Railway API Deployment Setup

## Service Configuration

**Root Directory:** `apps/api`

**Build Command:** `npm run build`

**Start Command:** `npm run start`

**Install Command:** `npm install && npx prisma generate`

## Environment Variables

Alle folgenden Environment Variables müssen im Railway Dashboard gesetzt werden:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@host:port/database

# Redis
REDIS_URL=redis://default:password@host:port

# Clerk Authentication
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxx

# CORS
FRONTEND_URL=https://www.ecommercerente.com

# Port (Railway setzt automatisch)
PORT=3001
```

## Database Setup

Nach dem ersten Deploy:

1. Railway erstellt automatisch die PostgreSQL Datenbank
2. Prisma Generate läuft beim Install
3. Prisma DB Push muss manuell ausgeführt werden:
   ```bash
   npx prisma db push
   ```

Alternativ: Verwende Prisma Migrate in Production:
```bash
npx prisma migrate deploy
```

## Redis Setup

1. Erstelle einen Redis Service in Railway
2. Kopiere die REDIS_URL vom Redis Service
3. Setze REDIS_URL als Environment Variable im API Service

## Domain

- API: https://api.ecommercerente.com
- Swagger Docs: https://api.ecommercerente.com/api/docs

## Wichtige Hinweise

- ⚠️ `DATABASE_URL` und `REDIS_URL` werden von Railway Services generiert
- ⚠️ Nach ENV-Änderungen deployed Railway automatisch neu
- ⚠️ Prisma Schema-Änderungen erfordern `prisma db push` oder `prisma migrate deploy`
