
# Phone Server - Backend API

Express.js REST API for a VoIP phone application with user authentication, call tracking, and account billing.

## Overview

This is the backend API for Phonebooth, providing endpoints for user authentication, call management, balance tracking, and transaction history. It uses an in-memory SQLite database with Kysely for type-safe queries.

## Documentation System

This project uses a multi-tier documentation system for both developers and AI coding agents:

- **Backend agent instructions:** `.github/copilot-instructions.md` (patterns, conventions, Kysely usage)
- **Workspace-level agent instructions:** `../.github/copilot-instructions.md` (architecture, workflows, cross-project impact)
- **TODO tracking:** `../TODO.md` (all unfinished features and technical debt)
- **System meta:** `../AGENT_SYSTEM.md` (AI agent behavior, documentation hierarchy)

**Always update all relevant documentation when making architectural changes, adding features, or completing TODOs.**

## Tech Stack

- **Framework:** Express.js 5
- **Database:** SQLite (in-memory via better-sqlite3)
- **Query Builder:** Kysely 0.28 (type-safe SQL)
- **Authentication:** JWT (jsonwebtoken)
- **Language:** TypeScript 5.9
- **Runtime:** tsx (TypeScript execution with watch mode)
- **Code Quality:** Biome (linting & formatting)

## Development

### Prerequisites

- Node.js 18+

### Setup

```powershell
npm install
npm run dev
```

The API will be available at http://localhost:8080

### Important Notes

- **Ephemeral Database:** Uses `:memory:` SQLite - all data is lost on restart
- **Test Data:** Automatically inserted on startup (see `insertTestData()` in `src/main.ts`)
- **No tsconfig.json:** TypeScript compilation handled directly by tsx

## Project Structure

```
src/
├── main.ts                   # Server entry point, routes registration
├── tokenizer.ts              # JWT creation & validation utilities
├── authenticator.ts          # Auth middleware (currently unused)
├── db/
│   ├── index.ts              # Database instance & schema definitions
│   ├── migrator.ts           # Migration runner
│   └── migrations/
│       └── 0000-init.ts      # Initial schema migration
├── endpoints/
│   ├── login.ts              # Email + code authentication
│   ├── logout.ts             # Clear JWT cookie
│   ├── user.ts               # Get user info
│   ├── balance.ts            # Get/add balance
│   ├── calls.ts              # Get call history
│   ├── dial.ts               # Ring/pickup/hangup calls
│   ├── rates.ts              # Get country calling rates
│   └── transactions.ts       # Get transaction history
```

## Database Schema
Defined in `src/db/index.ts` using Kysely TypeScript interfaces:

```typescript
interface DatabaseSchema {
  user: {
    id: Generated<number>;
    authCode?: number;           // 6-digit login code
    authCodeCreated?: string;    // ISO timestamp for code creation
    email: string;
    callerId: number;            // Phone number
    balance: number;
    displayCurrency: string;     // $, €, etc.
    currency: string;            // USD, EUR, etc.
  };
  call: {
    id: Generated<number>;
    owner: number;               // FK to user.id
    callee: number;              // Phone number
    status: "init" | "active" | "over";
    startTime: string;           // ISO datetime
    price?: number;
    endTime?: string;            // ISO datetime
  };
  rate: {
    id: Generated<number>;
    country: string;
    code: number;                // Country calling code
    price: number;               // Price per minute
  };
  transaction: {
    id: Generated<number>;
    owner: number;               // FK to user.id
    transactionType: string;     // "Deposit", "Call", etc.
    displayCurrency: string;
    price: number;
    timestamp: string;           // ISO datetime
  };
}
```

### Migrations

Migrations are defined in `src/db/migrations/` and run automatically on startup:

```typescript
// src/db/migrations/0000-init.ts
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("email", "text", (col) => col.notNull())
    // ...
    .execute();
}
```

## API Endpoints

### Authentication

**POST /api/login/email**
```json
Request:  { "email": "user@example.com" }
Response: { "message": "Code sent" }
```
Generates a 6-digit code and stores it in `user.authCode` and sets `authCodeCreated` to the current time. The code is valid for 15 minutes from creation.

**POST /api/login/code**
```json
Request:  { "code": "123456" }
Response: { "message": "Login successful" }
```
Validates code and checks that `authCodeCreated` is within the last 15 minutes. If expired, login fails. JWT is set in HTTP-only cookie named `jwt`. Codes are not cleared after use.

**POST /api/logout**
```json
Response: { "message": "Logged out successfully" }
```
Clears the JWT cookie.

### User & Wallet

**GET /api/user**
```json
Response: {
  "id": 1,
  "email": "user@example.com",
  "callerId": 123456789,
  "balance": 100.5,
  "displayCurrency": "$",
  "currency": "USD"
}
```
Requires JWT cookie.

**GET /api/balance**
```json
Response: { "balance": 100.5 }
```
Requires JWT cookie.

**POST /api/balance**
```json
Request:  { "amount": 50 }
Response: { "balance": 150.5 }
```
Adds funds to user's balance. Requires JWT cookie.

### Calling

**GET /api/rates**
```json
Response: [
  { "id": 1, "country": "USA", "code": 1, "price": 0.05 },
  { "id": 2, "country": "Germany", "code": 49, "price": 0.1 }
]
```

**GET /api/calls**
```json
Response: [
  {
    "id": 1,
    "callee": 987654321,
    "status": "over",
    "startTime": "2023-10-01T12:00:00Z",
    "endTime": "2023-10-01T12:05:00Z",
    "price": 2.54
  }
]
```
Returns calls for authenticated user. Requires JWT cookie.

