# Phonebooth Workspace - TODO List

## 🚧 Known Unfinished Features & Technical Debt

### Backend (phoneserver/)

#### ⚠️ Critical - Hardcoded Billing Rate
**File:** `phoneserver/src/endpoints/dial.ts` (line 9)
**Issue:** Billing uses hardcoded rate of `0.01` per minute instead of querying the `rate` table by country code
**Impact:** All calls charged at same rate regardless of destination country
**TODO:** 
```typescript
// Current (line 9):
const rate = 0.01; // Define the rate per minute for billing

// Should be:
// Extract country code from phone number
// Query rate table: SELECT price FROM rate WHERE code = countryCode
// Use retrieved price for billing calculations
```
**Priority:** High - affects billing accuracy
**Added:** 2025-11-24

#### ⚠️ In-Memory Billing Timer
**File:** `phoneserver/src/endpoints/dial.ts` (lines 176-201)
**Issue:** Call billing uses `setInterval` in-memory, not production-ready
**Impact:** Timer lost on server restart, doesn't scale across multiple instances
**TODO:** Replace with proper job queue (Bull, BullMQ, or external service like AWS SQS)
**Priority:** High - required for production deployment
**Added:** 2025-11-24

#### 🔐 Hardcoded JWT Secret
**Files:** 
- `phoneserver/src/endpoints/login.ts` (line 8)
- `phoneserver/src/authenticator.ts`
**Issue:** JWT secret is `"your-secure-secret-key"` hardcoded string
**Impact:** Security vulnerability
**TODO:** Move to environment variable or secret management service
**Priority:** Critical - must fix before production
**Added:** 2025-11-24

#### 🔧 Unused Authenticator Middleware
**File:** `phoneserver/src/authenticator.ts`
**Issue:** Authentication middleware exists but is not used anywhere
**Impact:** Code maintenance burden, confusion
**TODO:** Either implement middleware across all protected endpoints OR remove file entirely
**Priority:** Low - cleanup/refactoring
**Added:** 2025-11-24

#### 💾 Ephemeral Database
**File:** `phoneserver/src/db/index.ts` (line 48)
**Issue:** Database uses `:memory:` mode - all data lost on restart
**Impact:** Cannot persist data between restarts
**TODO:** Add configuration for persistent SQLite file or migrate to PostgreSQL/MySQL for production
**Priority:** High - required for production deployment
**Added:** 2025-11-24

#### 🔑 Auth Code Expiration and Cleanup
**File:** `phoneserver/src/endpoints/login.ts`
**Issue:** Auth codes stored indefinitely in user table, no expiration or cleanup
**Impact:** Security risk - old codes remain valid, database clutter
**TODO:** Add expiration timestamp to auth codes, implement cleanup job to delete expired codes
**Priority:** High - security concern
**Added:** 2025-11-24

#### 🍪 Wait for Cookie After Login
**File:** `phonebooth/src/pages/login.tsx` or `phonebooth/src/components/login/`
**Issue:** May not wait for JWT cookie to be set before redirecting
**Impact:** Race condition - user redirected before authentication complete
**TODO:** Ensure cookie is set and verified before navigation after login
**Priority:** Medium
**Added:** 2025-11-24

#### 🏠 Index Page - Show Login Component if User Not Logged In
**File:** `phonebooth/src/pages/index.tsx`
**Issue:** Index page doesn't check auth state to conditionally show login
**Impact:** UX - users must navigate to separate login page
**TODO:** Add auth check to index page, show login component if no JWT cookie present
**Priority:** Low - UX improvement
**Added:** 2025-11-24

### Frontend (phonebooth/)

#### 💰 Display Full Price and Balance
**File:** Various components (wallet, call pages)
**Issue:** Price and balance information not displayed in full detail
**Impact:** Users cannot see complete financial information
**TODO:** Add comprehensive price/balance display across relevant UI components
**Priority:** Medium
**Added:** 2025-11-24

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

#### ⚠️ Handle Call Canceled During Connecting
**File:** Call state management (`src/pages/call.tsx`)
**Issue:** No handling for call cancellation during connection phase
**Impact:** Possible UI stuck state or error
**TODO:** Add cancellation handling in "connecting" state transition
**Priority:** Medium
**Added:** 2025-11-24

---

## ✅ Completed Items

*(Completed TODOs will be moved here with completion date)*

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
