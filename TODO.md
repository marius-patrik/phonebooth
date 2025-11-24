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

### Frontend (phonebooth/)

#### 📝 No known unfinished features currently documented
**TODO:** Add frontend-specific TODOs as they are discovered

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