**POST /api/call/ring**
```json
Request:  { "phoneNumber": "987654321" }
Response: { "callId": 1, "status": "init" }
```
Initiates a new call in "ringing" state. Requires JWT cookie.

**POST /api/call/connect**
```json
Request:  { "callId": 1 }
Response: { "status": "active" }
```
Answers a call, changing status to "active". Requires JWT cookie.

**POST /api/call/hang**
```json
Request:  { "callId": 1 }
Response: { "status": "over", "price": 2.54 }
```
Ends a call, calculates price, and deducts from balance. Requires JWT cookie.

### Transactions

**GET /api/transactions**
```json
Response: [
  {
    "id": 1,
    "transactionType": "Deposit",
    "price": 50,
    "timestamp": "2023-10-01T10:00:00Z",
    "displayCurrency": "$"
  }
]
```
Returns transactions for authenticated user. Requires JWT cookie.

## Authentication Pattern
**Email-based authentication flow:**
1. User submits email → receives 6-digit code via email (or console if SMTP not configured). The code is stored with a creation timestamp (`authCodeCreated`).
2. User submits code → backend checks that the code is valid and was created within the last 15 minutes. If valid, user receives JWT in HTTP-only cookie. Codes are not cleared after use; expiry is enforced by timestamp.

**Extracting user from request:**
```typescript
import { getUserIdFromToken } from "../tokenizer.js";

const userId = getUserIdFromToken(req.cookies.jwt);
```

**Email Configuration:**
The app uses Nodemailer to send authentication codes. Configure SMTP in `.env`:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=Phonebooth <noreply@phonebooth.app>
```

Without SMTP config, codes are logged to the server console (useful for development).

**Note:** `src/authenticator.ts` exists but is **not used**. Endpoints manually validate JWT cookies.

## Query Pattern

Always use Kysely query builder (never raw SQL):

```typescript
import { db } from "../db/index.js";

// Select
const user = await db
  .selectFrom("user")
  .selectAll()
  .where("id", "=", userId)
  .executeTakeFirst();

// Insert
await db
  .insertInto("transaction")
  .values({
    owner: userId,
    transactionType: "Deposit",
    price: amount,
    timestamp: new Date().toISOString(),
  })
  .execute();

// Update
await db
  .updateTable("user")
  .set({ balance: newBalance })
  .where("id", "=", userId)
  .execute();
```

## Module System

This project uses ES modules (`"type": "module"` in `package.json`):

- **Import with `.js` extensions** even for `.ts` files:
  ```typescript
  import { db } from "../db/index.js";
  import { getUserIdFromToken } from "../tokenizer.js";
  ```

- **Top-level await** is supported:
  ```typescript
  await migrateToLatest();
  ```

## Adding New Features

### New Endpoint

1. Create file in `src/endpoints/<name>.ts`:
   ```typescript
   import express from "express";
   import { db } from "../db/index.js";
   
   const router = express.Router();
   
   router.get("/api/<name>", async (req, res) => {
     try {
       const data = await db.selectFrom("<table>").selectAll().execute();
       res.json(data);
     } catch (error) {
       res.status(500).json({ error: "Server error" });
     }
   });
   
   export { router as <name>Router };
   ```

2. Register in `src/main.ts`:
   ```typescript
   import { <name>Router } from "./endpoints/<name>.js";
   app.use(<name>Router);
   ```

3. **Update frontend types** in `../phonebooth/src/api/types.tsx` to match response shape.

### New Database Table

1. Add interface to `DatabaseSchema` in `src/db/index.ts`
2. Create numbered migration in `src/db/migrations/`
3. Register migration in `src/db/migrator.ts`
4. Add test data in `insertTestData()` in `src/main.ts`
5. Update frontend types if table is exposed via API

## Test Data

Two test users are created on startup:

```typescript
{
  id: 1,
  email: "user1@example.com",
  callerId: 123456789,
  balance: 100.5,
  currency: "USD"
}

{
  id: 2,
  email: "user2@example.com",
  callerId: 987654321,
  balance: 200.0,
  currency: "EUR"
}
```

Login with either email to receive a 6-digit code in the console output.

## Common Pitfalls

1. **Database is ephemeral** - All data is lost on restart (by design)
2. **JWT secret is hardcoded** - `"your-secure-secret-key"` (not production-ready)
3. **No auth middleware** - Endpoints manually check `req.cookies.jwt`
4. **Import extensions** - Must use `.js` extensions in imports despite writing `.ts`
5. **User ownership** - Most endpoints filter by `owner` column using `getUserIdFromToken()`

## Type Synchronization

**Critical:** Response types must match frontend expectations.

```typescript
// Backend: src/db/index.ts
user: {
  id: Generated<number>;
  balance: number;
}

// Frontend: ../phonebooth/src/api/types.tsx
export interface UserItem {
  id: string;        // Note: Frontend expects string
  balance: number;
}
```

Type conversion happens in endpoint handlers before sending responses.

## Troubleshooting

**Port already in use:**
```powershell
# Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

**Database errors:**
- Check migrations ran successfully (console output on startup)
- Verify table exists in schema (`src/db/index.ts`)
- Ensure Kysely query uses correct table/column names

**JWT errors:**
- Check `req.cookies.jwt` exists
- Verify JWT secret matches between `tokenizer.ts` and `login.ts`
- Use `/api/login/email` → `/api/login/code` flow to authenticate

## Related Projects

- [Frontend (phonebooth)](../phonebooth/) - React UI application
- [Workspace](../) - Monorepo configuration

## Repository

https://github.com/pastiiiiiiik/phoneserver

## License

MIT
