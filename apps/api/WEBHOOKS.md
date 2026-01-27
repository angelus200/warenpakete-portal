# Webhook Configuration Guide

This document describes how to configure webhooks for the Warenpakete Portal in production.

## 🔐 Prerequisites

Before configuring webhooks, ensure you have:
1. Deployed API to Railway: `https://api.ecommercerente.com`
2. Stripe account with live mode enabled
3. Clerk account with production application

## 📡 Webhook Endpoints

### 1. Stripe Webhook

**URL:** `https://api.ecommercerente.com/payments/webhook`

**Purpose:** Handle payment events from Stripe

**Supported Events:**
- `checkout.session.completed` - Payment successful, update order status
- `payment_intent.succeeded` - Additional payment confirmation
- `payment_intent.payment_failed` - Payment failure notification

**Configuration Steps:**

1. Go to [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter URL: `https://api.ecommercerente.com/payments/webhook`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Add to Railway environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

**What happens on webhook:**
1. Verify Stripe signature
2. Update Order status to PAID
3. Decrement product stock
4. Create commission if user has referredBy code
5. Update product status to SOLD if stock = 0

---

### 2. Clerk Webhook

**URL:** `https://api.ecommercerente.com/users/webhook`

**Purpose:** Sync user data from Clerk to database

**Supported Events:**
- `user.created` - Create user in database
- `user.updated` - Update user data
- `user.deleted` - Remove user from database

**Configuration Steps:**

1. Go to [Clerk Dashboard → Webhooks](https://dashboard.clerk.com/webhooks)
2. Click "Add Endpoint"
3. Enter URL: `https://api.ecommercerente.com/users/webhook`
4. Select events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Click "Create"
6. Copy the **Signing Secret** (starts with `whsec_...`)
7. Add to Railway environment variables:
   ```
   CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

**What happens on webhook:**
1. Verify Svix signature (Clerk uses Svix)
2. user.created: Create user in DB with clerkId, email, name
3. user.updated: Update user email/name
4. user.deleted: Remove user from DB

---

## 🧪 Testing Webhooks Locally

### Stripe Webhook Testing

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local API:
   ```bash
   stripe listen --forward-to localhost:3001/payments/webhook
   ```

4. Copy the webhook signing secret from CLI output:
   ```
   whsec_xxxxxxxxxxxxx
   ```

5. Add to `.env`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

6. Trigger test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Clerk Webhook Testing

1. Use Clerk Dashboard → Webhooks → Testing tab
2. Or use [webhook.site](https://webhook.site) to inspect payloads
3. Create test events from Clerk Dashboard

---

## 🔍 Verifying Webhooks Work

### Check Stripe Webhook:

1. Make a test purchase with test card: `4242 4242 4242 4242`
2. Check Stripe Dashboard → Webhooks → Events
3. Should see `checkout.session.completed` event with ✓ Success
4. Check API logs for: `Processing checkout.session.completed for order xxx`
5. Verify in database:
   - Order status changed to PAID
   - Product stock decremented
   - Commission created (if applicable)

### Check Clerk Webhook:

1. Register a new user in your app
2. Check Clerk Dashboard → Webhooks → Events
3. Should see `user.created` event with ✓ Success
4. Verify in database: User exists with correct clerkId and email

---

## 🚨 Troubleshooting

### Stripe Webhook Failing

**Error:** "Webhook signature verification failed"
- **Solution:** Check `STRIPE_WEBHOOK_SECRET` is correct
- **Solution:** Ensure Railway environment variable is set
- **Solution:** Restart Railway service after adding env var

**Error:** "Order not found"
- **Solution:** Check orderId is correctly passed in metadata
- **Solution:** Verify order exists in database before payment

### Clerk Webhook Failing

**Error:** "Invalid webhook signature"
- **Solution:** Check `CLERK_WEBHOOK_SECRET` is correct
- **Solution:** Ensure webhook secret is from production app, not development

**Error:** "Email already exists"
- **Solution:** User might already exist from previous webhook
- **Solution:** Check syncWithClerk handles existing users

### General Issues

**Webhook timeout (30s)**
- **Solution:** Optimize database queries
- **Solution:** Move heavy processing to background job

**Webhook retries**
- **Solution:** Ensure endpoint is idempotent
- **Solution:** Check for duplicate events by ID

---

## 📊 Monitoring

### Stripe

- Dashboard → Webhooks → [Your endpoint]
- View all events, successes, and failures
- Click event to see payload and response

### Clerk

- Dashboard → Webhooks → Events
- Filter by endpoint
- View delivery attempts and responses

### API Logs

Check Railway logs for webhook processing:
```bash
railway logs -s api
```

Look for:
- ✅ `Processing checkout.session.completed for order xxx`
- ✅ `Payment succeeded: pi_xxxxx`
- ❌ `Webhook signature verification failed`

---

## 🔒 Security Best Practices

1. **Always verify signatures** - Already implemented with Stripe/Svix
2. **Use HTTPS in production** - Railway provides this automatically
3. **Keep secrets secure** - Never commit webhook secrets to git
4. **Log webhook events** - Helps with debugging
5. **Make endpoints idempotent** - Handle duplicate events gracefully
6. **Set timeout limits** - Webhooks must respond within 30 seconds

---

## 📝 Environment Variables Checklist

Make sure these are set in Railway:

### Backend (API Service)
```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Clerk
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx

# Frontend URL
FRONTEND_URL=https://www.ecommercerente.com

# Database
DATABASE_URL=postgresql://xxxxx
```

### Frontend (Web Service)
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
NEXT_PUBLIC_API_URL=https://api.ecommercerente.com
```

---

## ✅ Final Checklist

- [ ] Stripe webhook endpoint added in dashboard
- [ ] STRIPE_WEBHOOK_SECRET set in Railway
- [ ] Test purchase completed successfully
- [ ] Order status updated to PAID
- [ ] Clerk webhook endpoint added in dashboard
- [ ] CLERK_WEBHOOK_SECRET set in Railway
- [ ] New user registration creates DB entry
- [ ] Both webhooks show ✓ Success in dashboards
- [ ] API logs show successful webhook processing
- [ ] Commission created for referral purchases

---

## 🆘 Support

If webhooks are not working:
1. Check Railway logs: `railway logs -s api`
2. Check Stripe/Clerk dashboard event logs
3. Verify environment variables are set
4. Test locally with Stripe CLI first
5. Check CORS settings allow webhook domains
