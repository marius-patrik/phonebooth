# AGENT_SYSTEM.md

# AI Agent System Architecture

## 📋 Overview

This document describes the **multi-project, multi-agent documentation and workflow system** used in this workspace. This system is designed to guide AI coding agents through complex monorepo architectures with multiple interdependent projects, ensuring consistency, quality, and proper knowledge management.

**Purpose:** This architecture can be replicated in any multi-project workspace (e.g., e-commerce with backend/frontend/admin, microservices, full-stack apps) to create a self-aware, self-documenting, AI-friendly development environment.

## 🏗️ System Components

### 1. **Documentation Hierarchy** (3-Tier Structure)

#### Tier 1: README Files (Developer Quick Reference)
**Purpose:** Human-readable setup guides, API docs, tech stack overviews

**Files:**
- `README.md` (workspace root) - High-level architecture, quick setup, all projects overview
- `<project>/README.md` (per project) - Project-specific setup, API endpoints, tech stack

**Content:**
- Installation and setup instructions
- Tech stack lists with versions
- API endpoint documentation with request/response examples
- Database schema definitions
- Development commands and workflows
- Troubleshooting guides

**Update Trigger:** Architecture changes, dependency updates, new features, API changes

#### Tier 2: Copilot Instructions (AI Agent Guidance)
**Purpose:** Detailed implementation patterns, workflows, conventions for AI agents

**Files:**
- `.github/copilot-instructions.md` (workspace root) - Cross-project workflows, monorepo architecture
- `<project>/.github/copilot-instructions.md` (per project) - Project-specific patterns, conventions

**Content:**
- Development workflow checklists (BEFORE/WHILE/AFTER coding)
- Cross-project impact warnings
- Code patterns with examples from actual codebase
- Architectural change detection protocols
- Integration points and data flow documentation
- Common pitfalls specific to this codebase
- File organization conventions

**Update Trigger:** Pattern changes, architectural decisions, new conventions, framework migrations

**Key Principle:** Instructions cascade - agents working in a project folder receive BOTH workspace-level AND project-level instructions.

#### Tier 3: TODO Tracking (Active Task Management)
**Purpose:** Centralized tracking of incomplete features, technical debt, temporary solutions

**Files:**
- `TODO.md` (workspace root) - All projects' unfinished work in one place

**Content:**
- Known unfinished features with file paths and line numbers
- Technical debt items with priority levels (Critical/High/Medium/Low)
- Code snippets showing temporary implementations
- Impact descriptions and remediation plans
- Completion tracking (move to "Completed Items" section when done)

**Update Trigger:** AI agents actively maintain this file during development (see Agent Behaviors below)

### 2. **Git Structure** (Multiple Repositories)

**Pattern:** Each project folder is a **separate Git repository**

```
phonebooth-workspace/           # Main Git repo (workspace files)
├── .git/                       # Workspace repo
├── .gitmodules                 # Submodule configuration (if using submodules)
├── .github/
│   └── copilot-instructions.md # Workspace-level agent instructions
├── README.md                   # Workspace overview
├── TODO.md                     # Centralized TODO tracking
├── AGENT_SYSTEM.md             # This file - system documentation
├── setup-workspace.ps1         # Windows setup script
├── setup-workspace.sh          # macOS/Linux setup script
├── phonebooth-workspace.code-workspace  # VS Code workspace config
├── phonebooth/                 # Separate Git repository OR submodule
│   ├── .git/
│   ├── .github/
│   │   └── copilot-instructions.md
│   ├── README.md
│   └── package.json
└── phoneserver/                # Separate Git repository OR submodule
    ├── .git/
    ├── .github/
    │   └── copilot-instructions.md
    ├── README.md
    └── package.json
```

**Two Approaches:**

**A. Git Submodules (Recommended for single-person or small teams):**
- Workspace repo contains submodule references to project repos
- One `git clone --recurse-submodules` gets everything
- Projects can still be developed independently

```bash
# Setup on main machine
cd phonebooth-workspace
git submodule add <phonebooth-url> phonebooth
git submodule add <phoneserver-url> phoneserver
git commit -m "Add submodules"
git push

# Clone on new machine
git clone --recurse-submodules <workspace-url>
cd phonebooth-workspace
# All projects are cloned automatically

# OR use setup script
./setup-workspace.sh
```

**B. Separate Repos (Better for teams or complex workflows):**
- Each repo is completely independent
- Clone each repo manually into workspace folder
- More flexible for different access controls

```bash
# Setup on new machine
git clone <workspace-docs-url> phonebooth-workspace
cd phonebooth-workspace
git clone <phonebooth-url> phonebooth
git clone <phoneserver-url> phoneserver

# OR use setup script
./setup-workspace.sh
```

**Why Multiple Repos:**
- Independent version control per project
- Separate commit histories
- Can deploy/release independently
- Different teams can own different repos
- Projects can be used in other workspaces

**Coordination:** Workspace-level documentation (README.md, AGENT_SYSTEM.md, TODO.md) coordinates changes across repos

### 3. **Node.js Structure** (Independent Package Management)

**Pattern:** Each project has its own `package.json` and `node_modules/`

**Why:**
- Projects can use different framework versions
- No dependency conflicts between projects
- Can upgrade one project's dependencies without affecting others
- Clear separation of concerns

**Installation:**
```powershell
cd phonebooth; npm install
cd phoneserver; npm install
```

### 4. **VS Code Workspace** (Unified Development Environment)

**File:** `phonebooth-workspace.code-workspace` (workspace root)

**Features:**
- **Multi-root workspace** - opens multiple project folders simultaneously
- **Workspace tasks** - auto-start both dev servers on workspace open
- **Shared settings** - Biome formatter, recommended extensions
- **Terminal panels** - separate terminals per project (Frontend Dev, Backend Dev)

**Example workspace configuration:**
```json
{
  "folders": [
    { "path": "." },
    { "path": "phonebooth" },
    { "path": "phoneserver" }
  ],
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Frontend Dev",
        "type": "shell",
        "command": "npm run dev",
        "options": { "cwd": "phonebooth" },
        "isBackground": true,
        "runOptions": { "runOn": "folderOpen" }
      },
      {
        "label": "Backend Dev",
        "type": "shell",
        "command": "npm run dev",
        "options": { "cwd": "phoneserver" },
        "isBackground": true,
        "runOptions": { "runOn": "folderOpen" }
      }
    ]
  }
}
```

**Benefit:** One-click workspace open → both servers auto-start → full-stack development ready

### 5. **AI Agent System** (Self-Aware Documentation)

**Core Principle:** AI agents are **aware of the documentation hierarchy** and **actively maintain it**

**How Agents Receive Instructions:**
- Working at workspace root → receives `.github/copilot-instructions.md` (workspace-level only)
- Working in `phonebooth/` → receives workspace-level + `phonebooth/.github/copilot-instructions.md`
- Working in `phoneserver/` → receives workspace-level + `phoneserver/.github/copilot-instructions.md`

**System Self-Awareness:**
This file (`AGENT_SYSTEM.md`) is referenced in all copilot-instructions.md files, creating a self-documenting loop where:
1. Agents read instruction files
2. Instruction files reference this system architecture document
3. This document explains how the instruction files work
4. Agents understand the meta-structure and can help maintain it

## 🤖 AI Agent Behaviors

### Behavior 1: Documentation Hierarchy Awareness

**Trigger:** Agent is activated in any workspace folder

**Action:**
1. Identify current working directory (workspace root vs. project subfolder)
2. Load appropriate instruction files (workspace + project-specific if applicable)
3. Reference README files for quick facts (API endpoints, schema, commands)
4. Check `TODO.md` for known issues in the area being modified

**Example:**
```
Agent working in: phoneserver/src/endpoints/
Loads: .github/copilot-instructions.md + phoneserver/.github/copilot-instructions.md
References: phoneserver/README.md for endpoint list
Checks: TODO.md for backend-related unfinished features
```

### Behavior 2: Cross-Project Impact Detection

**Trigger:** Agent is asked to make changes to database schema, API contracts, authentication, build config, or frameworks

**Action:**
1. **Pause before implementation**
2. **Alert user** with architectural change warning
3. **List affected documentation files:**
   - Which README files need updates (with specific sections)
   - Which instruction files need updates (workspace + project-level)
   - Which sibling project files might need updates (types, endpoints)
4. **Request confirmation** before proceeding

