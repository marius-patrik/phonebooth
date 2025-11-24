# Phonebooth Workspace - AI Coding Agent Instructions

## 📚 Documentation Hierarchy

**This workspace has multiple documentation sources:**

1. **README files** (quick reference for developers):
   - `README.md` - Workspace overview, setup, architecture
   - `phonebooth/README.md` - Frontend tech stack, API integration, patterns
   - `phoneserver/README.md` - Backend API endpoints, database schema, query patterns

2. **Instruction files** (detailed AI agent guidance):
   - This file - High-level monorepo architecture and workflows
   - `phonebooth/.github/copilot-instructions.md` - Frontend-specific patterns
   - `phoneserver/.github/copilot-instructions.md` - Backend-specific patterns

3. **TODO tracking** (`TODO.md` in workspace root):
   - Centralized list of unfinished features and technical debt
   - AI agents MUST actively maintain this file (see TODO Management section below)

**How AI agents receive instructions:**
- Working at workspace root → This file only
- Working in `phonebooth/` → This file + `phonebooth/.github/copilot-instructions.md`
- Working in `phoneserver/` → This file + `phoneserver/.github/copilot-instructions.md`

**Quick reference:** For setup, tech stack overview, and API documentation, check the README files. For implementation patterns and workflows, use these instruction files.

## ⚠️ Critical Development Reminders

**BEFORE making any code changes:**
1. ✅ **Verify your assumptions** - Check if the endpoint/type/component actually exists in both projects
2. ✅ **Search both directories** - Use `grep_search` or `semantic_search` across `phonebooth/` AND `phoneserver/`
3. ✅ **Check type compatibility** - Compare `phonebooth/src/api/types.tsx` with `phoneserver/src/db/index.ts`
4. ✅ **Identify cross-project impact** - Most changes require updates in BOTH projects

**AFTER making changes:**
1. ✅ **Update both projects** - Frontend changes usually need backend updates and vice versa
2. ✅ **Verify both terminals** - Check "Frontend Dev" and "Backend Dev" terminal outputs
3. ✅ **Update types in sync** - If database schema changes, update frontend types immediately
4. ✅ **Test end-to-end** - Verify data flow: Frontend → Proxy → Backend → Database → Response

**When asked to update these instruction files:**
- ⚠️ **CRITICAL**: Changes to architecture/patterns affect ALL THREE instruction files
- Update workspace-level (this file) for cross-project workflows
- Update `phonebooth/.github/copilot-instructions.md` for frontend-specific impacts
- Update `phoneserver/.github/copilot-instructions.md` for backend-specific impacts
- Maintain consistency across all three files regarding shared concepts (Git workflow, type sync, etc.)

## 🚨 Architectural Change Protocol

**BEFORE making any of these changes, ALERT THE USER to update instruction files:**

1. **Database schema changes:**
   - Adding/removing/renaming tables or columns
   - Changing primary keys, foreign keys, or constraints
   - Modifying data types or nullable fields
   - Impact: Update `DatabaseSchema` docs in backend instructions + frontend type sync
   - **README impact:** `phoneserver/README.md` - Database Schema section

2. **API contract changes:**
   - Adding/removing/renaming endpoints
   - Changing request/response payload structure
   - Modifying authentication mechanism (JWT → OAuth, etc.)
   - Impact: Update endpoint lists in all three instruction files + README files
   - **README impact:** `README.md` - Available API Endpoints, `phonebooth/README.md` - API Integration section, `phoneserver/README.md` - API Endpoints section

3. **Build/deployment changes:**
   - Switching build tools (Rsbuild → Vite, etc.)
   - Changing dev server ports
   - Modifying proxy configuration
   - Adding/removing workspace tasks
   - Impact: Update workspace instructions + README setup sections
   - **README impact:** `README.md` - Quick Setup, Development, Architecture sections, `phonebooth/README.md` - Tech Stack, Development sections

