# 📦 WARENPAKETE-PORTAL - KOMPLETTE PROJEKT-ÜBERSICHT

**Stand:** 5. Februar 2026
**Projekt:** E-Commerce Rente / Commercehelden Warenpakete-Portal
**GitHub:** angelus200/warenpakete-portal
**Live:** www.ecommercerente.com | API: api.ecommercerente.com

---

## 🏗️ ARCHITEKTUR

### Tech Stack
- **Frontend:** Next.js 14 (App Router) + React + TypeScript + Tailwind CSS
- **Backend:** NestJS + TypeScript
- **Datenbank:** PostgreSQL (Railway)
- **Cache:** Redis (Railway)
- **Auth:**
  - User: Clerk (OAuth, Social Login)
  - Admin: JWT (bcrypt-hashed passwords)
- **Payment:** Stripe
- **Hosting:** Railway (Auto-Deploy via GitHub)
- **Monorepo:** Turborepo

### Ordnerstruktur
```
warenpakete-portal/
├── apps/
│   ├── api/          # NestJS Backend
│   └── web/          # Next.js Frontend
├── packages/         # Shared packages
├── prisma/           # Database Schema & Migrations
└── package.json      # Workspace root
```

---

## 🗄️ DATENBANK-MODELLE (Prisma Schema)

### Core Models

#### **User** (users)
- Buyer/Reseller Accounts via Clerk
- Felder: clerkId, email, name, firstName, lastName
- B2B: company, vatId, companyStreet, companyZip, companyCity, companyCountry
- B2B Bestätigung: isBusinessCustomer, acceptedB2BTermsAt
- Wallet: walletBalance, iban, bankAccountHolder
- Referral: referralCode, referredBy
- Relationen: orders, commissionsEarned, walletTransactions, payoutRequests, commissionContracts

#### **AdminUser** (admin_users)
- Admin-Accounts mit bcrypt-gehashten Passwörtern
- Felder: email, password, name, role
- **Aktiver Admin:** thomas@commercehelden.com / Admin123!

#### **Product** (products)
- Warenpakete zum Verkauf
- Felder: name, description, price, retailValue, stock, palletCount, status, images[]
- Status: AVAILABLE | RESERVED | SOLD
- Relationen: orderItems

#### **Order** (orders)
- Bestellungen
- Felder: userId, status, totalAmount, stripePaymentId, paidAt, pickedUpAt, fulfillmentType
- Status: PENDING | PAID | PROCESSING | SHIPPED | DELIVERED | CANCELLED
- fulfillmentType: NULL | "DELIVERY" | "COMMISSION"
- Relationen: user, items, commission, storageFees, commissionContract, deliveryAddress

#### **OrderItem** (order_items)
- Bestellpositionen
- Felder: orderId, productId, quantity, price
- Relationen: order, product

#### **Commission** (commissions)
- Provisionen für Reseller
- Felder: orderId, resellerId, amount, status, paidAt
- Status: PENDING | PAID
- Relationen: order, reseller

#### **CommissionContract** (commission_contracts)
- Kommissionsverträge (14 Paragraphen, österreichisches Recht)
- Felder:
  - Beziehungen: orderId, userId
  - Vertrag: contractNumber, productName, productQuantity, purchasePrice, commissionRate (20%)
  - PDF & Signatur: contractPdfUrl, signedPdfUrl, signatureData, signedAt
  - Bankdaten: iban, bic, accountHolder
  - Status: draft | pending_signature | signed | active | completed | cancelled
  - Verkauf: salesStatus (pending | listed | sold), salesPrice, soldAt
  - Auszahlung: payoutAmount, payoutStatus (pending | processing | completed), paidAt
  - Lagerung: storageStartDate, storageFeePerDay (€0.50)
- Relationen: order, user

#### **DeliveryAddress** (delivery_addresses) ✨ NEU
- Lieferadressen für Auslieferungs-Flow
- Felder: orderId, street, zipCode, city, country (AT/DE/CH), phone
- Relationen: order

#### **StorageFee** (storage_fees)
- Lagergebühren
- Felder: orderId, amount, palletCount, daysCharged, calculatedAt, paidAt
- Relationen: order

