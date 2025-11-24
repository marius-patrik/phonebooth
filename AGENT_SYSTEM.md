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
phonebooth-workspace/           # Not a Git repo - just a VS Code workspace
├── .github/
│   └── copilot-instructions.md # Workspace-level agent instructions
├── README.md                   # Workspace overview
├── TODO.md                     # Centralized TODO tracking
├── AGENT_SYSTEM.md             # This file - system documentation
├── phonebooth-workspace.code-workspace  # VS Code workspace config
├── phonebooth/                 # Separate Git repository #1
│   ├── .git/
│   ├── .github/
│   │   └── copilot-instructions.md
│   ├── README.md
│   └── package.json
└── phoneserver/                # Separate Git repository #2
    ├── .git/
    ├── .github/
    │   └── copilot-instructions.md
    ├── README.md
    └── package.json
```

**Why Multiple Repos:**
- Independent version control per project
- Separate commit histories
- Can deploy/release independently
- Different teams can own different repos

**Coordination:** Workspace-level documentation coordinates changes across repos

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
```powershell
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
