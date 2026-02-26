# Stripe Integration - Knowledge Shop

## Übersicht

Der Knowledge Shop verwendet Stripe Payment Elements für sichere Zahlungsabwicklung. Diese Dokumentation beschreibt die korrekte Konfiguration und bekannte Lösungen für häufige Probleme.

## Architektur

```
Frontend (Next.js)                Backend (NestJS)
├─ loadStripe()                   ├─ new Stripe(SECRET_KEY)
├─ <Elements>                     ├─ paymentIntents.create()
└─ <PaymentElement>               └─ automatic_payment_methods: true
```

## Environment Variables

### Frontend (Railway/Vercel)

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51xxxYourPublishableKeyxxx
```

**Wichtig:** Diese Variable wird zur **BUILD TIME** in das JavaScript Bundle embedded!

### Backend (Railway)

```bash
STRIPE_SECRET_KEY=sk_live_51xxxYourSecretKeyxxx
```

**Hinweis:** Ersetze mit deinen echten Keys aus dem Stripe Dashboard!

## Key-Paar Matching

**KRITISCH:** Publishable Key und Secret Key müssen vom **selben Stripe API Key-Paar** sein!

```
✅ Beide haben den gleichen Account-Prefix (z.B. 51ABC123xyz)
✅ Gehören zum selben Stripe Account
✅ Werden zusammen im Stripe Dashboard angezeigt
```

**Falsch konfiguriert führt zu:**
- 401 Unauthorized Errors
- PaymentElement lädt nicht
- "Invalid API Key" Fehler

## Stripe SDK Versionen

### Frontend (package.json)

```json
{
  "@stripe/react-stripe-js": "^2.9.0",
  "@stripe/stripe-js": "^4.10.0"
}
```

**Warum diese Versionen?**
- Backend verwendet API Version `2023-10-16`
- Neuere Frontend SDKs (v5.x, v8.x) erwarten neuere API Versionen
- Diese stabilen Versionen sind kompatibel mit API `2023-10-16`

### Backend (package.json)

```json
{
  "stripe": "^14.13.0"
}
```

**API Version:** `2023-10-16` (hardcoded in Service)

## Code-Struktur

### Frontend (apps/web/src/app/knowledge/page.tsx)

```typescript
// 1. Module-Level Initialisierung (außerhalb Component)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// 2. Modal mit Elements Wrapper
<Elements
  key={clientSecret}
  stripe={stripePromise}
  options={{ clientSecret }}
>
  <CheckoutForm
    clientSecret={clientSecret}
    onSuccess={handlePurchaseSuccess}
    onClose={closeModal}
  />
</Elements>

// 3. CheckoutForm mit PaymentElement
function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Jetzt bezahlen</button>
    </form>
  );
}
```

**Best Practices:**
- ✅ `stripePromise` auf Modulebene (wird nur einmal initialisiert)
- ✅ `<Elements>` wraps `<CheckoutForm>`
- ✅ `confirmPayment()` nur in `handleSubmit` (User-triggered)
- ✅ Button disabled bis Stripe geladen ist

### Backend (apps/api/src/modules/knowledge/knowledge.service.ts)

```typescript
// 1. Stripe Initialisierung im Constructor
constructor(private prisma: PrismaService) {
  this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });
}