**Warning Template:**
```markdown
⚠️ ARCHITECTURAL CHANGE DETECTED

The change you requested modifies [database schema / API contract / etc.].

Please update the following documentation after this change:

README files:
- [ ] README.md - [Architecture section]
- [ ] phonebooth/README.md - [Type Definitions section]
- [ ] phoneserver/README.md - [Database Schema section]

Instruction files:
- [ ] .github/copilot-instructions.md - [Available API Endpoints]
- [ ] phonebooth/.github/copilot-instructions.md - [Type Sync section]
- [ ] phoneserver/.github/copilot-instructions.md - [Database Pattern]

Proceed with implementation? (Please confirm)
```

### Behavior 3: TODO List Active Maintenance

**Trigger Conditions:**

#### A. When implementing incomplete/temporary features
**Action:**
1. Add entry to `TODO.md` under appropriate project section
2. Include: file path, line number, issue description, impact, remediation steps, priority, date
3. Format with emoji icon for visual categorization
4. Notify user that TODO was added

**Example Entry:**
```markdown
#### ⚠️ Hardcoded Billing Rate
**File:** `phoneserver/src/endpoints/dial.ts` (line 9)
**Issue:** Billing uses hardcoded rate of 0.01 per minute
**Impact:** All calls charged at same rate regardless of destination
**TODO:** Extract country code from phone number, query rate table
**Priority:** High - affects billing accuracy
**Added:** 2025-11-24
```

#### B. When encountering TODO comments in code
**Action:**
1. Check if the TODO is documented in `TODO.md`
2. If **not documented:**
   - Alert user: "Found undocumented TODO in `<file>` at line `<X>`"
   - Offer to add it to `TODO.md`
3. If **already documented:**
   - Continue with current task
4. If **TODO is completed** (code works, no issues):
   - Alert user: "TODO at `<file>:<line>` appears complete"
   - Offer to remove from both code and `TODO.md`

#### C. When user says "add to TODO" or "add to todo list"
**Action:**
1. Determine which project section (Backend/Frontend/Other)
2. Create formatted TODO entry with:
   - Descriptive title with emoji
   - File path (if applicable)
   - Issue description
   - Impact assessment
   - TODO implementation steps
   - Priority level (Critical/High/Medium/Low)
   - Date added
3. Add to `TODO.md`
4. Confirm to user with brief summary

#### D. When completing TODO items
**Action:**
1. Move entry from "Known Unfinished Features" to "Completed Items" section
2. Add completion date
3. Remove related TODO comments from code
4. Verify related files are updated (if schema/API changed)

**Priority Levels:**
- **Critical** - Security vulnerabilities, data loss risks, authentication issues
- **High** - Required for production deployment, core functionality broken
- **Medium** - Important but not blocking, UX issues, missing features
- **Low** - Nice to have, cleanup, refactoring, optimization

### Behavior 4: Development Workflow Enforcement

**Implemented via checklists in copilot-instructions.md files**

#### BEFORE Making Code Changes
**Agent must:**
- ✅ Search both/all project directories for related code
- ✅ Verify assumptions (check if endpoint/type/component exists)
- ✅ Check type compatibility across projects
- ✅ Identify cross-project impact

#### WHILE Coding
**Agent must:**
- ⚠️ Not assume endpoints exist - verify first
- ⚠️ Not break type contracts - match backend schema exactly
- ⚠️ Follow existing patterns from codebase
- ⚠️ Document incomplete implementations in `TODO.md`

#### AFTER Making Changes
**Agent must:**
- ✅ Check both/all project terminal outputs for errors
- ✅ Verify type synchronization across projects
- ✅ Update related TODO items if applicable
- ✅ Test end-to-end if cross-project changes were made

### Behavior 5: Type Synchronization Awareness

**Pattern:** Frontend types must match backend database schema

**Files to Monitor:**
- **Backend:** `phoneserver/src/db/index.ts` (DatabaseSchema interface)
- **Frontend:** `phonebooth/src/api/types.tsx` (API response types)

**Agent Actions:**
1. **When backend schema changes:**
   - Alert user to update frontend types
   - Show exact mapping between schema and frontend types
   - Update `TODO.md` if change is incomplete

2. **When adding new endpoint:**
   - Check if frontend types exist for response shape
   - If not, add to `TODO.md` as high priority
   - Verify response matches what frontend expects

3. **When debugging type errors:**
   - Compare both files side-by-side
   - Identify mismatches (string vs number, missing fields, etc.)
   - Suggest corrections on both sides

### Behavior 6: Pattern Recognition and Replication

**Trigger:** Agent needs to create new endpoint, page, component, migration, etc.

**Action:**
1. Search codebase for similar existing implementations
2. Use `grep_search` or `semantic_search` to find patterns
3. Replicate the established pattern (file naming, export style, structure)
4. Reference pattern source in code comments if non-obvious

**Examples:**
- New backend endpoint → copy pattern from `src/endpoints/login.ts`
- New frontend page → copy pattern from `src/pages/dial.tsx`
- New database migration → copy pattern from `src/db/migrations/0000-init.ts`

## 🔄 System Replication Guide

**To recreate this system in a new multi-project workspace:**

### Step 1: Create Workspace Structure
```
my-workspace/
├── .github/
│   └── copilot-instructions.md
├── README.md
├── TODO.md
├── AGENT_SYSTEM.md
├── my-workspace.code-workspace
├── project1/
│   ├── .git/
│   ├── .github/
│   │   └── copilot-instructions.md
│   ├── README.md
│   └── package.json
└── project2/
    ├── .git/
    ├── .github/
    │   └── copilot-instructions.md
    ├── README.md
    └── package.json
```

### Step 2: Initialize Git Repositories

**Option A: Using Git Submodules**
```powershell
# In workspace root
git init
git add .
git commit -m "Initial workspace setup"

# Add project repos as submodules
cd project1; git init; git add .; git commit -m "Initial commit"; cd ..
cd project2; git init; git add .; git commit -m "Initial commit"; cd ..

# Create remotes for projects (on GitHub/GitLab)
# Then add as submodules
git submodule add <project1-remote-url> project1
git submodule add <project2-remote-url> project2
git commit -m "Add project submodules"
```

**Option B: Separate Repos**
```powershell
# In workspace root (optional - for coordination files only)
git init
git add README.md TODO.md AGENT_SYSTEM.md .github/ *.code-workspace setup-*
git commit -m "Workspace coordination files"

# Each project independently
cd project1; git init; git add .; git commit -m "Initial commit"
cd project2; git init; git add .; git commit -m "Initial commit"
```

### Step 3: Create VS Code Workspace File
```json
{
  "folders": [
    { "path": "." },
    { "path": "project1" },
    { "path": "project2" }
  ],
  "tasks": {
    "version": "2.0.0",
    "tasks": [
      {
        "label": "Project1 Dev",
        "type": "shell",
        "command": "npm run dev",
        "options": { "cwd": "project1" },
        "isBackground": true,
        "runOptions": { "runOn": "folderOpen" }
      },
      {
        "label": "Project2 Dev",
        "type": "shell",
        "command": "npm run dev",
        "options": { "cwd": "project2" },
        "isBackground": true,
        "runOptions": { "runOn": "folderOpen" }
      }
    ]
  }
}
```

### Step 4: Write Documentation Hierarchy

**Workspace README.md:**
- Overall architecture (how projects relate)
- Quick setup for all projects
- Common commands
- Integration points between projects

**Project README.md (each project):**
- Tech stack with versions
- API documentation (if backend)
- Component patterns (if frontend)
- Database schema (if has database)
- Development and testing commands

**Workspace .github/copilot-instructions.md:**
- Cross-project workflows
- Data flow between projects
- Shared conventions (Git, formatting, etc.)
- Common pitfalls
- Available API endpoints across all projects
- TODO list management protocol (copy from this workspace)

**Project .github/copilot-instructions.md:**
- Project-specific patterns with code examples
- File organization conventions
- Development workflow checklists (BEFORE/WHILE/AFTER)
- Architectural change detection rules
- Type synchronization requirements
- Debugging tips specific to this project
- TODO management for this project

### Step 5: Create TODO.md Template
```markdown
# [Workspace Name] - TODO List

## 🚧 Known Unfinished Features & Technical Debt

### Backend (project-name/)
#### 📝 No items yet

### Frontend (project-name/)
#### 📝 No items yet

---

## ✅ Completed Items

---

## 📋 How to Use This File

**For Developers:**
- Review before starting work
- Update priorities as needed
- Move completed items with date

**For AI Agents:**
- Add entries when creating temporary implementations
- Alert user for undocumented TODOs
- Suggest removal when TODOs are completed
- See workspace `.github/copilot-instructions.md` for full protocol
```