#### **WalletTransaction** (wallet_transactions)
- Wallet-Transaktionen
- Felder: userId, type, amount, description, reference, status
- Type: COMMISSION_EARNED | PAYOUT_REQUESTED | PAYOUT_COMPLETED | STORAGE_FEE_CHARGED | REFUND | ADJUSTMENT
- Status: PENDING | COMPLETED | FAILED | CANCELLED
- Relationen: user

#### **PayoutRequest** (payout_requests)
- Auszahlungsanfragen
- Felder: userId, amount, iban, bankName, status, processedAt, processedBy, notes
- Status: PENDING | APPROVED | REJECTED | COMPLETED
- Relationen: user

---

## 🔌 BACKEND API (NestJS)

### Module & Endpoints

#### **Admin** (`/admin`)
- `POST /admin/login` - Admin-Login (JWT)
- Admin-Dashboard, User-Verwaltung, Produkt-Verwaltung

#### **Users** (`/users`)
- `GET /users/me` - Aktueller User
- `PATCH /users/me` - User-Profil aktualisieren
- `GET /users` - Alle Users (Admin only)

#### **Products** (`/products`)
- `GET /products` - Alle Produkte
- `GET /products/:id` - Produkt-Details
- `POST /products` - Produkt erstellen (Admin)
- `PATCH /products/:id` - Produkt aktualisieren (Admin)
- `DELETE /products/:id` - Produkt löschen (Admin)

#### **Orders** (`/orders`)
- `POST /orders` - Order erstellen
- `GET /orders` - Alle Orders (eigene oder alle für Admin)
- `GET /orders/:id` - Order-Details
- `PATCH /orders/:id/status` - Order-Status ändern (Admin)
- `POST /orders/:id/choose-delivery` - **✨ Auslieferung wählen + Adresse** (NEU)

#### **Contracts** (`/contracts`)
- `POST /contracts/create-from-order` - Vertrag aus Order erstellen
- `GET /contracts` - Alle Verträge (eigene oder alle für Admin)
- `GET /contracts/:id` - Vertrag-Details
- `POST /contracts/:id/sign` - Vertrag signieren
- `GET /contracts/:id/pdf` - Vertrag-PDF abrufen

#### **Payments** (`/payments`)
- `POST /payments/create-payment-intent` - Stripe Payment Intent
- `POST /payments/webhook` - Stripe Webhook

#### **Wallet** (`/wallet`)
- `GET /wallet/balance` - Wallet-Guthaben
- `GET /wallet/transactions` - Transaktionen
- `POST /wallet/payout-request` - Auszahlung beantragen

#### **Commissions** (`/commissions`)
- `GET /commissions` - Provisionen
- `POST /commissions/calculate` - Provision berechnen

#### **Storage** (`/storage`)
- `GET /storage/fees` - Lagergebühren

#### **Invoices** (`/invoices`)
- Rechnungsverwaltung

---

## 🎨 FRONTEND (Next.js App Router)

### Public Pages

#### **Home** (`/`)
- Landing Page
- Hero Section mit CTA
- Produkt-Übersicht
- Features & Benefits

#### **Produkte** (`/products`)
- Alle verfügbaren Warenpakete
- Filter & Suche
- Cards mit Bild, Preis, Retail Value

#### **Produkt-Details** (`/products/[id]`)
- Detailseite mit Galerie
- Beschreibung, Preis, Stock
- "In den Warenkorb" Button

#### **Auth**
- `/sign-in` - Clerk Sign In
- `/sign-up` - Clerk Sign Up

#### **Legal**
- `/agb` - Allgemeine Geschäftsbedingungen
- `/datenschutz` - Datenschutzerklärung
- `/impressum` - Impressum
- `/widerrufsrecht` - Widerrufsrecht

### Protected Pages (User)

#### **Dashboard** (`/dashboard`)
- Übersicht: Bestellungen, Wallet, Verträge
- Quick Actions

#### **Onboarding** (`/onboarding`) ✨
- B2B-Verifizierung
- Firmendaten eingeben
- USt-IdNr. validieren

