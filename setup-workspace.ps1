# Phonebooth Workspace Setup Script
# Run this on a new machine to set up the complete development environment

param(
    [switch]$SkipGitClone,
    [switch]$SkipNpmInstall
)

Write-Host "🚀 Phonebooth Workspace Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green

$gitVersion = git --version 2>$null
if (-not $gitVersion) {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git detected" -ForegroundColor Green
Write-Host ""

# Git clone (if needed)
if (-not $SkipGitClone) {
    Write-Host "📥 Cloning repositories..." -ForegroundColor Yellow
    
    # If using submodules
    if (Test-Path .gitmodules) {
        Write-Host "Detected submodules, initializing..." -ForegroundColor Cyan
        git submodule init
        git submodule update
    }
    # If separate repos (manual setup)
    else {
        if (-not (Test-Path phonebooth/.git)) {
            Write-Host "⚠️  phonebooth/ is not a Git repo. Clone it manually:" -ForegroundColor Yellow
            Write-Host "   git clone <phonebooth-url> phonebooth" -ForegroundColor Gray
        }
        if (-not (Test-Path phoneserver/.git)) {
            Write-Host "⚠️  phoneserver/ is not a Git repo. Clone it manually:" -ForegroundColor Yellow
            Write-Host "   git clone <phoneserver-url> phoneserver" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

# Install dependencies
if (-not $SkipNpmInstall) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    
    # Frontend
    if (Test-Path phonebooth/package.json) {
        Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
        Push-Location phonebooth
        npm install
        Pop-Location
        Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
    }
    
    # Backend
    if (Test-Path phoneserver/package.json) {
        Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
        Push-Location phoneserver
        npm install
        Pop-Location
        Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
    }
    Write-Host ""
}

# Summary
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Open phonebooth.code-workspace in VS Code"
Write-Host "2. Both dev servers will auto-start (Frontend: port 3000, Backend: port 8080)"
Write-Host "3. Check terminals for 'ready' messages"
Write-Host ""
Write-Host "📖 Documentation:" -ForegroundColor Cyan
Write-Host "- README.md - Quick start guide"
Write-Host "- AGENT_SYSTEM.md - AI agent system architecture"
Write-Host "- TODO.md - Current unfinished features"
Write-Host "- .github/copilot-instructions.md - Development workflows"
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green
