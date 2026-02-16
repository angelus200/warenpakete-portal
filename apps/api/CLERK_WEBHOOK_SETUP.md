# Clerk Webhook Setup für User-Synchronisation

## Problem
Neue User die sich via Clerk registrieren werden nicht automatisch in die PostgreSQL Datenbank synchronisiert, weil `CLERK_WEBHOOK_SECRET` fehlt.

## Lösung: Clerk Webhook konfigurieren

### 1. Clerk Dashboard öffnen
- Gehe zu: https://dashboard.clerk.com
- Wähle dein Project: **E-Commerce Service** (Production)

### 2. Webhook Endpoint erstellen
- Navigiere zu: **Webhooks** im Sidebar
- Klicke: **+ Add Endpoint**

### 3. Konfiguration
**Endpoint URL:**
```
https://api.ecommercerente.com/users/webhook
```

**Events auswählen:**
- ✅ `user.created`
- ✅ `user.updated`
- ✅ `user.deleted`

**Description (optional):**
```
PostgreSQL User Sync
```

### 4. Signing Secret kopieren
- Nach dem Erstellen zeigt Clerk den **Signing Secret**
- Format: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Kopiere diesen Secret!**

### 5. Railway Environment Variable setzen

**A) Railway Dashboard:**
- Gehe zu: https://railway.app
- Project: **warenpakete-portal**
- Service: **charismatic-rejoicing** (Backend API)
- Tab: **Variables**
- Klicke: **+ New Variable**

**Variable hinzufügen:**
```
Name:  CLERK_WEBHOOK_SECRET
Value: whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**B) Deploy triggern:**
- Railway deployed automatisch nach Variable-Änderung
- Warte ~2 Minuten bis Deployment fertig ist

### 6. Lokale Entwicklung (optional)

Füge das Secret in `apps/api/.env` hinzu:
```bash
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**WICHTIG:** Committe NIEMALS echte Secrets in Git!

### 7. Testen

**Test 1: Neuen User erstellen**
1. Registriere einen Test-User auf https://www.ecommercerente.com/sign-up
2. Prüfe ob User in Admin-Panel erscheint: https://www.ecommercerente.com/admin/users
3. Prüfe Railway Logs: Sollte KEINE Fehler mehr zeigen

**Test 2: Webhook Logs in Clerk**
1. Clerk Dashboard → Webhooks → Dein Endpoint
2. Tab: **Logs**
3. Sollte erfolgreiche `user.created` Events mit Status `200` zeigen

**Test 3: Datenbank prüfen**
```bash
cd apps/api
node check-users.js
```

## Webhook-Code (Bereits implementiert)

Der Code in `apps/api/src/modules/users/users.controller.ts` ist bereits fertig:

- POST `/users/webhook` empfängt Clerk Events
- Verifiziert Signatur mit `CLERK_WEBHOOK_SECRET`
- Synchronisiert User-Daten in PostgreSQL
- Sendet Welcome-Email bei `user.created`

## Fallback: Auto-Create im Auth Guard

Zusätzlich zum Webhook gibt es einen Fallback-Mechanismus in `clerk-auth.guard.ts`:

- Wenn ein User in Clerk existiert aber nicht in der DB
- Wird er automatisch beim ersten API-Request angelegt
- Garantiert: Kein User geht verloren, selbst wenn Webhook ausfällt

## Monitoring

**Railway Logs überwachen:**
```bash
# Erfolgreiche Webhook-Calls:
✅ Webhook received: user.created for user_xxxxx

# Fehlgeschlagene Calls (vor dem Fix):
❌ CLERK_WEBHOOK_SECRET not configured
❌ Invalid webhook signature

# Auto-Create Fallback (wenn Webhook missed):
✅ Auto-created user email@example.com (webhook missed)
```

## Support

Bei Problemen:
- Prüfe Railway Logs: `charismatic-rejoicing` Service
- Prüfe Clerk Webhook Logs: Dashboard → Webhooks → Logs
- Teste mit: `curl -X POST https://api.ecommercerente.com/users/webhook` (sollte 400 geben)
