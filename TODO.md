# Phonebooth Workspace - TODO List

## 🚧 Known Unfinished Features & Technical Debt

### Backend (phoneserver/)

### Frontend (phonebooth/)

#### 📞 Routing Number Selector
**File:** Dial/call interface
**Issue:** No UI for selecting routing number
**Impact:** Users cannot choose specific routing options
**TODO:** Implement routing number selection component
**Priority:** Medium
**Added:** 2025-11-24

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

#### ❌ Don't Add Failed Calls
**File:** Call history display
**Issue:** Failed calls may be shown in history
**Impact:** Cluttered call history
**TODO:** Filter out failed/canceled calls from history display
**Priority:** Low
**Added:** 2025-11-24

#### 📦 Alert Box Component
**File:** Component library
**Issue:** No reusable alert/notification component
**Impact:** Inconsistent error/success messaging
**TODO:** Create standardized alert box component in `src/components/display/`
**Priority:** Medium
**Added:** 2025-11-24

#### 🕐 Date Format 24h
**File:** Time/date display components
**Issue:** Date format may not support 24-hour time preference
**Impact:** Inconsistent time display for international users
**TODO:** Add 24-hour format option for timestamps
**Priority:** Low
**Added:** 2025-11-24

---

## ✅ Completed Items

### 2025-11-24

#### 🍪 Wait for Cookie After Login
**Solution:** Implemented fire-and-forget auth code clearing after response is sent. JWT cookie is set via `res.cookie()` before response, then auth code is cleared asynchronously without blocking. This ensures user is authenticated before navigation.
**Files Modified:**
- `phoneserver/src/endpoints/login.ts` - Moved auth code clearing after response with `.catch()` handler

#### 💰 Display Full Price and Balance
**Solution:** Balance and price information now displayed throughout the app. User page shows balance with currency, history shows call costs, post-call stats show detailed pricing breakdown (duration, rate, total cost).
**Files Modified:**
- `phonebooth/src/pages/user.tsx` - Displays balance with currency
- `phonebooth/src/components/cards/history-card.tsx` - Shows call costs
- `phonebooth/src/components/call/call-over.tsx` - Post-call statistics with full pricing

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

#### ⚠️ Hardcoded Billing Rate (High)
**Solution:** Implemented country code extraction from phone numbers and database lookup in `rate` table. Created `getRateForNumber()` and `getCountryCode()` functions. Updated `endCall()` to accept callee number and dynamically fetch rates.
**Files Modified:**
- `phoneserver/src/endpoints/dial.ts`

#### 🔑 Auth Code Expiration (High)
**Solution:** Added `authCodeExpires` field to user table with 15-minute TTL. Login endpoint now sets expiration timestamp and validates it, clearing expired codes automatically.
**Files Modified:**
- `phoneserver/src/db/index.ts` (schema update)
- `phoneserver/src/db/migrations/0001-add-auth-code-expiration.ts` (created)
- `phoneserver/src/db/migrator.ts`
- `phoneserver/src/endpoints/login.ts`

#### 💾 Ephemeral Database (High)
**Solution:** Added `DATABASE_PATH` environment variable to config. Database now reads from `.env` and supports both `:memory:` (dev) and file-based persistence (production). Logs warning when using in-memory mode.
**Files Modified:**
- `phoneserver/src/config.ts`
- `phoneserver/src/db/index.ts`
- `phoneserver/.env`
- `phoneserver/.env.example`
- `phoneserver/.gitignore` (added `*.db` exclusion)

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

#### 🔧 Unused Authenticator Middleware (Low)
**Solution:** Implemented JWT authentication middleware across all protected endpoints. Updated `authenticateJWT()` to read JWT from cookies and attach user data to `req.user`. Applied middleware globally in `main.ts` after public routes. Removed manual `getUserIdFromToken()` calls from all endpoints.
**Files Modified:**
- `phoneserver/src/authenticator.ts` - Updated to use cookies and attach user to request
- `phoneserver/src/types.ts` - Created Express Request type augmentation
- `phoneserver/src/main.ts` - Applied middleware to protected routes
- `phoneserver/src/endpoints/user.ts` - Use req.user.id
- `phoneserver/src/endpoints/transactions.ts` - Use req.user.id
- `phoneserver/src/endpoints/calls.ts` - Use req.user.id
- `phoneserver/src/endpoints/balance.ts` - Use req.user.id
- `phoneserver/src/endpoints/dial.ts` - Use req.user.id (3 endpoints)

---

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
