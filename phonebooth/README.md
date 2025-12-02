
# Phonebooth - Frontend

A modern VoIP phone application UI built with React 19, Rsbuild, and Tailwind CSS 4.

## Overview

This is the frontend application for Phonebooth, providing a responsive web interface for making VoIP calls, managing account balance, and viewing call history. It communicates with the Express backend via a proxied API.

## Documentation System

This project uses a multi-tier documentation system for both developers and AI coding agents:

- **Frontend agent instructions:** `.github/copilot-instructions.md` (patterns, conventions, SWR usage)
- **Workspace-level agent instructions:** `../.github/copilot-instructions.md` (architecture, workflows, cross-project impact)
- **TODO tracking:** `../TODO.md` (all unfinished features and technical debt)
- **System meta:** `../AGENT_SYSTEM.md` (AI agent behavior, documentation hierarchy)

**Always update all relevant documentation when making architectural changes, adding features, or completing TODOs.**

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Rsbuild with React plugin
- **Styling:** Tailwind CSS 4 with PostCSS
- **Routing:** Wouter (lightweight React Router alternative)
- **Data Fetching:** SWR (React Hooks for Data Fetching)
- **Language:** TypeScript 5.9
- **Code Quality:** Biome (linting & formatting)

## Development

### Prerequisites

- Node.js 18+
- Backend server running on port 8080 (see `../phoneserver/`)

### Setup

```powershell
npm install
npm run dev
```

The app will be available at http://localhost:3000

### Project Structure

```
src/
├── pages/                    # Route components
│   ├── index.tsx             # Home page (rates)
│   ├── dial.tsx              # Dial pad page
│   ├── call.tsx              # Active call page
│   ├── history.tsx           # Call history
│   ├── wallet.tsx            # Account balance
│   ├── transactions.tsx      # Transaction history
│   └── login.tsx             # Authentication
├── components/
│   ├── body/                 # Layout components
│   │   ├── body.tsx          # Page wrapper with header/footer
│   │   ├── mobile-topbar.tsx # Mobile header
│   │   └── mobile-footer.tsx # Mobile footer
│   ├── call/                 # Call UI components
│   ├── dial/                 # Dial pad components
│   ├── cards/                # Data display cards
│   ├── display/              # UI primitives
│   ├── text/                 # Typography components
│   ├── input/                # Buttons & links
├── api/
│   ├── fetcher.tsx           # HTTP client wrapper
│   └── types.tsx             # TypeScript API types
└── global.css                # Tailwind directives
```

## Key Patterns

### Page Layout

Every page wraps content in the `Body` component for consistent layout:

```tsx
import Body from "../components/body/body";

const MyPage: react.FC = () => (
  <Body>
    {/* Page content */}
  </Body>
);
```

The `Body` component provides:
- Responsive header (desktop) / footer (mobile) navigation
- Centered content container with max-width
- Full-height scrollable layout

### Data Fetching

All API calls use SWR with a shared `fetcher`:

```tsx
import useSWR from "swr";
import { fetcher } from "../api/fetcher";
import type { CallItem } from "../api/types";

const { data, error, isLoading } = useSWR<CallItem[]>("/api/calls", fetcher);
```

For mutations (POST/PUT/DELETE):

```tsx
await fetcher("/api/call/ring", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phoneNumber }),
});
mutate("/api/calls"); // Refresh SWR cache
```

### Routing

Routes are defined in `src/index.tsx` using Wouter:

```tsx
<Switch>
  <Route path="/" component={IndexPage} />
  <Route path="/dial" component={DialPage} />
  <Route path="/call/:phone" component={CallPage} />
  {/* ... */}
</Switch>
```

### TypeScript Conventions

- Import React as lowercase: `import react from "react"`
- Type components as `react.FC` or `react.FC<PropsWithChildren<Props>>`
- All API types defined in `src/api/types.tsx`
- Default exports for all components

## API Integration

The frontend communicates with the backend via `/api/*` endpoints, which are proxied to `http://localhost:8080` by Rsbuild (configured in `rsbuild.config.ts`).

### Available API Endpoints

**Authentication:**
- `POST /api/login/email` - Send email, get 6-digit code
- `POST /api/login/code` - Validate code, receive JWT cookie
- `POST /api/logout` - Clear authentication

**User & Wallet:**
- `GET /api/user` - Get user info (balance, email, caller ID)
- `GET /api/balance` - Get current balance
- `POST /api/balance` - Add funds to balance

**Calling:**
- `GET /api/rates` - Get country calling rates
- `GET /api/calls` - Get call history
- `POST /api/call/ring` - Initiate call
- `POST /api/call/pickup` - Answer call
- `POST /api/call/hangup` - End call

**Transactions:**
- `GET /api/transactions` - Get transaction history

### Type Definitions

All API response types are defined in `src/api/types.tsx`:

```tsx
export interface CallItem {
  id: string;
  callee: number;
  price?: number;
  status: "init" | "active" | "over";
  startTime: string;
  endTime?: string;
}

export interface UserItem {
  id: string;
  currency: string;
  displayCurrency: string;
  balance: number;
  email: string;
  callerId: number;
}
```

**Important:** These types must match the backend schema in `../phoneserver/src/db/index.ts`.

## Responsive Design

- **Mobile:** Footer navigation visible, header hidden
- **Desktop:** Header navigation visible, footer hidden
- **Breakpoint:** Tailwind `md:` classes (768px)
- **Layout:** `w-full md:max-w-2xl` centers content on desktop

## Code Quality

### Biome

Auto-formats code on save. Some files use ignore comments to preserve import order:

```tsx
/** biome-ignore-all assist/source/organizeImports: <idc> */
```

### TypeScript

Strict mode enabled in `tsconfig.json`. All components are fully typed.

## Building for Production

```powershell
npm run build
```

Output is generated in the `dist/` directory.

## Troubleshooting

**API requests fail:**
- Ensure backend is running on port 8080
- Check Rsbuild proxy configuration in `rsbuild.config.ts`

**Type errors:**
- Verify types in `src/api/types.tsx` match backend responses
- Check backend schema in `../phoneserver/src/db/index.ts`

**Authentication issues:**
- JWT is stored in HTTP-only cookies (not localStorage)
- Use the `/login` page to authenticate

## Development Tips

1. **Adding a new page:**
   - Create component in `src/pages/<name>.tsx`
   - Wrap content in `<Body>`
   - Add route in `src/index.tsx`
   - Add navigation link in header/footer

2. **Adding a new API integration:**
   - Add type to `src/api/types.tsx`
   - Use `useSWR` for GET requests
   - Use `fetcher` directly for mutations
   - Call `mutate()` to refresh data after mutations

3. **Styling components:**
   - Use Tailwind utility classes
   - Follow existing component patterns in `src/components/display/`
   - Use semantic wrappers (`FieldBox`, `Title`, `Description`)

## Related Projects

- [Backend (phoneserver)](../phoneserver/) - Express API and database
- [Workspace](../) - Monorepo configuration

## Repository

https://github.com/pastiiiiiiik/phonebooth

## License

MIT