#### **Checkout** (`/checkout`)
- Warenkorb-Übersicht
- Stripe Payment
- B2B-Check (falls nicht verifiziert → /onboarding)

#### **Bestellungen** (`/orders`)
- Alle eigenen Bestellungen
- Status-Badges (PAID, PROCESSING, SHIPPED, etc.)

#### **Order Fulfillment** (`/orders/[id]/fulfillment`) ✨
- **Auswahl:** Auslieferung ODER Kommission
- **Auslieferung:**
  - Lieferadresse-Formular (Straße, PLZ, Ort, Land, Telefon)
  - → Weiterleitung zu `/orders/[id]/delivery-confirmation`
- **Kommission:**
  - Bankdaten-Formular (IBAN, BIC, Kontoinhaber)
  - → Weiterleitung zu `/contracts/[id]/sign`

#### **Delivery Confirmation** (`/orders/[id]/delivery-confirmation`) ✨ NEU
- Erfolgs-Icon (grüner Haken)
- Bestellübersicht (Produkt, Preis)
- Lieferadresse
- Voraussichtliche Lieferzeit: 5-10 Werktage
- "Zurück zu Bestellungen" Button

#### **Verträge** (`/contracts`)
- Alle eigenen Kommissionsverträge
- Status-Badges (draft, signed, active, etc.)

#### **Vertrag-Details** (`/contracts/[id]`)
- Vertrags-Details anzeigen
- PDF-Download (wenn signiert)
- Signatur-Vorschau

#### **Vertrag signieren** (`/contracts/[id]/sign`) ✨
- 14-Paragraphen Kommissionsvertrag anzeigen
- Österreichisches Recht, VIAC Wien
- Bankdaten-Anzeige
- Signatur-Canvas (weiß, schwarze Schrift)
- Checkbox: "Ich habe den Vertrag gelesen und akzeptiert"
- "Vertrag unterschreiben" Button (gold)

#### **Wallet** (`/wallet`)
- Guthaben-Übersicht
- Transaktionshistorie
- Auszahlung beantragen

#### **Referrals** (`/referrals`)
- Referral-Code
- Geworbene User
- Provisionen

### Admin Pages

#### **Admin Login** (`/admin/login`)
- JWT-basiert
- Email + Passwort

#### **Admin Dashboard** (`/admin/dashboard`)
- Statistiken (Users, Orders, Revenue)
- Charts

#### **Admin Users** (`/admin/users`)
- User-Liste
- Rolle ändern (BUYER → RESELLER)
- User-Details

#### **Admin Products** (`/admin/products`)
- Produkt-Verwaltung
- Erstellen, Bearbeiten, Löschen
- Stock-Management

#### **Admin Contracts** (`/admin/contracts`)
- Alle Kommissionsverträge
- Sales-Status ändern (pending → listed → sold)
- Verkaufspreis eingeben
- Auszahlung verarbeiten

#### **Admin Commissions** (`/admin/commissions`)
- Provisions-Übersicht
- Auszahlungen freigeben

---

## 🎯 BUSINESS FLOWS

### 1. KAUF-FLOW (Standard)
1. User browst Produkte (`/products`)
2. Produkt auswählen (`/products/[id]`)
3. In den Warenkorb → Checkout (`/checkout`)
4. **B2B-Check:** Ist User B2B-verifiziert?
   - ❌ Nein → Weiterleitung zu `/onboarding`
   - ✅ Ja → Stripe Payment
5. Payment erfolgreich → Order erstellt (Status: PAID)
6. Weiterleitung zu `/orders/[id]/fulfillment`

### 2. FULFILLMENT-FLOW: AUSLIEFERUNG ✨ NEU
1. User wählt "Sofortige Lieferung"
2. Lieferadresse eingeben (Straße, PLZ, Ort, Land, Telefon)
3. "Weiter" → API: `POST /orders/:id/choose-delivery`
4. Backend:
   - Order.fulfillmentType = "DELIVERY"
   - Order.status = PROCESSING
   - DeliveryAddress erstellen