4. **Framework/library changes:**
   - Replacing core dependencies (SWR → React Query, Kysely → Drizzle, etc.)
   - Changing routing libraries (Wouter → React Router)
   - Switching styling solutions (Tailwind → CSS Modules)
   - Impact: Update tech stack in README + pattern examples in instructions
   - **README impact:** `README.md` - Tech Stack section, `phonebooth/README.md` - Tech Stack, Key Patterns sections, `phoneserver/README.md` - Tech Stack section

5. **Authentication/security changes:**
   - Modifying JWT storage (cookies → headers)
   - Changing auth flow (email+code → OAuth)
   - Adding/removing middleware
   - Impact: Update auth patterns in all instruction files
   - **README impact:** `phonebooth/README.md` - API Integration section, `phoneserver/README.md` - Authentication Pattern section

6. **Monorepo structure changes:**
   - Adding/removing projects
   - Changing folder structure
   - Modifying Git repository setup
   - Impact: Update all instruction files + workspace README
   - **README impact:** `README.md` - Architecture, Project Structure sections

**Warning message template:**
```
⚠️ ARCHITECTURAL CHANGE DETECTED

The change you requested modifies [specific aspect].

Please update the following documentation after this change:

README files:
- [ ] README.md - [specific section]
- [ ] phonebooth/README.md - [specific section]
- [ ] phoneserver/README.md - [specific section]

Instruction files:
- [ ] .github/copilot-instructions.md - [specific section]
- [ ] phonebooth/.github/copilot-instructions.md - [specific section]
- [ ] phoneserver/.github/copilot-instructions.md - [specific section]

Proceed with implementation? (Please confirm)
```

## Workspace Architecture