// 2. PaymentIntent Creation
async purchaseProduct(id: string, clerkId: string) {
  const paymentIntent = await this.stripe.paymentIntents.create({
    amount: Math.round(Number(product.price) * 100),
    currency: 'eur',
    automatic_payment_methods: { enabled: true }, // WICHTIG!
    metadata: {
      type: 'knowledge_product',
      productId: id,
      userId: user.id,
    },
  });

  return {
    isFree: false,
    clientSecret: paymentIntent.client_secret,
  };
}
```

**Wichtig:** `automatic_payment_methods: { enabled: true }` ist **erforderlich** für PaymentElement!

## Häufige Probleme & Lösungen

### Problem 1: PaymentElement lädt nicht (401 Error)

**Symptom:**
- Modal öffnet sich
- Kein Kreditkartenformular
- Console: `401 Unauthorized` zu `api.stripe.com/v1/elements/sessions`

**Ursache:**
- Publishable Key passt nicht zum Secret Key
- Oder: Environment Variable wurde nicht korrekt embedded

**Lösung:**
1. Prüfe Key-Paar im Stripe Dashboard
2. Stelle sicher beide Keys haben gleichen Prefix
3. Railway Variables **löschen + neu anlegen** (nicht bearbeiten!)
4. Force Rebuild triggern

### Problem 2: "elements should have a mounted Payment Element"

**Symptom:**
- `confirmPayment()` wirft Error
- PaymentElement iframe fehlt im DOM

**Ursache:**
- `automatic_payment_methods` fehlt im Backend
- Oder: PaymentElement wurde nicht korrekt gerendert

**Lösung:**
```typescript
// Backend - paymentIntents.create()
automatic_payment_methods: { enabled: true }  // Hinzufügen!
```

### Problem 3: Environment Variable wird nicht embedded

**Symptom:**
- Hardcoded Key funktioniert
- Mit `process.env.NEXT_PUBLIC_...` funktioniert es nicht

**Ursache:**
- Railway cached alte Variable
- Build wurde nicht mit neuer Variable gebaut

**Lösung:**
1. Railway Dashboard → Variables
2. **LÖSCHEN** (nicht bearbeiten): `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. **NEU ANLEGEN** mit korrektem Wert
4. Railway rebuilded automatisch → Variable wird fresh embedded

### Problem 4: Re-render Loop / Button zeigt "Wird verarbeitet..."

**Symptom:**
- Button zeigt sofort "Wird verarbeitet..." ohne User-Click
- Modal rendert endlos

**Ursache:**
- `stripePromise` wurde innerhalb Component definiert
- Neue Promise bei jedem Render

**Lösung:**
```typescript
// FALSCH - Inside Component:
function KnowledgePage() {
  const stripePromise = useMemo(() => loadStripe(...), []);
  ...
}

// RICHTIG - Module Level:
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function KnowledgePage() {
  // stripePromise ist jetzt stabil
  ...
}
```

## Testing

### Lokales Testing

```bash
# 1. Environment Variables setzen
cp apps/web/.env.example apps/web/.env.local

# 2. Stripe Keys eintragen
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# 3. Dev Server starten
npm run dev

# 4. Testen
# Öffne http://localhost:3000/knowledge
# Klicke "Kaufen" → Modal sollte PaymentElement zeigen
```

### Production Testing

```bash
# 1. Hardcoded Test (temporary)
const stripePromise = loadStripe('pk_live_...');

# 2. Commit und deploy
git add apps/web/src/app/knowledge/page.tsx
git commit -m "debug: hardcode stripe key"
git push

# 3. Teste in Production
# Funktioniert? → Problem ist Env Variable
# Funktioniert nicht? → Problem ist Key-Mismatch

# 4. Revert
git revert HEAD
git push
```

## Deployment Checklist

- [ ] Backend `STRIPE_SECRET_KEY` in Railway gesetzt
- [ ] Frontend `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in Railway gesetzt
- [ ] Keys gehören zum selben Stripe Account (gleicher Prefix)
- [ ] `automatic_payment_methods: { enabled: true }` im Backend Code
- [ ] Stripe SDK Versionen sind kompatibel
- [ ] `stripePromise` ist auf Modulebene definiert
- [ ] Railway Variables wurden neu angelegt (nicht nur bearbeitet)
- [ ] Fresh Build nach Variable-Update
- [ ] Test in Production durchgeführt

## Stripe Dashboard

**Live Mode Keys:**
- https://dashboard.stripe.com/apikeys
- Wechsle zu "Live mode" (oben rechts)
- Kopiere Keys vom **selben Key-Paar**

**Webhooks (Optional für Zukunft):**
- https://dashboard.stripe.com/webhooks
- Endpoint: `https://api.ecommercerente.com/webhooks/stripe`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

## Weitere Ressourcen

- [Stripe Payment Element Docs](https://stripe.com/docs/payments/payment-element)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)

---

**Letzte Aktualisierung:** 2026-02-26
**Status:** ✅ Funktionsfähig