5. Weiterleitung zu `/orders/[id]/delivery-confirmation`
6. Bestätigungsseite:
   - Grüner Haken ✅
   - Bestellübersicht
   - Lieferadresse
   - Lieferzeit: 5-10 Werktage

### 3. FULFILLMENT-FLOW: KOMMISSION ✨
1. User wählt "Verkaufskommission (20%)"
2. Bankdaten eingeben (IBAN, BIC, Kontoinhaber)
3. "Weiter" → API: `POST /contracts/create-from-order`
4. Backend:
   - CommissionContract erstellen
   - Status: draft
   - Vertragsnummer generieren
5. Weiterleitung zu `/contracts/[id]/sign`
6. Vertrags-Signatur-Seite:
   - 14-Paragraphen Vertrag anzeigen
   - Signatur-Canvas (weiß, schwarze Schrift)
   - Checkbox bestätigen
   - "Vertrag unterschreiben"
7. Backend:
   - Signatur speichern (Base64)
   - PDF generieren
   - Order.fulfillmentType = "COMMISSION"
   - CommissionContract.status = "signed"
8. Weiterleitung zu `/contracts` (Vertrags-Übersicht)

### 4. ADMIN-FLOW: VERKAUF & AUSZAHLUNG
1. Admin öffnet `/admin/contracts`
2. Vertrag auswählen → `/admin/contracts/[id]`
3. Sales-Status ändern:
   - "pending" → "listed" (gelistet)
   - "listed" → "sold" (verkauft)
4. Verkaufspreis eingeben
5. Auszahlung berechnen:
   - Verkaufspreis × (1 - 0.20) = Auszahlungsbetrag
   - Minus Lagergebühren (nach 14 Tagen: €0.50/Palette/Tag)
6. Auszahlung freigeben → PayoutRequest erstellen
7. Geld auf User-Wallet buchen

---

## 🎨 DESIGN-SYSTEM

### Farben
- **Hintergrund:** `#ebebeb` (helles Grau)
- **Cards:** `#ffffff` (Weiß)
- **Primary (Gold):**
  - `gold-dark`: #D4AF37 (dunkel)
  - `gold`: #F4C430 (standard)
  - `gold-light`: #FFD700 (hell)
- **Text:**
  - Primär: `#1a1a1a` (fast schwarz)
  - Sekundär: `#666666` (grau)
- **Signatur-Canvas:**
  - Hintergrund: Weiß
  - Stift: Schwarz

### Komponenten
- **Buttons:**
  - Primary: Gold-Gradient mit Schatten
  - Secondary: Weiß mit Hover-Grau
