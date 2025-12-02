# 📞 Phonebooth

A modern VoIP calling application built as a monorepo with a React frontend and Express.js backend.

## 🏗️ Architecture

```
phonebooth/
├── client/          # React 19 frontend (Rsbuild + Tailwind CSS 4)
├── server/          # Express.js REST API (Kysely + SQLite)
├── package.json     # Root workspace dependencies
└── phonebooth.code-workspace  # VS Code workspace config
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Rsbuild, Tailwind CSS 4, Wouter, SWR |
| **Backend** | Express.js, Kysely, SQLite, JWT (HTTP-only cookies) |
| **Dev Tools** | Biome (linting/formatting), TypeScript |

### Data Flow

```
Frontend (SWR) → Rsbuild Proxy (/api/*) → Backend API → Kysely → SQLite → JSON Response
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd phonebooth

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies  
cd server && npm install && cd ..
```

### Development

**Option 1: VS Code Workspace (Recommended)**

Open `phonebooth.code-workspace` in VS Code/Cursor. Both servers will auto-start via workspace tasks.

**Option 2: Manual**

```bash
# Terminal 1 - Backend (port 8080)
cd server
npm run dev

# Terminal 2 - Frontend (port 3000)
cd client
npm run dev
```

### Access

- **Frontend:** https://localhost:3000
- **Backend API:** http://localhost:8080

---

## 📁 Project Structure

### Client (`client/`)

```
src/
├── api/
│   ├── fetcher.tsx     # SWR fetch wrapper
│   └── types.tsx       # TypeScript interfaces (must match backend)
├── components/
│   ├── body/           # Layout wrappers (header, footer)
│   ├── call/           # Call state components (ring, active, finished)
│   ├── cards/          # Data display cards
│   ├── dial/           # Dial pad UI
│   ├── display/        # UI primitives (box, line, spacer)
│   └── input/          # Interactive elements (buttons, links, inputs)
├── functions/
│   └── formatter.ts    # Utility functions
├── hooks/
│   ├── auth-handler.tsx    # Auth state management
│   └── logout-handler.tsx  # Logout logic
├── pages/
│   ├── private/        # Protected routes
│   │   ├── dial.tsx         # Dial pad
│   │   ├── call.tsx         # Active call
│   │   ├── account.tsx      # Account & deposit
│   │   ├── history.tsx      # Call history
│   │   └── contacts/        # Contact management
│   └── public/         # Public routes
│       ├── rates.tsx        # Landing page / rates
│       ├── auth.tsx         # Login / register
│       ├── loading.tsx      # Loading state
│       └── error.tsx        # Error page
├── global.css          # Global styles
└── index.tsx           # App entry point
```

### Server (`server/`)

```
src/
├── config.ts           # Environment configuration
├── db/
│   ├── index.ts        # Database schema (Kysely)
│   ├── migrations/     # Database migrations
│   └── migrator.ts     # Migration runner
├── endpoints/
│   ├── user/           # User endpoints (auth, email, logout, user)
│   ├── calls.ts        # Call history
│   ├── contacts.ts     # Contact management
│   ├── deposit.ts      # Balance/deposit
│   ├── dial.ts         # Call operations (ring, connect, hang)
│   ├── rates.ts        # Rate information
│   └── transactions.ts # Transaction history
├── services/
│   ├── authenticator.ts    # JWT middleware
│   ├── billing-manager.ts  # Call billing service
│   ├── emailer.ts          # Email service
│   └── tokenizer.ts        # JWT utilities
└── main.ts             # Server entry point
```

---

## 📡 API Endpoints

### Public (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/user/email` | Send auth code to email |
| `POST` | `/api/user/auth` | Validate code, set JWT cookie |
| `GET` | `/api/rates` | Get calling rates |

### Protected (Requires JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user` | Get user info |
| `POST` | `/api/user/deposit` | Add funds |
| `POST` | `/api/user/logout` | Clear JWT cookie |
| `GET` | `/api/calls` | Get call history |
| `POST` | `/api/call/ring` | Initiate call |
| `POST` | `/api/call/connect` | Connect call |
| `POST` | `/api/call/hang` | End call |
| `POST` | `/api/call/complete` | Complete call |
| `GET` | `/api/call/status/:callId` | Get call status |
| `GET` | `/api/transactions` | Get transactions |
| `GET` | `/api/contacts` | Get contacts |
| `POST` | `/api/contacts` | Add contact |
| `DELETE` | `/api/contacts/:id` | Delete contact |

---

## 🔐 Authentication

The app uses **email-based passwordless authentication**:

1. User submits email → receives 6-digit code (15 min expiry)
2. User submits code → receives JWT in HTTP-only cookie
3. All protected routes require valid JWT

**Important:** JWT is stored in HTTP-only cookies, NOT Authorization headers.

---

## 🗄️ Database

### Schema

| Table | Description |
|-------|-------------|
| `user` | User accounts (balance, email, callerId) |
| `call` | Call records (status, duration, price) |
| `rate` | Country calling rates |
| `transaction` | Financial history |
| `contact` | User contacts |

### Configuration

Set `DATABASE_PATH` environment variable:

```bash
# In-memory (default) - data lost on restart
DATABASE_PATH=:memory:

# Persistent file
DATABASE_PATH=./data/phonebooth.db
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```env
# JWT Configuration
JWT_SECRET=your-secure-secret-key

# Database
DATABASE_PATH=:memory:

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

---

## 🧪 Test Data

On startup, the server inserts test data:

**Users:**
- `user1@example.com` - Balance: $100.50 USD
- `user2@example.com` - Balance: €200.00 EUR

**Rates:**
- USA (+1): $0.05/min
- Germany (+49): $0.10/min

---

## 🛣️ Routes (Frontend)

| Path | Page | Auth Required |
|------|------|---------------|
| `/` | Rates (Landing) | No |
| `/rates` | Rates | No |
| `/auth` | Login/Register | No |
| `/dial` | Dial Pad | Yes |
| `/call/:countryCode/:calleeID` | Active Call | Yes |
| `/account` | Account & Deposit | Yes |
| `/history` | Call History | Yes |
| `/contacts` | Contact List | Yes |
| `/contacts/:id` | Contact Detail | Yes |

---

## 🔧 Development Notes

### Type Synchronization

Frontend types in `client/src/api/types.tsx` **must match** backend schema in `server/src/db/index.ts`.

### API Proxy

The Rsbuild dev server proxies `/api/*` requests to `http://localhost:8080`.

### Module System

Backend uses ES modules with `.js` extensions in imports (even for `.ts` files):

```typescript
import { db } from "./db/index.js";  // Note: .js extension
```

---

## 📝 License

MIT

---

**Last Updated:** 2025-12-02

