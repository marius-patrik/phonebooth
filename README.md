# Phonebooth Workspace

A modern VoIP phone application built with React and Express, configured as a VS Code monorepo workspace for seamless full-stack development.

## Overview

This workspace contains two interconnected applications:
- **phonebooth** - React 19 frontend with Tailwind CSS 4
- **phoneserver** - Express.js REST API with SQLite database

Both projects auto-start when you open the workspace, with hot-reloading enabled for rapid development.

## Quick Setup

### Automated Setup (Recommended)

**Windows (PowerShell):**
```powershell
git clone --recurse-submodules https://github.com/pastiiiiiiik/phonebooth-workspace.git
cd phonebooth-workspace
.\setup-workspace.ps1
code phonebooth.code-workspace
```

**macOS/Linux (Bash):**
```bash
git clone --recurse-submodules https://github.com/pastiiiiiiik/phonebooth-workspace.git
cd phonebooth-workspace
chmod +x setup-workspace.sh
./setup-workspace.sh
code phonebooth.code-workspace
```

### Manual Setup

1. **Clone the workspace with submodules:**
   ```bash
   git clone --recurse-submodules https://github.com/pastiiiiiiik/phonebooth-workspace.git
   cd phonebooth-workspace
   ```

2. **Install dependencies:**
   ```bash
   cd phonebooth && npm install && cd ..
   cd phoneserver && npm install && cd ..
   ```

3. **Open workspace:**
   ```bash
   code phonebooth.code-workspace
   ```

Both dev servers start automatically when the workspace opens.

## Features

- ⚡ **Auto-start dev servers** - Frontend (port 3000) and backend (port 8080) start automatically
- 🔄 **Hot reloading** - Changes reflect instantly in both projects
- 📂 **Separate Git repos** - Independent version control for frontend and backend
- 🎨 **Biome formatting** - Auto-format on save across the workspace
- 🔍 **TypeScript IntelliSense** - Full type checking and autocomplete

## Architecture

```
phonebooth-workspace/
├── .github/
│   └── copilot-instructions.md    # AI coding agent instructions
├── phonebooth/                     # Frontend (React + Rsbuild)
│   ├── src/
│   │   ├── pages/                  # Route components
│   │   ├── components/             # Reusable UI components
│   │   └── api/                    # Type definitions & data fetching
│   └── package.json
├── phoneserver/                    # Backend (Express + SQLite)
│   ├── src/
│   │   ├── endpoints/              # API routes
│   │   ├── db/                     # Database schema & migrations
│   │   └── main.ts                 # Server entry point
│   └── package.json
└── phonebooth.code-workspace       # VS Code workspace configuration
```

## Development

### Running the Apps

Both servers auto-start via VS Code tasks. If you need to run them manually:

```powershell
# Frontend (terminal 1)
cd phonebooth
npm run dev

# Backend (terminal 2)
cd phoneserver
npm run dev
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

### Making Changes

The frontend proxies all `/api/*` requests to the backend, so no CORS configuration is needed.

**When modifying features:**
1. Check both `phonebooth/` and `phoneserver/` directories
2. Keep types in sync between `phonebooth/src/api/types.tsx` and `phoneserver/src/db/index.ts`
3. Verify both terminal outputs after changes

### Git Workflow

Each project maintains its own Git repository:

```powershell
# Commit frontend changes
cd phonebooth
git add .
git commit -m "feat: update UI"
git push

# Commit backend changes
cd ../phoneserver
git add .
git commit -m "feat: add endpoint"
git push
```

## Tech Stack

### Frontend (`phonebooth/`)
- **Framework:** React 19
- **Build Tool:** Rsbuild
- **Styling:** Tailwind CSS 4
- **Routing:** Wouter
- **Data Fetching:** SWR
- **Language:** TypeScript

### Backend (`phoneserver/`)
- **Framework:** Express.js
- **Database:** SQLite (in-memory)
- **Query Builder:** Kysely
- **Auth:** JWT (HTTP-only cookies)
- **Runtime:** tsx (TypeScript execution)
- **Language:** TypeScript

## Available Routes

- `/` - Home page with pricing rates
- `/dial` - Phone number input with dial pad
- `/call/:phone` - Active call interface
- `/history` - Call history
- `/wallet` - Account balance and management
- `/transactions` - Transaction history
- `/login` - Email + code authentication

## API Endpoints

See individual project README files for detailed API documentation:
- [Frontend README](phonebooth/README.md)
- [Backend README](phoneserver/README.md)

### Authentication Code Expiry
The backend login endpoint now uses the `authCodeCreated` timestamp to enforce a 15-minute expiry window for authentication codes. Codes are not cleared after use; instead, expiry is checked on login. See backend README for details.

## Troubleshooting

**Servers won't start:**
- Run `npm install` in both `phonebooth/` and `phoneserver/`
- Check for port conflicts (3000, 8080)

**Type errors in frontend:**
- Ensure `phonebooth/src/api/types.tsx` matches backend schema in `phoneserver/src/db/index.ts`

**Database empty after restart:**
- Backend uses in-memory SQLite - data is ephemeral by design
- Test data is inserted automatically on startup

## Contributing

See `.github/copilot-instructions.md` for detailed development guidelines and conventions.

## Repositories

- **Workspace:** https://github.com/pastiiiiiiik/phonebooth-workspace
- **Frontend:** https://github.com/pastiiiiiiik/phonebooth
- **Backend:** https://github.com/pastiiiiiiik/phoneserver

## License

MIT