### Step 6: Document the System Itself

**Copy this file (`AGENT_SYSTEM.md`) to new workspace and customize:**
- Update project names
- Update file paths in examples
- Add project-specific integration points
- Document any custom agent behaviors

### Step 7: Make Agents Self-Aware

**In workspace `.github/copilot-instructions.md`**, add:
```markdown
## 📚 Documentation Hierarchy

**This workspace uses a multi-tier documentation system:**

1. **README files** - Quick reference (see README.md, project1/README.md, project2/README.md)
2. **Instruction files** - AI agent guidance (this file + project-specific instructions)
3. **TODO tracking** - Active task management (TODO.md)
4. **System architecture** - Meta-documentation (AGENT_SYSTEM.md)

**IMPORTANT:** Read `AGENT_SYSTEM.md` to understand how this documentation system works
and your role in maintaining it as an AI agent.
```

### Step 8: Reference in All Project Instructions

**In each project's `.github/copilot-instructions.md`**, add:
```markdown
**How to use these resources:**
- For quick reference: Check README.md
- For this project's patterns: Follow this file
- For cross-project workflows: Consult `../.github/copilot-instructions.md`
- For unfinished features: Check `../TODO.md`
- **For system architecture:** Read `../AGENT_SYSTEM.md` to understand the documentation hierarchy
```

## 🎯 Benefits of This System

### For Developers
- **Consistency** - Patterns documented and enforced
- **Onboarding** - New developers have clear reference docs
- **Context** - All unfinished work tracked in one place
- **Productivity** - AI agents handle boilerplate and follow conventions

### For AI Agents
- **Context Awareness** - Know which project, what patterns, what's incomplete
- **Guidance** - Clear instructions on when to alert, when to document, when to pause
- **Self-Maintenance** - Keep documentation up-to-date as code evolves
- **Cross-Project Intelligence** - Understand how changes ripple across projects

### For Projects
- **Scalability** - Add new projects with same documentation structure
- **Maintainability** - Technical debt explicitly tracked and prioritized
- **Quality** - Architectural changes trigger review prompts
- **Knowledge Preservation** - Patterns and decisions documented in context

## 🔍 System Self-Awareness

**This document you are reading (`AGENT_SYSTEM.md`) is part of the system it describes.**

When an AI agent reads the instruction files (`.github/copilot-instructions.md`), those files reference this document. This creates a self-aware loop:

1. **Agent loads instructions** → Sees reference to `AGENT_SYSTEM.md`
2. **Agent reads this file** → Understands the documentation hierarchy
3. **Agent follows behaviors** → Maintains TODOs, alerts on changes, syncs types
4. **Agent updates docs** → Keeps system self-documenting

**Meta-Behavior:** If an AI agent is asked to modify the agent system itself (add new behaviors, change TODO format, etc.), the agent should:
1. Update `AGENT_SYSTEM.md` with new behavior documentation
2. Update all three `.github/copilot-instructions.md` files with new patterns
3. Update `TODO.md` template if format changed
4. Alert user to review changes for consistency

## 📝 Version History

**v1.0 - 2025-11-24**
- Initial system architecture documentation
- 3-tier documentation hierarchy established
- 6 core agent behaviors defined
- TODO list management protocol implemented
- Self-awareness loop created via AGENT_SYSTEM.md

---

**Last Updated:** 2025-11-24  
**System Status:** Active and self-maintaining  
**Maintained By:** AI agents following documented behaviors + human developers

---

# TODO.md

# Phonebooth Workspace - TODO List

## 🚧 Known Unfinished Features & Technical Debt

### Backend (phoneserver/)

#### 🕒 Replace Billing Timer With Job Queue
**File:** `src/services/billing-manager.ts` (line 10)
**Issue:** Billing manager uses in-memory setInterval for periodic billing checks
**Impact:** Not scalable for production; risk of missed billing events on server restart or crash
**TODO:** Replace global timer with a persistent job queue (Bull, BullMQ, AWS SQS, etc.) for reliable billing event processing
**Priority:** High (production readiness)
**Added:** 2025-11-25

---

## ✅ Completed Items

#### ⚠️ Handle Call Canceled During Connecting
**Solution:** Added `connectTimeoutRef` to track pending connection timeout. Cleanup function in useEffect clears timeout on unmount. `endCall()` now cancels pending connection if called during ringing state, preventing race condition where setTimeout would still execute after cancellation.
**Files Modified:**
- `phonebooth/src/pages/call.tsx` - Added timeout ref, cleanup, and cancellation handling

#### 🔒 Hardcoded JWT Secret (Critical)
**Solution:** Created `phoneserver/src/config.ts` to load JWT secret from `.env` file. Updated all files using JWT to import from config. Added `.env.example` template and updated `.gitignore`.
**Files Modified:** 
- `phoneserver/src/config.ts` (created)
- `phoneserver/.env` (created)
- `phoneserver/.env.example` (created)
- `phoneserver/src/endpoints/login.ts`
- `phoneserver/src/authenticator.ts`
- `phoneserver/.gitignore`

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

**Documentation System:**
- **Workspace-level agent instructions:** `.github/copilot-instructions.md`
- **Project-level agent instructions:** `phonebooth/.github/copilot-instructions.md`, `phoneserver/.github/copilot-instructions.md`
- **README files:** `README.md`, `phonebooth/README.md`, `phoneserver/README.md`
- **System meta:** `AGENT_SYSTEM.md`

**Priority Levels:**
- **Critical** - Security issues, data loss risks
- **High** - Required for production, affects core functionality
- **Medium** - Important but not blocking
- **Low** - Nice to have, cleanup, refactoring

---

# .github/copilot-instructions.md


# Phonebooth Workspace – AI Coding Agent Instructions

## Documentation Hierarchy

- **Workspace-level agent instructions:** This file (`.github/copilot-instructions.md`) – architecture, workflows, cross-project impact
- **Project-level agent instructions:** `phonebooth/.github/copilot-instructions.md`, `phoneserver/.github/copilot-instructions.md`
- **TODO tracking:** `TODO.md` (root, all unfinished features and technical debt)
- **README files:** `README.md`, `phonebooth/README.md`, `phoneserver/README.md`
- **System meta:** `AGENT_SYSTEM.md` (AI agent behavior, documentation system)

**Always update all relevant documentation when making architectural changes, adding features, or completing TODOs.**

## Big Picture Architecture

- **Monorepo:** Two tightly coupled apps:
   - `phonebooth/` – React 19 frontend (port 3000)
   - `phoneserver/` – Express.js REST API (port 8080, in-memory SQLite)
- **Data flow:** Frontend SWR → API endpoint → Kysely query → Database → JSON response
- **Type sync:** Frontend types (`src/api/types.tsx`) must match backend DB schema (`src/db/index.ts`)
- **Separate Git repos:** Commit/push independently per project

## Critical Developer Workflows

- **Auto-start dev servers:** Both start via VS Code tasks (`npm run dev` in each project)
- **Verify changes:** Check both "Frontend Dev" and "Backend Dev" terminals for errors after edits
- **Biome formatting:** Auto-format on save (not ESLint/Prettier)
- **Proxy:** Frontend API calls to `/api/*` route to backend (no CORS needed)
- **Ephemeral DB:** Backend data lost on restart; test data auto-inserted on startup

## Project-Specific Patterns

- **Frontend:**
   - All API calls use SWR + shared `fetcher` (`src/api/fetcher.tsx`)
   - Pages/components wrap content in `<Body>` (`src/components/body/body.tsx`)
   - React imported as lowercase (`import react from "react"`)
   - State-driven UI (see `src/pages/call.tsx` for call lifecycle)
   - Types centralized in `src/api/types.tsx`
- **Backend:**
   - Endpoints in `src/endpoints/`, always filter by `owner` (user isolation)
   - Manual JWT validation via `req.cookies.jwt` (no centralized middleware)
   - Kysely for all DB queries (never raw SQL)
   - ES modules: import with `.js` extension even for `.ts` files
   - No `tsconfig.json` (tsx handles compilation)

## Integration Points

- **API endpoints:** See list in this file; most require JWT in cookies and filter by user
- **Adding features:** Always update both frontend and backend, sync types, and test end-to-end
- **TODO management:** Update `TODO.md` for all unfinished features, code comments, and technical debt

## Common Pitfalls

- Backend DB is ephemeral (data lost on restart)
- JWT secret is hardcoded (not production-ready)
- No centralized auth middleware (manual checks)
- Import extensions required for backend
- Proxy config is automatic (Rsbuild)

