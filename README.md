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

# Phonebooth Workspace

A modern VoIP phone application built with React and Express, configured as a VS Code monorepo workspace for seamless full-stack development.

## Overview

This workspace contains two tightly coupled applications:
- **phonebooth/** – React 19 frontend with Tailwind CSS 4
- **phoneserver/** – Express.js REST API with SQLite database

Both projects auto-start when you open the workspace, with hot-reloading enabled for rapid development.

## Documentation System

This workspace uses a multi-tier documentation system for both developers and AI coding agents:

- **Workspace-level agent instructions:** `.github/copilot-instructions.md` (architecture, workflows, cross-project impact)
- **Project-level agent instructions:** `phonebooth/.github/copilot-instructions.md` (frontend patterns), `phoneserver/.github/copilot-instructions.md` (backend patterns)
- **TODO tracking:** `TODO.md` (root, all unfinished features and technical debt)
- **System meta:** `AGENT_SYSTEM.md` (AI agent behavior, documentation hierarchy)

**Always update all relevant documentation when making architectural changes, adding features, or completing TODOs.**

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
│   └── copilot-instructions.md    # Workspace-level agent instructions
├── phonebooth/                     # Frontend (React + Rsbuild)
│   ├── .github/copilot-instructions.md # Frontend agent instructions
│   ├── src/
│   │   ├── pages/                  # Route components
│   │   ├── components/             # Reusable UI components
│   │   └── api/                    # Type definitions & data fetching
│   └── package.json
├── phoneserver/                    # Backend (Express + SQLite)
│   ├── .github/copilot-instructions.md # Backend agent instructions
│   ├── src/
│   │   ├── endpoints/              # API routes
│   │   ├── db/                     # Database schema & migrations
│   │   └── main.ts                 # Server entry point
│   └── package.json
├── TODO.md                         # Centralized TODO tracking
├── AGENT_SYSTEM.md                 # System meta-documentation
```
