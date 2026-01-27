# Railway Deployment Setup

## Environment Variables

### ⚠️ WICHTIG: Secret Keys in Railway setzen

Die folgenden **SECRET** Environment Variables müssen im Railway Dashboard gesetzt werden.
Diese dürfen NICHT im Repository committed werden!

```bash
# Clerk Secret Key (Backend)
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxxx
```

**Hinweis:** Verwende deinen echten Clerk Secret Key aus dem Clerk Dashboard.

### ✅ Public Variables (bereits in .env.production)

Die folgenden NEXT_PUBLIC_ Variablen sind bereits in `.env.production` committed:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_API_URL`

Diese werden beim Build automatisch eingebettet.

## Railway Konfiguration

**Root Directory:** `apps/web`

**Build Command:** `npm run build` (automatisch erkannt)

**Start Command:** `npm run start`

**Install Command:** `npm install`

## Domain

- Production: https://www.ecommercerente.com
- API: https://api.ecommercerente.com
