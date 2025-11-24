# Phonebooth Workspace 
Setup  This workspace contains both the Phonebooth frontend and backend projects configured to run together in VS Code.  ## Quick Setup (New Machine)

1. **Clone the workspace repository:**
   ```powershell
   git clone https://github.com/pastiiiiiiik/phonebooth-workspace.git
   cd phonebooth-workspace
   git submodule update --init --recursive
   ```

2. **Open in VS Code:**
   ```powershell
   code phonebooth.code-workspace
   ```

3. **Install dependencies:**
   Both dev servers will auto-start. If they fail, install dependencies first:
   ```powershell
   cd phonebooth
   npm install
   cd ../phoneserver
   npm install
   ``` ## Features

- **Auto-start dev servers**: Both frontend (port 3000) and backend (port 8080) start automatically when you open the workspace
- **Split terminals**: Servers run in dedicated terminal panels
- **Separate Git repos**: Each project has its own Git repository and can be committed/pushed independently
- **TypeScript IntelliSense**: Properly configured for both projects
- **Biome formatting**: Auto-format on save

## Manual Tasks

If auto-start is disabled, run the VS Code tasks:
- Frontend: "Frontend Dev" task
- Backend: "Backend Dev" task

## Project Structure

```
phonebooth-workspace/
├── phonebooth.code-workspace    # VS Code workspace configuration
├── phonebooth/                  # React + Rsbuild app (port 3000)
└── phoneserver/                 # Express + SQLite API (port 8080)
```

## GitHub Repositories

- **Workspace**: https://github.com/pastiiiiiiik/phonebooth-workspace
- **Frontend**: https://github.com/pastiiiiiiik/phonebooth
- **Backend**: https://github.com/pastiiiiiiik/phoneserver
