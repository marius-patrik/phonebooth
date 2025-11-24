#!/bin/bash
# Phonebooth Workspace Setup Script (macOS/Linux)
# Run this on a new machine to set up the complete development environment

set -e

echo "🚀 Phonebooth Workspace Setup"
echo "================================"
echo ""

# Check prerequisites
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi
echo "✅ Node.js $(node --version) detected"

if ! command -v git &> /dev/null; then
    echo "❌ Git not found. Please install Git first."
    exit 1
fi
echo "✅ Git detected"
echo ""

# Git clone (if needed)
if [ ! "$1" = "--skip-git" ]; then
    echo "📥 Checking repositories..."
    
    # If using submodules
    if [ -f .gitmodules ]; then
        echo "Detected submodules, initializing..."
        git submodule init
        git submodule update
    else
        # If separate repos (manual setup)
        if [ ! -d phonebooth/.git ]; then
            echo "⚠️  phonebooth/ is not a Git repo. Clone it manually:"
            echo "   git clone <phonebooth-url> phonebooth"
        fi
        if [ ! -d phoneserver/.git ]; then
            echo "⚠️  phoneserver/ is not a Git repo. Clone it manually:"
            echo "   git clone <phoneserver-url> phoneserver"
        fi
    fi
    echo ""
fi

# Install dependencies
if [ ! "$1" = "--skip-npm" ]; then
    echo "📦 Installing dependencies..."
    
    # Frontend
    if [ -f phonebooth/package.json ]; then
        echo "Installing frontend dependencies..."
        cd phonebooth
        npm install
        cd ..
        echo "✅ Frontend dependencies installed"
    fi
    
    # Backend
    if [ -f phoneserver/package.json ]; then
        echo "Installing backend dependencies..."
        cd phoneserver
        npm install
        cd ..
        echo "✅ Backend dependencies installed"
    fi
    echo ""
fi

# Summary
echo "✨ Setup Complete!"
echo ""
echo "📚 Next Steps:"
echo "1. Open phonebooth.code-workspace in VS Code"
echo "2. Both dev servers will auto-start (Frontend: port 3000, Backend: port 8080)"
echo "3. Check terminals for 'ready' messages"
echo ""
echo "📖 Documentation:"
echo "- README.md - Quick start guide"
echo "- AGENT_SYSTEM.md - AI agent system architecture"
echo "- TODO.md - Current unfinished features"
echo "- .github/copilot-instructions.md - Development workflows"
echo ""
echo "Happy coding! 🎉"