- **Cards:** Weiß mit leichtem Schatten
- **Inputs:** Grauer Hintergrund (#ebebeb), Gold-Border bei Focus
- **Badges:**
  - PAID: Grün
  - PROCESSING: Blau
  - SHIPPED: Lila
  - DELIVERED: Grün-Dunkel
  - CANCELLED: Rot

---

## 🔐 AUTHENTICATION

### User Auth (Clerk)
- OAuth-Provider: Google, GitHub, etc.
- Session-basiert
- Automatische User-Sync in DB (clerkId → User)
- Protected Routes via Middleware

### Admin Auth (JWT)
- Email + bcrypt-hashed Password
- JWT Token (7 Tage gültig)
- Speicherung in localStorage
- Admin-Routes via AdminAuthGuard

---

## 💳 PAYMENT (Stripe)

- **Payment Intents:** Checkout-Flow
- **Webhooks:**
  - `payment_intent.succeeded` → Order auf PAID setzen
- **Test-Mode:** Stripe Test-Keys

---

## 📄 VERTRAGS-DETAILS

### Kommissionsvertrag
- **14 Paragraphen** (Österreichisches Recht)
- **Schiedsgericht:** VIAC Wien
- **Kommissionssatz:** 20% vom Verkaufspreis
- **Lagerung:**
  - 14 Tage kostenlos
  - Danach: €0.50/Palette/Tag
- **Signatur:** Canvas-basiert (schwarze Schrift auf weiß)
- **PDF:** Generiert nach Signatur

---

## 🚀 DEPLOYMENT

### Railway
- **Auto-Deploy:** Push to `main` → Railway deployed
- **Services:**
  - Web (Next.js)
  - API (NestJS)
  - PostgreSQL
  - Redis
- **Environment Variables:**
  - `DATABASE_URL`
  - `REDIS_URL`
  - `CLERK_SECRET_KEY`
  - `STRIPE_SECRET_KEY`
  - etc.

### Build-Commands
```bash
# API
cd apps/api && npm run build

# Web
cd apps/web && npm run build

# Deployment
git add . && git commit -m "..." && git push origin main
# Railway deployed automatisch (2-3 Min)
```

---

## 🧪 TEST-DATEN

### Admin-Account
- **Email:** thomas@commercehelden.com
- **Password:** Admin123!
- **JWT Token:** Via `/admin/login`

### Test-Orders
- Order IDs verfügbar für E2E-Tests
- Status: PAID, fulfillmentType: NULL

### Test-URLs
- **Fulfillment:** `/orders/[id]/fulfillment`
- **Delivery Confirmation:** `/orders/[id]/delivery-confirmation`
- **Contract Signing:** `/contracts/[id]/sign`

---

## 📊 DATENBANK-VERBINDUNG

### PostgreSQL (Railway)
```
Host: nozomi.proxy.rlwy.net
Port: 36398
Database: railway
User: postgres
Password: pnUUiXJJmQwmoNifpLWjgCuvNlXcJtkh
```

**Public URL:**
```
postgresql://postgres:pnUUiXJJmQwmoNifpLWjgCuvNlXcJtkh@nozomi.proxy.rlwy.net:36398/railway
```

### Redis (Railway)
```
Host: hopper.proxy.rlwy.net
Port: 32205
Password: hrSYgcQFOKFEHrqHBpiUDBezRUUYChZM
```

**Public URL:**
```
redis://default:hrSYgcQFOKFEHrqHBpiUDBezRUUYChZM@hopper.proxy.rlwy.net:32205
```

---

## ✨ FEATURES

### Implementiert
- ✅ User-Registrierung & Login (Clerk)
- ✅ Admin-Login (JWT)
- ✅ B2B-Onboarding mit USt-IdNr.-Validierung
- ✅ Produkt-Katalog
- ✅ Warenkorb & Checkout (Stripe)
- ✅ Bestellverwaltung
- ✅ **Fulfillment-Auswahl:**
  - ✅ **Auslieferung** mit Lieferadresse & Bestätigungsseite
  - ✅ **Kommission** mit Vertrag & Signatur
- ✅ Kommissionsvertrag (14 Paragraphen, österr. Recht)
- ✅ Vertragssignatur (Canvas)
- ✅ Wallet-System
- ✅ Provisionen
- ✅ Lagergebühren
- ✅ Auszahlungen
- ✅ Referral-System
- ✅ Admin-Dashboard
- ✅ Sales-Verwaltung (Admin)

### Geplant / Fehlt
- ❌ E-Mail-Benachrichtigungen (Bestellung, Vertrag, Verkauf, Auszahlung)
- ❌ Push-Benachrichtigungen
- ❌ Tracking-Nummern für Lieferungen
- ❌ PDF-Rechnungen
- ❌ Analytics & Reporting
- ❌ Multi-Sprache (aktuell: Deutsch)

---

## 📝 WICHTIGE DATEIEN

### Backend
- `apps/api/prisma/schema.prisma` - Datenbank-Schema
- `apps/api/src/modules/orders/orders.controller.ts` - Order-API
- `apps/api/src/modules/orders/orders.service.ts` - Order-Business-Logic
- `apps/api/src/modules/contracts/contracts.controller.ts` - Vertrag-API
- `apps/api/src/modules/contracts/contracts.service.ts` - Vertrag-Business-Logic

### Frontend
- `apps/web/src/app/(protected)/orders/[id]/fulfillment/page.tsx` - Fulfillment-Auswahl
- `apps/web/src/app/(protected)/orders/[id]/delivery-confirmation/page.tsx` - Lieferbestätigung
- `apps/web/src/app/(protected)/contracts/[id]/sign/page.tsx` - Vertragssignatur
- `apps/web/src/app/(protected)/onboarding/page.tsx` - B2B-Onboarding
- `apps/web/src/app/(protected)/checkout/page.tsx` - Checkout

---

## 🔄 GIT WORKFLOW

```bash
# Änderungen committen
git add .
git commit -m "feat: neue Funktion"
git push origin main

# Railway deployed automatisch
# Warte 2-3 Minuten
```

---

## 📞 SUPPORT & RESOURCES

- **GitHub Repo:** https://github.com/angelus200/warenpakete-portal
- **Railway Dashboard:** https://railway.app
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Stripe Dashboard:** https://dashboard.stripe.com

---

**🎉 PROJEKT IST LIVE UND VOLL FUNKTIONSFÄHIG!**

---

## 📚 KNOWLEDGE SHOP

**Stand:** 26. Februar 2026
**Feature:** Digitale Produkte (Guides, Templates, Academy Content)

### Routen
- **User:** `/knowledge` (public, kein Login erforderlich zum Ansehen)
- **Admin:** `/admin/knowledge`

### Datenbank-Models

#### **KnowledgeProduct** (knowledge_products)
- Digitale Produkte zum Verkauf/Download
- Felder:
  - id, title (unique), description, category
  - price (Decimal), isFree (Boolean)
  - fileUrl (String) - z.B. `/downloads/knowledge/datei.pdf`
  - isActive (Boolean), sortOrder (Int)
  - createdAt, updatedAt
- Kategorien: `"guide"` | `"template"` | `"academy"`
- Relationen: purchases (KnowledgePurchase[])

#### **KnowledgePurchase** (knowledge_purchases)
- Käufe von Knowledge-Produkten
- Felder:
  - id, userId, productId
  - paidAmount (Decimal)
  - stripePaymentIntentId (String, optional)
  - createdAt
- Unique Constraint: (userId, productId) - User kann Produkt nur einmal kaufen
- Relationen: user, product

**User Model erweitert:**
- `knowledgePurchases KnowledgePurchase[]`

### Zahlungsflow

#### Kostenlose Produkte
1. User klickt "Download" auf kostenloses Produkt
2. Backend erstellt sofort `KnowledgePurchase` (paidAmount=0)
3. Download startet automatisch

#### Kostenpflichtige Produkte
1. User klickt "Kaufen"
2. Backend erstellt Stripe `PaymentIntent` (NICHT Checkout Session!)
3. Frontend öffnet Modal mit Stripe `PaymentElement`
4. Metadata: `{type: 'knowledge_product', productId, userId}`
5. Payment erfolgreich → Webhook `payment_intent.succeeded`
6. `payments.service.ts` erstellt `KnowledgePurchase`
7. User kann nun downloaden

### Webhook Integration

**payments.service.ts erweitert:**
```typescript
case 'payment_intent.succeeded': {
  // Bestehender Code für normale Orders...

  // NEU: Knowledge Product Payments
  if (paymentIntent.metadata?.type === 'knowledge_product') {
    const knowledgeService = this.moduleRef.get(KnowledgeService);
    await knowledgeService.completePurchase(
      paymentIntent.metadata.userId,
      paymentIntent.metadata.productId,
      paymentIntent.amount / 100, // cents → euro
      paymentIntent.id
    );
  }
}
```

### Frontend-Integration

#### Stripe Dependencies
```json
"@stripe/stripe-js": "8.8.0",
"@stripe/react-stripe-js": "5.6.0"
```

**Installation:**
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js --legacy-peer-deps
```

#### Components
- **CheckoutForm:** Stripe `Elements` + `PaymentElement` in Modal
- **Product Cards:** Kategorie-Badge, Preis, Status-basierte Buttons
- **Filter Tabs:** Alle, Guides, Templates, Academy

#### Mobile-Optimierung
- Header: `text-2xl md:text-4xl`, reduziertes Padding
- Filter Tabs: Horizontal scrollbar, kleinere Buttons
- Cards: `p-4 md:p-6`
- Buttons: `px-4 py-2 md:px-6`, `text-sm md:text-base`
- Modal: `mx-4 p-6 md:p-8` für bessere mobile Darstellung

### PDF-Dateien

**Speicherort:**
```
apps/web/public/downloads/knowledge/
├── amazon-seller-checkliste.pdf
├── produktrecherche-template.pdf
├── steuer-guide-reverse-charge.pdf
├── roi-kalkulation.pdf
├── amazon-fba-grundlagen.pdf
└── marketplace-starter-guide.pdf
```

**Auslieferung:**
- Next.js static file serving über `/downloads/knowledge/`
- Backend generiert signed Download-URLs (Auth-Check)
- Download-Endpoint: `GET /knowledge/:id/download` (Protected)

**PDF-Generierung:**
```bash
cd apps/api
npx ts-node -r tsconfig-paths/register src/scripts/generate-knowledge-pdfs.ts
```

**Script:** `apps/api/src/scripts/generate-knowledge-pdfs.ts`
- Verwendet Puppeteer für HTML → PDF
- Professional Design mit Gold-Gradient Header
- Alle PDFs 120KB-220KB groß
- Real Content (keine Lorem Ipsum)

### Backend API Endpoints

#### Public
- `GET /knowledge` - Alle aktiven Produkte

#### Protected (User)
- `GET /knowledge/my-purchases` - Eigene Käufe
- `POST /knowledge/:id/purchase` - Produkt kaufen
- `GET /knowledge/:id/download` - Download (nur nach Kauf)

#### Admin
- `POST /knowledge` - Produkt erstellen
- `PATCH /knowledge/:id` - Produkt aktualisieren
- `DELETE /knowledge/:id` - Produkt löschen

### Seeding

**Script:** `apps/api/src/scripts/seed-knowledge.ts`

**Produkte:**
1. **Amazon Seller Checkliste** (Template, €19.00)
2. **Produktrecherche Template** (Template, €29.00)
3. **Steuer-Guide Reverse Charge** (Guide, €29.00)
4. **ROI Kalkulations-Template** (Template, €19.00)
5. **Amazon FBA Grundlagen** (Academy, Kostenlos)
6. **Marketplace Starter Guide** (Guide, €49.00)

**Seeding ausführen:**
```bash
cd apps/api
npx ts-node -r tsconfig-paths/register src/scripts/seed-knowledge.ts
```

### Middleware-Konfiguration

**apps/web/src/middleware.ts:**
```typescript
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/erstgespraech',
  '/partner',
  '/knowledge',  // ← Public Route
]);
```

- `/knowledge` ist public → kein Login zum Ansehen
- Download-Endpoint erfordert Login + Kauf-Nachweis

### Neue Produkte hinzufügen

**Schritt-für-Schritt:**
1. PDF erstellen (manuell oder via generate-knowledge-pdfs.ts)
2. PDF nach `apps/web/public/downloads/knowledge/` kopieren
3. Via Admin-Interface `/admin/knowledge` oder Seed-Script in DB eintragen
4. `fileUrl` muss `/downloads/knowledge/dateiname.pdf` sein
5. **Kein Deploy nötig** wenn nur DB-Eintrag (statische Files bleiben)

### Design

**Header:**
- Gold-Gradient Background: `from-gold-dark via-gold to-gold-light`
- Title: "Knowledge Shop"
- Subtitle: "Premium Templates, Guides & Academy Content"

**Product Cards:**
- Weiß mit Hover-Gold-Border
- Kategorie-Badge (gold/10 background)
- "Kostenlos" Badge (grün) für free products
- Gold-Preis oder "Gratis"
- Status-basierte Buttons:
  - Kostenlos + nicht heruntergeladen: "Download" (gold)
  - Kostenlos + heruntergeladen: "✓ Heruntergeladen" (disabled)
  - Kostenpflichtig + nicht gekauft: "Kaufen" (gold)
  - Kostenpflichtig + gekauft: "✓ Download" (grün)

**Stripe Modal:**
- Weiß, abgerundete Ecken
- PaymentElement von Stripe
- Gold "Jetzt bezahlen" Button
- Grau "Abbrechen" Button

---

**Stand:** 26. Februar 2026
Letzte Aktualisierung: Knowledge Shop implementiert (mit Mobile-Optimierung)