## Example: Adding a New Feature

1. **Backend:** Create endpoint in `src/endpoints/`, update DB schema/types if needed, register router in `src/main.ts`
2. **Frontend:** Add types to `src/api/types.tsx`, create SWR-based component/page, update routes
3. **Test:** Check both dev terminals, verify API flow in browser
4. **Document:** Update `TODO.md` if incomplete, sync documentation if architecture changes

4. **System architecture** (`AGENT_SYSTEM.md` in workspace root):
   - Meta-documentation explaining how this documentation system works
   - AI agent behavior specifications and workflows
   - System replication guide for creating similar setups in other projects
   - **IMPORTANT:** Read this file to understand your role as an AI agent in maintaining this system

**How AI agents receive instructions:**
- Working at workspace root → This file only
- Working in `phonebooth/` → This file + `phonebooth/.github/copilot-instructions.md`
- Working in `phoneserver/` → This file + `phoneserver/.github/copilot-instructions.md`

**Quick reference:** For setup, tech stack overview, and API documentation, check the README files. For implementation patterns and workflows, use these instruction files.

## ⚠️ Critical Development Reminders

**Problem-First Workflow:**
- ⚠️ **CRITICAL**: When tackling ANY problem or request, FIRST prompt the user with:
  1. Your understanding of the problem
  2. Your proposed solution/action plan
  3. Wait for user confirmation before implementing
- This applies to bug fixes, feature requests, refactoring, and architectural changes
- Only skip confirmation for trivial tasks (simple reads, formatting, typo fixes)

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

**⚠️ CROSS-FILE UPDATE RESPONSIBILITY:**
When you modify ANY of these files, you MUST alert the user to update related documentation:
- **Changing instruction files** → Alert to update corresponding README sections
- **Changing README files** → Alert to update corresponding instruction examples
- **Adding TODO comments** → MUST update `TODO.md`
- **Completing TODOs** → MUST update `TODO.md` and remove code comments
- **Architectural changes** → Update ALL THREE instruction files + relevant READMEs + `TODO.md` if incomplete

## 🚨 Architectural Change Protocol

**BEFORE making any of these changes, ALERT THE USER to update instruction files:**

1. **Database schema changes:**
   - Adding/removing/renaming tables or columns
   - Changing primary keys, foreign keys, or constraints
   - Modifying data types or nullable fields
   - Impact: Update `DatabaseSchema` docs in backend instructions + frontend type sync
   - **README impact:** `phoneserver/README.md` - Database Schema section
   - **Authentication code expiry:** If the user table changes for authentication code expiry (e.g., adding `authCodeCreated`), update all documentation and instructions to reflect expiry logic and removal of code clearing.

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
Every page wraps content in `<Body>` from `src/components/body/body.tsx`:
```tsx
import Body from "../components/body/body";

const MyPage: react.FC = () => (
  <Body>
    {/* Page content - responsive header/footer auto-included */}
  </Body>
);
```

**Component Organization:**
- `src/components/*.tsx` - Most route/page components (contacts, history, rates, transactions, etc.)
- `src/pages/call.tsx` - Only one page component in pages/ (call interface)
- `src/components/body/` - Layout primitives (header, footer, body)
- `src/components/[feature]/` - Feature-specific UI (call, dial, user, cards)
- `src/components/display/` - Reusable UI elements (box-field, grid-item, separator)
- `src/components/display/input/` - Interactive components (buttons, links)
- `src/components/display/text/` - Typography (title, description)

**TypeScript Style:**
- Import React as lowercase: `import react from "react"`
- Type components as `react.FC` or `react.FC<PropsWithChildren<Props>>`
- Default exports for all components
- Centralized types in `src/api/types.tsx`

**Common Pattern - State-Driven UI:**
See `phonebooth/src/pages/call.tsx` for real implementation:
```tsx
// State machine approach for call lifecycle
const [callState, setCallState] = useState<"ringing" | "active" | "ended">("ringing");
const [callId, setCallId] = useState<number | null>(null);

// Effect 1: Initiate call on mount
useEffect(() => {
  fetcher("/api/call/ring", { method: "POST", ... })
    .then(res => {
      setCallId(res.callId);
      setTimeout(() => setCallState("active"), 2000); // Transition to active
    });
}, []);

// Effect 2: Start timer when state changes to "active"
useEffect(() => {
  if (callState !== "active") return;
  const timer = setInterval(() => setTime(v => v + 1), 1000);
  return () => clearInterval(timer); // Cleanup on unmount or state change
}, [callState]);
```
**Key principles:**
- UI renders different components based on state (ringing → `RingComp`, active → `CallActive`, ended → `PostCallComp`)
- API calls triggered by state transitions via `useEffect`
- Timers/intervals tied to specific states and cleaned up properly

## Backend (phoneserver/)

**Tech Stack:** Express.js, better-sqlite3 (in-memory), Kysely (query builder), JWT cookies

**Authentication Flow:**
1. POST `/api/login/email` with `{ email }` → generates 6-digit code, sets `authCodeCreated` to current time (code valid for 15 minutes)
2. POST `/api/login/code` with `{ code }` → checks code and expiry (15 min window), returns JWT in HTTP-only cookie named `jwt` (code is not cleared)
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
See `phoneserver/src/endpoints/dial.ts` for complete example:
```typescript
// 1. Create src/endpoints/<name>.ts
import express from "express";
import { getUserIdFromToken } from "../tokenizer.js";
const router = express.Router();
const { db } = await import("../db/index.js");

// 2. Define endpoint with JWT extraction
router.post("/api/call/hang", async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.cookies.jwt);
    const { callId } = req.body;
    
    // 3. Filter by owner column
    const call = await db
      .selectFrom("call")
      .selectAll()
      .where("id", "=", callId)
      .where("owner", "=", userId)  // Critical: user isolation
      .executeTakeFirst();
    
    // Business logic...
    res.json({ durationSeconds, cost });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 4. Export as named router
export { router as dialRouter };
```

**Then in `src/main.ts`:**
```typescript
import { dialRouter } from "./endpoints/dial.js";
app.use(dialRouter);
```

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

**⚠️ CRITICAL: Always update TODO.md when:**
- Adding TODO comments to code
- Implementing temporary/incomplete features
- Completing existing TODO items
- Discovering undocumented technical debt

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
- `POST /api/login/email` - Send email, generate 6-digit code, set `authCodeCreated` (code valid for 15 minutes)
- `POST /api/login/code` - Validate code, check expiry (15 min window), set JWT cookie (no code clearing)
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

**Contacts:**
- `GET /api/contacts` - Get user's contact list
- `POST /api/contacts` - Add new contact with `{ name, phoneNumber }`
- `DELETE /api/contacts/:id` - Delete contact by ID

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
1. Create `src/components/<name>-page.tsx` with `<Body>` wrapper (or `src/pages/<name>.tsx` for complex pages)
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

---

# phonebooth/.github/copilot-instructions.md


# Phonebooth - AI Coding Instructions

## Documentation Hierarchy

You are receiving instructions from multiple sources:

- **Frontend agent instructions:** This file (`.github/copilot-instructions.md`) – patterns, conventions, SWR usage
- **Workspace-level agent instructions:** `../.github/copilot-instructions.md` – architecture, workflows, cross-project impact
- **Backend agent instructions:** `../phoneserver/.github/copilot-instructions.md` – backend API, database schema
- **TODO tracking:** `../TODO.md` – all unfinished features and technical debt
- **System meta:** `../AGENT_SYSTEM.md` – AI agent behavior, documentation hierarchy

**Always update all relevant documentation when making architectural changes, adding features, or completing TODOs.**

## Problem-First Workflow

CRITICAL: Always prompt before implementing:
- When tackling ANY problem or request, FIRST prompt the user with:
  1. Your understanding of the problem
  2. Your proposed solution/action plan
  3. Wait for user confirmation before implementing
- This applies to bug fixes, feature requests, refactoring, and architectural changes
- Only skip confirmation for trivial tasks (simple reads, formatting, typo fixes)

## Monorepo Context

