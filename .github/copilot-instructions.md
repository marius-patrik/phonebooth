# Phonebooth Workspace - AI Coding Agent Instructions

## 📚 Instruction File Hierarchy

**This workspace uses a three-tier instruction system for AI agents:**

1. **Workspace-level** (this file: `.github/copilot-instructions.md`):
   - High-level monorepo architecture
   - Cross-project workflows and data flow
   - Shared conventions (Git, formatting, development environment)

2. **Project-level** (`phonebooth/.github/copilot-instructions.md` & `phoneserver/.github/copilot-instructions.md`):
   - Project-specific patterns and conventions
   - Detailed implementation guidance
   - Cross-references to sibling project (`../phonebooth/`, `../phoneserver/`)
   - Type synchronization requirements

3. **How AI agents receive instructions:**
   - Working at workspace root → This file only
   - Working in `phonebooth/` → This file + `phonebooth/.github/copilot-instructions.md`
   - Working in `phoneserver/` → This file + `phoneserver/.github/copilot-instructions.md`

**Why this matters:** AI agents automatically receive context-appropriate instructions based on working directory, ensuring they understand both project-specific details AND cross-project dependencies.

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

## Common Pitfalls

1. **Data Persistence:** Backend database is **ephemeral** - restarting loses all data
2. **JWT Secret:** Hardcoded as `"your-secure-secret-key"` (not production-ready)
3. **No Auth Middleware:** Endpoints manually check `req.cookies.jwt`, no centralized auth
4. **Import Extensions:** Backend requires `.js` extensions in imports despite writing `.ts`
5. **Proxy Configuration:** Frontend API calls to `/api/*` auto-route to localhost:8080 via Rsbuild

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