This is a **monorepo workspace** containing two tightly coupled applications:
- **phonebooth/** - React 19 frontend (port 3000)
- **phoneserver/** - Express.js REST API (port 8080)

**Critical for AI Agents:** When making changes, you must understand BOTH codebases simultaneously. Frontend changes often require backend modifications and vice versa. Always:
- Search across both `phonebooth/` and `phoneserver/` directories when investigating features
- Verify type compatibility between frontend `src/api/types.tsx` and backend `src/db/index.ts` schemas
- Test changes in both servers (check task outputs for both terminals)
- Understand data flow: Frontend SWR → API endpoint → Kysely query → Database → JSON response

Each has its own Git repository, `package.json`, and development workflow. Both auto-start when opening the workspace via VS Code tasks.

## Critical Workflows

**Starting Development:**
Both servers auto-start via workspace tasks when you open `phonebooth.code-workspace`. If they fail:
```powershell
cd phonebooth; npm install
cd phoneserver; npm install
```

**Manual Task Execution:**
- Frontend Dev (Workspace) terminal - `npm run dev` in phonebooth/
- Backend Dev (Workspace) terminal - `npm run dev` in phoneserver/

**Verifying Changes Across Both Platforms:**
When you make changes, check both terminal outputs:
```powershell
# Use get_task_output to verify compilation
# Frontend: Look for "ready in X ms" and no TypeScript errors
# Backend: Look for "Server running on port 8080" and no tsx errors
```

**Architecture Decision:**
- Frontend uses Rsbuild proxy (`/api/*` → `http://localhost:8080`) - no CORS needed
- Backend uses **in-memory SQLite** (`:memory:`) - all data lost on restart
- JWT stored in HTTP-only cookies (not Authorization headers)

## Frontend (phonebooth/)

**Tech Stack:** React 19, Rsbuild, Tailwind CSS 4, Wouter (routing), SWR (data fetching)

**Data Fetching Pattern:**
All API calls use SWR with the shared `fetcher` from `src/api/fetcher.tsx`:
```tsx
// GET requests
const { data, error, isLoading } = useSWR<CallItem[]>("/api/calls", fetcher);

// POST mutations
await fetcher("/api/call/ring", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phoneNumber }),
});
mutate("/api/calls"); // Refresh SWR cache
```

**Page Layout Convention:**
Every page wraps content in `<Body>` from `src/components/page/body.tsx`:
```tsx
import Body from "../components/page/body";

const MyPage: react.FC = () => (
  <Body>
    {/* Page content - responsive header/footer auto-included */}
  </Body>
);
```

**Component Organization:**
- `src/pages/*.tsx` - Route components (one per URL)
- `src/components/page/` - Layout primitives (header, footer, body)
- `src/components/[feature]/` - Feature-specific UI (call, dial, login, cards)
- `src/components/display/` - Reusable UI elements (box-field, grid-item, separator)
- `src/components/input/` - Interactive components (buttons, links)
- `src/components/text/` - Typography (title, description)

**TypeScript Style:**
- Import React as lowercase: `import react from "react"`
- Type components as `react.FC` or `react.FC<PropsWithChildren<Props>>`
- Default exports for all components
- Centralized types in `src/api/types.tsx`

**Common Pattern - State-Driven UI:**
See `src/pages/call.tsx` for example:
- Use `useState` for UI state (e.g., call state: ringing → active → ended)
- Use `useEffect` to trigger API calls when state changes
- Use timers/intervals for real-time updates (call duration)

## Backend (phoneserver/)

**Tech Stack:** Express.js, better-sqlite3 (in-memory), Kysely (query builder), JWT cookies

**Authentication Flow:**
1. POST `/api/login/email` with `{ email }` → generates 6-digit code
2. POST `/api/login/code` with `{ code }` → returns JWT in HTTP-only cookie named `jwt`
3. Extract user ID: `getUserIdFromToken(req.cookies.jwt)` from `src/tokenizer.ts`

**Critical:** `src/authenticator.ts` exists but is **NOT used**. Endpoints manually validate tokens.

**Database Pattern:**
- Schema: `src/db/index.ts` (Kysely TypeScript interfaces)
- Migrations: `src/db/migrations/0000-init.ts` (manual, run on startup)
- Test data inserted via `insertTestData()` in `src/main.ts`
- Always use Kysely query builder (never raw SQL):
```typescript
const user = await db
  .selectFrom("user")
  .selectAll()
  .where("id", "=", userId)
  .executeTakeFirst();
```

**Key Tables:**
- `user` - balance, currency, callerId (phone number), authCode
- `call` - tracks calls with owner FK, status (init/active/over), pricing
- `rate` - country calling rates by country code
- `transaction` - financial history with owner FK

**Endpoint Pattern:**
1. Create `src/endpoints/<name>.ts` exporting `{ router as <name>Router }`
2. Import and register in `src/main.ts`: `app.use(<name>Router)`
3. Extract user: `const userId = getUserIdFromToken(req.cookies.jwt)`
4. Filter queries by owner: `.where("owner", "=", userId)`

**Module System:**
- Uses `"type": "module"` in package.json (ES modules)
- Import with `.js` extensions: `from "../db/index.js"` even for `.ts` files
- No `tsconfig.json` - tsx handles compilation directly

## Cross-Cutting Concerns

**Formatting:** Biome (not ESLint/Prettier) - auto-formats on save
```tsx
/** biome-ignore-all assist/source/organizeImports: <idc> */
// Use this comment to prevent import reordering when necessary
```

**Git Workflow:**
- Each folder (`phonebooth/`, `phoneserver/`) is a separate Git repository
- Commit/push independently per project
- Workspace file (`phonebooth.code-workspace`) tracks both repos

**Development Environment:**
- VS Code workspace configured with Biome formatter
- Tailwind CSS IntelliSense extension recommended
- Separate terminal panels for frontend/backend auto-created

## TODO List Management

**Location:** `TODO.md` in workspace root

**AI Agent Responsibilities:**

1. **When implementing incomplete/temporary features:**
   - Add entry to `TODO.md` with file path, line number, description, and priority
   - Include code snippet showing the TODO area
   - Set priority: Critical (security/data loss) > High (production-required) > Medium > Low (cleanup)

2. **When encountering TODO comments in code:**
   - Check if documented in `TODO.md`
   - If not documented: Alert user and offer to add it
   - If already fixed: Alert user and suggest removing from both code and `TODO.md`

3. **When user asks to "add to TODO" or "add to todo list":**
   - Add formatted entry to `TODO.md` under appropriate project section
   - Include: file path, issue description, impact, TODO details, priority, date
   - Confirm addition to user

4. **When completing TODO items:**
   - Move entry from "Known Unfinished Features" to "Completed Items" section
   - Add completion date
   - Remove related TODO comments from code

**Examples:**
```markdown
#### ⚠️ Feature Name
**File:** `path/to/file.ts` (line X)
**Issue:** Brief description
**Impact:** What this affects
**TODO:** Specific implementation steps
**Priority:** High/Medium/Low/Critical
**Added:** YYYY-MM-DD
```

## Common Pitfalls

1. **Data Persistence:** Backend database is **ephemeral** - restarting loses all data
2. **JWT Secret:** Hardcoded as `"your-secure-secret-key"` (not production-ready)
3. **No Auth Middleware:** Endpoints manually check `req.cookies.jwt`, no centralized auth
4. **Import Extensions:** Backend requires `.js` extensions in imports despite writing `.ts`
5. **Proxy Configuration:** Frontend API calls to `/api/*` auto-route to localhost:8080 via Rsbuild

⚠️ **Note:** Items 2 and 3 are documented in `TODO.md` - check there for detailed remediation plans

## Available API Endpoints

**Authentication:**
- `POST /api/login/email` - Send email, generate 6-digit code
- `POST /api/login/code` - Validate code, set JWT cookie
- `POST /api/logout` - Clear JWT cookie

**User & Wallet:**
- `GET /api/user` - Get current user info (balance, email, callerId)
- `GET /api/balance` - Get current user's balance
- `POST /api/balance` - Add funds to balance

**Calling:**
- `GET /api/rates` - Get all country calling rates
- `GET /api/calls` - Get user's call history
- `POST /api/call/ring` - Initiate a call (ring/init state)
- `POST /api/call/connect` - Answer/connect a call (active state)
- `POST /api/call/hang` - End a call (over state)

**Transactions:**
- `GET /api/transactions` - Get user's transaction history

**Key pattern:** Most endpoints require JWT in `req.cookies.jwt` and filter data by `owner` (user ID).

## Adding Features

**Cross-Platform Feature Development:**
Most features span both frontend and backend. Always implement both sides:

**Example: Adding a new API endpoint with frontend integration:**
1. **Backend** (`src/endpoints/<name>.ts`):
   - Create router with endpoint logic
   - Add to `DatabaseSchema` in `src/db/index.ts` if new table needed
   - Export as `{ router as <name>Router }` and register in `src/main.ts`
2. **Frontend** (`src/api/types.tsx`):
   - Add TypeScript types matching backend response
   - Create page/component consuming the endpoint with `useSWR`
3. **Verify**:
   - Check Backend Dev terminal for successful compilation
   - Check Frontend Dev terminal for no TypeScript errors
   - Test API flow in browser (Frontend → Proxy → Backend → Database → Response)

**New Frontend Page:**
1. Create `src/pages/<name>.tsx` with `<Body>` wrapper
2. Add route in `src/index.tsx`: `<Route path="/<name>" component={<Name>Page} />`
3. Use `useSWR` for data fetching with shared `fetcher`
4. Add types to `src/api/types.tsx` matching backend response shape

**New Backend Endpoint:**
1. Create `src/endpoints/<name>.ts` with Express router
2. Export as `export { router as <name>Router }`
3. Import and `app.use()` in `src/main.ts`
4. Add types to `DatabaseSchema` in `src/db/index.ts` if needed
5. Ensure response shape matches frontend type expectations

**New Database Table:**
1. Add interface to `DatabaseSchema` in `src/db/index.ts`
2. Create numbered migration in `src/db/migrations/`
3. Register in `src/db/migrator.ts` getMigrations object
4. Add test data in `insertTestData()` in `src/main.ts`
5. Update frontend types in `src/api/types.tsx` if exposed via API