This is the FRONTEND project in a monorepo workspace. The complete application requires both:
- **phonebooth/** (this project) – React frontend on port 3000
- **phoneserver/** (sibling project) – Express API on port 8080

Critical for AI agents:
- Changes here often require corresponding backend updates in `../phoneserver/`
- Types in `src/api/types.tsx` must match backend `DatabaseSchema` in `../phoneserver/src/db/index.ts`
- When adding features, check if backend endpoint exists in `../phoneserver/src/endpoints/`
- Both servers auto-start via workspace tasks – verify both terminals after changes

Data flow: This frontend → Rsbuild proxy → `../phoneserver/` → SQLite → JSON response

## Development Workflow Checklist

BEFORE implementing any feature:
1. ✅ Check if backend endpoint exists – Search `../phoneserver/src/endpoints/` for the API route
2. ✅ Verify database schema – Check `../phoneserver/src/db/index.ts` for table structure
3. ✅ Confirm type definitions exist – Ensure types in `src/api/types.tsx` match backend response
4. ✅ Search for existing usage – Use `grep_search` to find similar patterns in codebase

**WHILE coding:**
1. ⚠️ **Don't assume endpoints exist** - Verify in `../phoneserver/src/endpoints/` first
2. ⚠️ **Don't guess response shapes** - Check actual backend endpoint or database schema
3. ⚠️ **Don't create types blindly** - Match exactly what backend returns
4. ⚠️ **Use existing patterns** - Follow `src/pages/call.tsx` for state-driven UI examples
5. ⚠️ **Document incomplete implementations** - Add to `../TODO.md` if using mock data, placeholder UI, or leaving TODO comments

**AFTER making changes:**
1. ✅ **Check Frontend Dev terminal** - Look for "ready in X ms" with no TypeScript errors
2. ✅ **Check Backend Dev terminal** - Ensure "Server running on port 8080" with no errors
3. ✅ **Verify type alignment** - Confirm `src/api/types.tsx` matches `../phoneserver/src/db/index.ts`
4. ✅ **Test in browser** - Verify full data flow works end-to-end

**If backend needs updates:**
- Create/modify endpoint in `../phoneserver/src/endpoints/<name>.ts`
- Update database schema in `../phoneserver/src/db/index.ts` if needed
- Then update `src/api/types.tsx` to match backend response
- See `../phoneserver/.github/copilot-instructions.md` for backend patterns

**When asked to update instruction files:**
- ⚠️ **CRITICAL**: Update ALL THREE files for monorepo-wide changes:
  - This file for frontend-specific patterns
  - `../.github/copilot-instructions.md` for workspace architecture
  - `../phoneserver/.github/copilot-instructions.md` for backend impacts
- Maintain consistency in shared sections (Git workflow, type sync, development environment)

**⚠️ CROSS-FILE UPDATE RESPONSIBILITY:**
When you modify ANY documentation file, you MUST alert the user to update related files:
- **Changing this instruction file** → Alert to update `README.md` (this project) + `../README.md` (workspace)
- **Changing `README.md`** → Alert to update this instruction file's examples
- **Changing API types** (`src/api/types.tsx`) → Alert to update `../phoneserver/src/db/index.ts` + both README files
- **Adding TODO comments** → MUST update `../TODO.md` under "Frontend (phonebooth/)" section
- **Completing TODOs** → MUST update `../TODO.md` (move to Completed) + remove code comments
- **Adding new routes** → Update this file + `README.md` + `../README.md` (Available Routes section)
- **Changing component patterns** → Update this file + `README.md` (Key Patterns section)

## 🚨 When Making Architectural Changes

**ALERT THE USER before implementing these frontend changes:**

1. **Changing build tools** (Rsbuild → Vite, Webpack, etc.)
   - **README impact:** `README.md` - Tech Stack, Development sections

2. **Replacing routing library** (Wouter → React Router, TanStack Router, etc.)
   - **README impact:** `README.md` - Tech Stack, Available Routes sections

3. **Switching data fetching** (SWR → React Query, RTK Query, etc.)
   - **README impact:** `README.md` - Tech Stack, Key Patterns (Data Fetching) sections

4. **Changing styling approach** (Tailwind → CSS Modules, Styled Components, etc.)
   - **README impact:** `README.md` - Tech Stack, Responsive Design sections

5. **Modifying API proxy configuration** (port changes, new proxy rules)
   - **README impact:** `README.md` - Development section, `../README.md` - Architecture section

6. **Adding state management** (Zustand, Redux, Jotai, etc.)
   - **README impact:** `README.md` - Tech Stack section

7. **Changing component patterns** (new layout system, different wrapper conventions)
   - **README impact:** `README.md` - Project Structure, Key Patterns sections

8. **Modifying authentication storage** (cookies → localStorage, sessionStorage, etc.)
   - **README impact:** `README.md` - API Integration section, `../phoneserver/README.md` - Authentication Pattern section

**Affected documentation:**
- **READMEs:** `README.md`, `../README.md`, `../phoneserver/README.md` (see specific sections above)
- **Instructions:** This file (pattern examples, import conventions, styling sections), `../.github/copilot-instructions.md` (cross-project workflows, proxy config)

**Action required:** Inform the user to update both README files and instruction files after the change is complete.

## Architecture Overview

React-based VoIP phone application with separate backend:
- **Frontend**: React 19 + Rsbuild + Tailwind CSS 4 + Wouter (routing) + SWR (data fetching)
- **Backend**: Express API in `../phoneserver/` on port 8080
- **Build Tool**: Rsbuild with API proxy redirecting `/api/*` to localhost:8080

## Project Structure

- `src/pages/` - Single page component (`call.tsx` - active call interface)
- `src/components/` - Most route/page components (contacts, history, rates, transactions, etc.)
- `src/components/body/` - Layout wrappers (`body.tsx`, `header.tsx`, `footer.tsx`)
- `src/components/call/` - Call-related UI (active, init, over states)
- `src/components/dial/` - Dial pad and phone input components
- `src/components/cards/` - Legacy data display cards (deprecated, see display/cards/)
- `src/components/display/` - UI primitives (`box-field.tsx`, separators, grid items)
- `src/components/display/cards/` - Data display cards (history, rate, transaction)
- `src/components/display/text/` - Typography components (`title.tsx`, `description.tsx`, `title-center.tsx`)
- `src/components/display/input/` - Interactive elements (buttons, links)
- `src/components/user/` - User/authentication UI components
- `src/api/` - Type definitions (`types.tsx`) and fetcher utility (`fetcher.tsx`)

## Critical Patterns

### Data Fetching with SWR
All API calls use SWR with the shared `fetcher` utility from `src/api/fetcher.tsx`:
```tsx
const { data, error, isLoading } = useSWR<CallItem[]>("/api/calls", fetcher);
```
The fetcher automatically throws on non-ok responses and parses JSON. Use `mutate()` to refresh data after POST operations.

**POST requests**: For mutations, call `fetcher()` directly with method/body:
```tsx
await fetcher("/api/call/ring", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ phoneNumber }),
});
```

**State-driven UI**: Pages like `call.tsx` use local state (`useState`) to manage call lifecycle (ringing → active → ended) with effects that trigger API calls at state transitions.

### Page Layout Pattern
Every page wraps content in the `Body` component from `src/components/body/body.tsx`:
```tsx
import Body from "../components/body/body";

const DialPage: react.FC = () => {
  return (
    <Body>
      {/* Page content */}
    </Body>
  );
};
```

The `Body` component provides:
- Responsive header/footer (desktop shows header, mobile shows footer)
- Centered content container with `md:max-w-2xl` width
- Full-height flex layout with scrollable content area

### Styling Composition
Build UI using semantic wrapper components instead of raw divs:
- `FieldBox` - Container with title and optional buttons (from `src/components/display/box-field.tsx`)
- `Title` / `TitleCentered` - Text hierarchy (from `src/components/text/`)
- `Description` - Muted descriptive text (from `src/components/text/description.tsx`)
- `GridSpacer` / `SeparatorLine` - Spacing utilities (from `src/components/display/`)

Example from `src/components/display/box-field.tsx`:
```tsx
<FieldBox title={<>Verify identity</>} buttons={<LinkStyle onClick={...} />}>
  <InputField value={code} onChange={...} />
  <GridSpacer />
  Enter the authentication code...
