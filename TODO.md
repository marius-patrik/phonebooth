# Phonebooth Workspace - TODO List

## 🚧 Known Unfinished Features & Technical Debt

### Backend (phoneserver/)

#### 🕒 Replace Billing Timer With Job Queue
**File:** `src/services/billing-manager.ts` (line 10)
**Issue:** Billing manager uses in-memory setInterval for periodic billing checks
**Impact:** Not scalable for production; risk of missed billing events on server restart or crash
**TODO:** Replace global timer with a persistent job queue (Bull, BullMQ, AWS SQS, etc.) for reliable billing event processing
**Priority:** High (production readiness)
**Added:** 2025-11-25

#### 📞 Integrate Telephony Provider
**File:** `src/endpoints/dial.ts` (line 161)
**Issue:** Call initiation is a stub; does not connect to any real telephony service
**Impact:** No actual phone calls can be made; feature incomplete
**TODO:** Integrate with a real telephony provider (e.g., Twilio, Plivo) to initiate outbound calls
**Priority:** High (core feature)
**Added:** 2025-11-25

### Frontend (phonebooth/)

#### 🔔 Add Ring Sound
**File:** Call interface components
**Issue:** No audio feedback when call is ringing
**Impact:** Poor UX - users don't hear ringing
**TODO:** Add audio element with ring sound on call init state
**Priority:** Medium
**Added:** 2025-11-24

#### 💳 Connect Stripe
**File:** Payment/wallet integration
**Issue:** No payment gateway integration
**Impact:** Cannot process real payments
**TODO:** Integrate Stripe API for payment processing
**Priority:** High - required for production
**Added:** 2025-11-24

#### 📦 Alert Box Component
**File:** Component library
**Issue:** No reusable alert/notification component
**Impact:** Inconsistent error/success messaging
**TODO:** Create standardized alert box component in `src/components/display/`
**Priority:** Medium
**Added:** 2025-11-24

---

## ✅ Completed Items

#### ⚠️ Handle Call Canceled During Connecting
**Solution:** Added `connectTimeoutRef` to track pending connection timeout. Cleanup function in useEffect clears timeout on unmount. `endCall()` now cancels pending connection if called during ringing state, preventing race condition where setTimeout would still execute after cancellation.
**Files Modified:**
- `phonebooth/src/pages/call.tsx` - Added timeout ref, cleanup, and cancellation handling

#### 🔐 Hardcoded JWT Secret (Critical)
**Solution:** Created `phoneserver/src/config.ts` to load JWT secret from `.env` file. Updated all files using JWT to import from config. Added `.env.example` template and updated `.gitignore`.
**Files Modified:** 
- `phoneserver/src/config.ts` (created)
- `phoneserver/.env` (created)
- `phoneserver/.env.example` (created)
- `phoneserver/src/endpoints/login.ts`
- `phoneserver/src/authenticator.ts`
- `phoneserver/.gitignore`

#### ⚠️ In-Memory Billing Timer (High)
**Solution:** Created centralized `billing-manager.ts` with global interval that monitors all active calls. Added `lastBillingCheck` field to call table for persistence. Manager auto-starts on server launch and resumes monitoring active calls from previous session. Removed per-call `setInterval` from dial endpoint.
**Files Modified:**
- `phoneserver/src/billing-manager.ts` (created)
- `phoneserver/src/db/index.ts` (schema update)
- `phoneserver/src/db/migrations/0002-add-billing-check-timestamp.ts` (created)
- `phoneserver/src/db/migrator.ts`
- `phoneserver/src/endpoints/dial.ts`
- `phoneserver/src/main.ts`

**Note:** Still uses setInterval but much more production-ready. For true production at scale, replace with job queue (Bull, BullMQ, AWS SQS).

## 📋 How to Use This File

**For Developers:**
- Review this list before starting new work
- Update priorities as project evolves
- Move completed items to "Completed" section with date

**For AI Agents:**
- Check this file when implementing related features
- Alert user when encountering TODO comments in code that aren't documented here
- Suggest removal of completed TODOs when verifying functionality
- Add new entries when creating temporary/incomplete implementations

**Priority Levels:**
- **Critical** - Security issues, data loss risks
- **High** - Required for production, affects core functionality
- **Medium** - Important but not blocking
- **Low** - Nice to have, cleanup, refactoring