</FieldBox>
```

### Routing
Uses Wouter for client-side routing. Routes defined in `src/index.tsx`:
- `/` - Landing page (dial pad)
- `/rates` - Display calling rates/pricing
- `/call/:phone` - Active call interface
- `/history` - Call history list
- `/user` - User account/balance info
- `/user/login` - Login page
- `/user/register` - Registration page
- `/user/deposit` - Add funds to balance
- `/transactions` - Transaction history
- `/contacts` - Contact list
- `/contacts/:id` - Contact detail view
- `/contacts/:id/edit` - Edit contact

### TypeScript Conventions
- Import React as lowercase: `import react from "react"`
- Type components as `react.FC` or `react.FC<PropsWithChildren<Props>>`
- API types centralized in `src/api/types.tsx`
- Strict TypeScript enabled (`tsconfig.json`)
- Use default exports for all components

### Import Organization
Many files use Biome ignore comments to prevent import reordering:
```tsx
/** biome-ignore-all assist/source/organizeImports: <> */
import react from "react";
```
This is intentional - preserve existing import patterns when editing.

### Responsive Design
- Desktop: Header navigation visible (`header.tsx` in `src/components/body/`), footer hidden
- Mobile: Footer navigation visible (`footer.tsx` in `src/components/body/`), header hidden
- Breakpoint: Tailwind `md:` classes (e.g., `md:hidden`, `md:visible`, `md:max-w-2xl`)
- Layout: `w-full md:max-w-2xl` centers content on desktop

## Development Workflow

**⚠️ Both servers required for development:**
- Frontend (this): `npm run dev` in `phonebooth/` (port 3000)
- Backend: `npm run dev` in `../phoneserver/` (port 8080)
- Workspace auto-starts both via VS Code tasks (check "Frontend Dev" and "Backend Dev" terminals)

**Verifying cross-project changes:**
```powershell
# After making changes, check both terminal outputs:
# - Frontend terminal: Look for "ready in X ms" with no TypeScript errors
# - Backend terminal: Look for "Server running on port 8080" with no tsx errors
```

**The Rsbuild config** (`rsbuild.config.ts`) proxies `/api/*` requests to `http://localhost:8080` automatically.

**Important**: When working on both projects, use PowerShell terminals. Chain commands with `;` not `&&`.

**Type synchronization:**
- This project's `src/api/types.tsx` must match backend responses
- Backend schema: `../phoneserver/src/db/index.ts` (DatabaseSchema interface)
- When backend adds/changes tables, update types here accordingly

## API Endpoints

All endpoints return JSON. Backend server (`../phoneserver/src/endpoints/`) provides:

**Authentication:**
- `POST /api/login/email` - Request auth code with `{ email }`
- `POST /api/login/code` - Verify auth code with `{ code }`, sets JWT cookie
- `POST /api/logout` - Clear authentication

**User & Account:**
- `GET /api/user` - User info (balance, email, callerId)
- `POST /api/balance` - Update balance with `{ balance, transactionType, displayCurrency }`

**Calls:**
- `GET /api/calls` - Call history array
- `POST /api/call/ring` - Initiate call with `{ phoneNumber }`, returns `{ callId }`
- `POST /api/call/connect` - Connect call with `{ callId }`
- `POST /api/call/hang` - End call with `{ callId }`

**Rates & Transactions:**
- `GET /api/rates` - Pricing rates by country
- `GET /api/transactions` - Transaction history

Data models defined in `src/api/types.tsx`: `UserItem`, `CallItem`, `RateItem`, `TransactionItem`, `LoginItem`

## Code Style

- **Formatter**: Biome (`@biomejs/biome`) - enforces no semicolons in JSX/TSX
- **CSS**: Tailwind CSS 4 via PostCSS (`@tailwindcss/postcss`)
- **Component pattern**: Default exports, functional components with `react.FC`
- **File naming**: kebab-case (e.g., `history-card.tsx`, `box-field.tsx`)
- **Imports**: Prefer absolute paths from `src/` when possible
- **No build step for CSS**: Tailwind 4 uses PostCSS directly, no separate config file

## Common Patterns to Avoid

- Don't use `&&` to chain commands in PowerShell (use `;` instead)
- Don't add semicolons to JSX/TSX (Biome will flag them)
- Don't bypass the `Body` wrapper component in pages
- Don't use `Authorization` headers for API calls (JWT is in cookies)
- Don't create raw `<div>` elements when semantic components exist (`FieldBox`, `Title`, etc.)

## TODO List Management (Frontend-Specific)

**Location:** `../TODO.md` (workspace root)

**⚠️ CRITICAL: Always update `../TODO.md` when:**
- Adding TODO comments to frontend code
- Implementing temporary/incomplete UI features
- Using mock data or placeholder API responses
- Completing existing TODO items from the Frontend section
- Discovering undocumented frontend technical debt

**When working in frontend code:**

1. **Alert user when encountering these patterns:**
   - Mock data or placeholder API responses
   - TODO comments in code not documented in `../TODO.md`
   - Disabled features or commented-out functionality
   - Completed TODOs still listed in `../TODO.md`

2. **When implementing temporary frontend solutions:**
   - Add to `../TODO.md` under "Frontend (phonebooth/)" section
   - Reference specific file and line number
   - Explain production-ready alternative
   - Tag with appropriate priority

3. **When user asks to "add to TODO" or "add to todo list":**
   - Add formatted entry to `../TODO.md` under "Frontend (phonebooth/)" section
   - Include: file path (relative to workspace root), issue description, impact, TODO details, priority, date added
   - Confirm addition to user with brief summary

**See workspace-level `../.github/copilot-instructions.md` for full TODO management protocol.**

## Key Files

**This project:**
- `src/index.tsx` - App entry point with route definitions
- `src/api/fetcher.tsx` - Shared fetch wrapper for SWR
- `src/api/types.tsx` - All TypeScript interfaces (must match backend schema)
- `src/components/body/body.tsx` - Main page layout wrapper
- `src/pages/call.tsx` - Example of state-driven UI with call lifecycle
- `rsbuild.config.ts` - Build config with API proxy
- `tsconfig.json` - TypeScript strict mode enabled

**Related backend files** (in `../phoneserver/`):
- `src/db/index.ts` - Database schema (source of truth for types)
- `src/endpoints/` - API endpoint implementations
- `src/main.ts` - Server setup and router registration

## Cross-Project Workflows

**Adding a new page that needs backend data:**
1. Check if endpoint exists in `../phoneserver/src/endpoints/`
2. If not, create endpoint there first (see backend instructions)
3. Add matching TypeScript types to `src/api/types.tsx`
4. Create page component in `src/components/<name>-page.tsx` using `useSWR` with `fetcher`
5. Add route to `src/index.tsx`
6. Verify both terminals show successful compilation

**Updating existing API integration:**
1. Check backend schema in `../phoneserver/src/db/index.ts`
2. Update endpoint if needed in `../phoneserver/src/endpoints/`
3. Update types in `src/api/types.tsx` to match
4. Update component using the data
5. Test in browser with both servers running

**Git workflow:**
- This folder is a separate Git repository
- Commit/push frontend changes here independently
- Backend changes in `../phoneserver/` commit separately

---

# phoneserver/.github/copilot-instructions.md


# Phone Server - AI Coding Agent Instructions

## Documentation Hierarchy

You are receiving instructions from multiple sources:

- **Backend agent instructions:** This file (`.github/copilot-instructions.md`) – patterns, conventions, Kysely usage
- **Workspace-level agent instructions:** `../.github/copilot-instructions.md` – architecture, workflows, cross-project impact
- **Frontend agent instructions:** `../phonebooth/.github/copilot-instructions.md` – frontend API, type definitions
- **TODO tracking:** `../TODO.md` – all unfinished features and technical debt
- **System meta:** `../AGENT_SYSTEM.md` – AI agent behavior, documentation hierarchy

**Always update all relevant documentation when making architectural changes, adding features, or completing TODOs.**

## Problem-First Workflow

CRITICAL: Always prompt before implementing:
- When tackling ANY problem or request, FIRST prompt the user with:
  1. Your understanding of the problem
  2. Your proposed solution/action plan
  3. Wait for user confirmation before implementing
- This applies to bug fixes, feature requests, refactoring, and architectural changes
- Only skip confirmation for trivial tasks (simple reads, formatting, typo fixes)

## Monorepo Context

This is the BACKEND project in a monorepo workspace. The complete application requires both:
- **phoneserver/** (this project) – Express API on port 8080
- **phonebooth/** (sibling project) – React frontend on port 3000

Critical for AI agents:
- Changes here often require corresponding frontend updates in `../phonebooth/`
- Database schema (`src/db/index.ts`) must align with frontend types in `../phonebooth/src/api/types.tsx`
- When adding endpoints, check if frontend already expects them in `../phonebooth/src/pages/`
- Both servers auto-start via workspace tasks – verify both terminals after changes

Data flow: `../phonebooth/` frontend → Rsbuild proxy → This API → SQLite → JSON response

## Development Workflow Checklist

BEFORE implementing any endpoint:
1. ✅ Check frontend expectations – Search `../phonebooth/src/pages/` for components using this endpoint
2. ✅ Verify frontend types – Check `../phonebooth/src/api/types.tsx` for expected response shape
3. ✅ Review database schema – Ensure `src/db/index.ts` has required tables/columns
4. ✅ Search for similar endpoints – Use `grep_search` in `src/endpoints/` for patterns

**WHILE coding:**
1. ⚠️ **Don't assume frontend types** - Check `../phonebooth/src/api/types.tsx` first
2. ⚠️ **Don't break type contracts** - Response shape must match what frontend expects
3. ⚠️ **Don't forget user filtering** - Use `getUserIdFromToken(req.cookies.jwt)` and filter by `owner`
4. ⚠️ **Use Kysely query builder** - Never write raw SQL (see existing endpoints for patterns)
5. ⚠️ **Document incomplete implementations** - Add to `../TODO.md` if using hardcoded values, temporary solutions, or leaving TODO comments

**AFTER making changes:**
1. ✅ **Check Backend Dev terminal** - Look for "Server running on port 8080" with no tsx errors
2. ✅ **Check Frontend Dev terminal** - Ensure no TypeScript errors from type mismatches
3. ✅ **Update frontend types** - Modify `../phonebooth/src/api/types.tsx` if response shape changed
4. ✅ **Test in browser** - Verify frontend can consume the endpoint successfully

**If database schema changes:**
- Update `DatabaseSchema` interface in `src/db/index.ts`
- Create migration in `src/db/migrations/` (numbered sequentially)
- Update test data in `insertTestData()` in `src/main.ts`
- **MUST update** `../phonebooth/src/api/types.tsx` to match new schema
- Search `../phonebooth/src/` for components using this data

**When asked to update instruction files:**
- ⚠️ **CRITICAL**: Update ALL THREE files for monorepo-wide changes:
  - This file for backend-specific patterns
  - `../.github/copilot-instructions.md` for workspace architecture
  - `../phonebooth/.github/copilot-instructions.md` for frontend impacts
- Maintain consistency in shared sections (Git workflow, type sync, development environment)

**⚠️ CROSS-FILE UPDATE RESPONSIBILITY:**
When you modify ANY documentation file, you MUST alert the user to update related files:
- **Changing this instruction file** → Alert to update `README.md` (this project) + `../README.md` (workspace)
- **Changing `README.md`** → Alert to update this instruction file's examples
- **Changing database schema** (`src/db/index.ts`) → Alert to update `../phonebooth/src/api/types.tsx` + both README files + all instruction files
- **Adding TODO comments** → MUST update `../TODO.md` under "Backend (phoneserver/)" section
- **Completing TODOs** → MUST update `../TODO.md` (move to Completed) + remove code comments
- **Adding/changing endpoints** → Update this file + `README.md` + `../README.md` + `../.github/copilot-instructions.md` (Available API Endpoints)
- **Changing auth patterns** → Update this file + `README.md` + `../phonebooth/.github/copilot-instructions.md`

## 🚨 When Making Architectural Changes

**ALERT THE USER before implementing these backend changes:**

1. **Database changes:**
   - Adding/removing/renaming tables or columns in `DatabaseSchema`
   - Changing database engine (SQLite → PostgreSQL, MySQL, etc.)
   - Switching from in-memory to persistent storage
   - Modifying primary/foreign key relationships
   - **README impact:** `README.md` - Database Schema, Test Data sections, `../phonebooth/README.md` - Type Definitions section

2. **API framework changes:**
   - Replacing Express (→ Fastify, Hono, etc.)
   - Changing query builder (Kysely → Drizzle, Prisma, etc.)
   - Adding GraphQL, tRPC, or other API paradigms
   - **README impact:** `README.md` - Tech Stack, Query Pattern sections

3. **Authentication changes:**
   - Modifying JWT mechanism (cookies → headers, different secret management)
   - Switching auth providers (→ OAuth, Auth0, Clerk, etc.)
   - Adding/removing authentication middleware
   - Changing token storage or validation logic
   - **README impact:** `README.md` - Authentication Pattern section, `../phonebooth/README.md` - API Integration section

4. **Endpoint structure changes:**
   - Adding/removing/renaming API routes
   - Changing response payload structure
   - Modifying request validation approach
   - Adding API versioning (→ `/api/v1/`, `/api/v2/`, etc.)
   - **README impact:** `README.md` - API Endpoints section, `../README.md` - Available API Endpoints section, `../phonebooth/README.md` - API Integration section

5. **Migration system changes:**
   - Switching migration tools
   - Changing migration numbering/naming scheme
   - Adding migration rollback support
   - **README impact:** `README.md` - Database Schema, Migrations sections

6. **Module system changes:**
   - Switching from ES modules to CommonJS (or vice versa)
   - Changing import extension requirements
   - Adding path aliases or module resolution changes
   - **README impact:** `README.md` - Module System, Common Pitfalls sections

**Affected documentation:**
- **READMEs:** `README.md`, `../README.md`, `../phonebooth/README.md` (see specific sections above)
- **Instructions:** This file (pattern examples, query patterns, endpoint structure), `../.github/copilot-instructions.md` (available endpoints, data flow), `../phonebooth/.github/copilot-instructions.md` (type sync requirements)
- **Code:** `../phonebooth/src/api/types.tsx` - Frontend type definitions (MUST update)

**Action required:** Inform the user to update README files, instruction files, and frontend types after the change is complete.

## Architecture Overview

This is an Express.js-based REST API for a phone calling service with user authentication, call tracking, and billing. The app uses:
- **In-memory SQLite** database (`:memory:`) - data is lost on restart
- **Kysely** for type-safe SQL queries (not an ORM)
- **JWT tokens** stored in HTTP-only cookies for authentication
- **Two-step email + code authentication** flow (email → auth code → JWT)
- **Billing Manager** - Global interval-based service (`src/services/billing-manager.ts`) that checks active calls every 60 seconds and auto-terminates when balance depletes

## Critical Developer Workflows

**⚠️ Both servers required for development:**
- Backend (this): `npm run dev` in `phoneserver/` (port 8080)
- Frontend: `npm run dev` in `../phonebooth/` (port 3000)
- Workspace auto-starts both via VS Code tasks (check "Frontend Dev" and "Backend Dev" terminals)

**Development:**
```bash
npm run dev  # Uses tsx watch to auto-reload on changes
```

**Port**: Backend runs on port 8080 (frontend in `../phonebooth/` proxies `/api/*` here)

**Database State:**
- Database is recreated on every restart
- Migrations run automatically via `migrateToLatest()` in `src/main.ts`
- Test data is inserted immediately after migrations (see `insertTestData()` in `src/main.ts`)

**No TypeScript config**: Backend has no `tsconfig.json` - tsx handles TypeScript compilation directly

**Verifying cross-project changes:**
```powershell
# After schema/endpoint changes, check:
# 1. This terminal: "Server running on port 8080" with no tsx errors
# 2. Frontend terminal: No TypeScript errors from type mismatches
# 3. Update ../phonebooth/src/api/types.tsx if schema changed
```

## Authentication Pattern

**Key difference from typical JWT implementations:**
- JWT is NOT passed via `Authorization` header in most endpoints
- JWT is stored in HTTP-only cookie named `jwt`
- Extract user ID with `getUserIdFromToken(req.cookies.jwt)` from `src/tokenizer.ts`
- Note: `src/authenticator.ts` exists but is **not actually used** in the current implementation

**Login Flow:**
1. POST `/api/login/email` with `{ email }` → generates 6-digit code, stores in `user.authCode` and sets `authCodeCreated` to current time (code valid for 15 minutes)
2. POST `/api/login/code` with `{ code }` → validates code and checks that `authCodeCreated` is within the last 15 minutes, sets JWT cookie (code is not cleared)

## Database Schema & Patterns

**Schema defined in:** `src/db/index.ts` using Kysely's TypeScript interface
**Migrations:** `src/db/migrations/0000-init.ts` - manual Kysely migrations (not auto-generated)

**Key Tables:**
- `user` - balance, currency, callerId (phone number), `authCode`, `authCodeCreated` (for authentication code expiry)
- `call` - tracks calls with owner foreign key to user
- `transaction` - financial transactions with owner foreign key
- `rate` - country calling rates by country code

**Query Pattern:**
```typescript
// Always use Kysely query builder, never raw SQL
const user = await db
  .selectFrom("user")
  .selectAll()
  .where("id", "=", userId)
  .executeTakeFirst();
```

## Project Conventions

**File Structure:**
- `src/endpoints/*.ts` - Each exports a router as `{ router as <name>Router }`
- All routers registered in `src/main.ts` with `app.use()`
- Database instance exported from `src/db/index.ts` as `db`
- `src/services/` - Background services (billing-manager, authenticator, tokenizer, email)

**Error Handling:**
- Most endpoints use try/catch with generic 500 errors
- Token validation throws errors caught by try/catch
- No custom error middleware

**TypeScript:**
- Using `"type": "module"` in package.json (ES modules)
- Must use `.js` extensions in imports (e.g., `from "../db/index.js"`) even for `.ts` files
- Top-level await is used in `src/main.ts`
- Biome for linting/formatting (not ESLint/Prettier)

## Common Pitfalls

1. **Don't add middleware to protect routes** - `authenticateJWT` exists but isn't used. Endpoints manually check `req.cookies.jwt`
2. **Database is ephemeral** - Never assume data persists between restarts
3. **JWT secret is hardcoded** - `"your-secure-secret-key"` in both `authenticator.ts` and `login.ts`
4. **User ownership** - Most endpoints filter by `owner` column using `getUserIdFromToken()`, not middleware injection

⚠️ **Note:** Pitfalls 1-3 are documented in `../TODO.md` with remediation plans

## TODO List Management (Backend-Specific)

**Location:** `../TODO.md` (workspace root)

**⚠️ CRITICAL: Always update `../TODO.md` when:**
- Adding TODO comments to backend code
- Implementing temporary/incomplete API features
- Using hardcoded values that should be configurable
- Implementing in-memory solutions that need job queues
- Completing existing TODO items from the Backend section
- Discovering undocumented backend technical debt

**When working in backend code:**

1. **Alert user when encountering these patterns:**
   - Hardcoded values that should be configurable (rates, secrets, URLs)
   - `setInterval` or `setTimeout` for business logic (use job queues)
   - TODO comments in code not documented in `../TODO.md`
   - Completed TODOs still listed in `../TODO.md`

2. **When implementing temporary backend solutions:**
   - Add to `../TODO.md` under "Backend (phoneserver/)" section
   - Reference specific file and line number
   - Explain production-ready alternative
   - Tag with appropriate priority

3. **Known backend TODOs to watch for:**
   - Hardcoded billing rate in `src/endpoints/dial.ts` (should query `rate` table)
   - In-memory billing timer (should use job queue)
   - Hardcoded JWT secret (should use environment variable)
   - Unused `authenticator.ts` file (implement or remove)
   - In-memory database (should be persistent for production)

**See workspace-level `../.github/copilot-instructions.md` for full TODO management protocol.**

## Adding New Features

**New Endpoint:**
1. Create file in `src/endpoints/<name>.ts`
2. Export as `export { router as <name>Router }`
3. Import and `app.use()` in `src/main.ts`
4. Extract user with `getUserIdFromToken(req.cookies.jwt)` if needed
5. **⚠️ Update frontend types** in `../phonebooth/src/api/types.tsx` to match response shape
6. **Verify** both terminals compile successfully

**New Table:**
1. Add interface to `DatabaseSchema` in `src/db/index.ts`
2. Create migration in `src/db/migrations/` numbered sequentially
3. Register in `migrator.ts` provider's `getMigrations` object
4. Add test data in `insertTestData()` if needed
5. **⚠️ Update frontend types** in `../phonebooth/src/api/types.tsx` if table data is exposed via API
6. Check if frontend components in `../phonebooth/src/pages/` need updates

**Modifying existing endpoint response:**
1. Update endpoint logic in `src/endpoints/<name>.ts`
2. Update `DatabaseSchema` in `src/db/index.ts` if database changed
3. **⚠️ Critical:** Update matching interface in `../phonebooth/src/api/types.tsx`
4. Find frontend components using this endpoint (search for endpoint path in `../phonebooth/src/`)
5. Update component TypeScript types and rendering logic
6. Test in browser with both servers running

## API Endpoints

**Authentication:**
- `POST /api/login/email` - `{ email }` → generates 6-digit code
- `POST /api/login/code` - `{ code }` → validates, sets JWT cookie
- `POST /api/logout` - Clears JWT cookie

**User & Account:**
- `GET /api/user` - Returns user object (balance, email, callerId, currency)
- `POST /api/balance` - `{ balance, transactionType, displayCurrency }` → updates balance

**Calls:**
- `GET /api/calls` - Returns array of calls for authenticated user
- `POST /api/call/ring` - `{ phoneNumber }` → creates call in "init" state, returns `{ callId }`
- `POST /api/call/connect` - `{ callId }` → updates to "active", starts billing interval (60s checks)
- `POST /api/call/hang` - `{ callId }` → ends call, calculates cost, creates transaction

**Rates & Transactions:**
- `GET /api/rates` - Returns all country calling rates
- `GET /api/transactions` - Returns transaction history for authenticated user
- `POST /api/balance` - `{ amount }` → adds funds to balance, no automatic transaction record created

**Call Flow Pattern:**
1. Client POSTs to `/api/call/ring` with phone number → backend creates call record with status "init"
2. Client POSTs to `/api/call/connect` with callId → backend sets status "active", starts 60-second billing timer (checks balance, auto-ends on $0)
3. Client POSTs to `/api/call/hang` with callId → backend calculates cost, deducts from balance, creates transaction

**Important Call Implementation Details:**
- Billing managed by centralized `billing-manager.ts` service (60-second global interval)
- Billing manager queries `rate` table by country code (extracted from phone number)
- Rate lookup in `billing-manager.ts` uses helper function `getRateForNumber(phoneNumber)`
- Auto-terminates active calls when balance reaches $0
- Auto-completes "hanging" status calls after 5 minutes
- Auto-fails "init" status calls after 1 minute (no answer)
- Call duration calculated from `startTime` to `endTime` in milliseconds
- Service starts on server launch via `startBillingManager()` in `main.ts`

## Debugging Tips

- **Console logging**: Auth codes are printed to console in `login.ts` (check terminal output)
- **Database inspection**: Since DB is in-memory, use Kysely queries in endpoints to inspect state
- **Test users**: Two users pre-inserted (see `insertTestData()` in `main.ts`):
  - user1@example.com (ID: 1, balance: $100.50, callerId: 123456789)
  - user2@example.com (ID: 2, balance: €200.00, callerId: 987654321)
- **JWT debugging**: Decode token payload manually with `Buffer.from(token.split(".")[1], "base64").toString()` (see `tokenizer.ts`)
- **Call billing**: Check `dial.ts` for hardcoded rate (0.01) and TODO comment about proper rate lookup
- **Balance endpoint**: POST adds funds directly to balance without creating transaction record (unlike call hangup which creates transaction)

## Cross-Project Workflows

**Schema-to-Frontend Type Mapping:**
```typescript
// This project: src/db/index.ts (DatabaseSchema)
interface DatabaseSchema {
  user: {
    id: Generated<number>;
    email: string;
    balance: number;
    // ...
  };
}

// Frontend: ../phonebooth/src/api/types.tsx
export interface UserItem {
  id: string;      // Note: Frontend uses string for IDs
  email: string;
  balance: number;
  // ...
}
```
**Type conversion happens in endpoints** - backend returns DB types, frontend expects API types.

**Adding a feature that spans both projects:**
1. **Backend (this project):**
   - Add table to `DatabaseSchema` in `src/db/index.ts`
   - Create migration in `src/db/migrations/`
   - Add endpoint in `src/endpoints/<name>.ts`
   - Register router in `src/main.ts`
   - Add test data in `insertTestData()`

2. **Frontend (`../phonebooth/`):**
   - Add matching types to `src/api/types.tsx`
   - Create page component in `src/pages/<name>.tsx`
   - Add route to `src/index.tsx`
   - Use `useSWR` with `fetcher` to consume endpoint

3. **Verify:**
   - Backend terminal: "Server running on port 8080"
   - Frontend terminal: "ready in X ms" with no errors
   - Browser: Test full flow end-to-end

**Key Files in Frontend** (for reference when making backend changes):
- `../phonebooth/src/api/types.tsx` - **Must update when schema changes**
- `../phonebooth/src/api/fetcher.tsx` - HTTP client wrapper
- `../phonebooth/src/pages/` - Pages consuming your endpoints
- `../phonebooth/rsbuild.config.ts` - Proxy config (`/api/*` → `localhost:8080`)

**Git Workflow:**
- This folder is a separate Git repository
- Commit/push backend changes here independently
- Frontend changes in `../phonebooth/` commit separately
- Coordinate commits when features span both projects
