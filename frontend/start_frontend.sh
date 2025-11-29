#!/bin/bash

# GenFuture Career Frontend Startup Script

# Resolve repo root (non-intrusive; for delegation path)
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$DIR/.." && pwd)"

run_legacy() {
    # ORIGINAL LEGACY STARTUP COMMANDS BELOW (unchanged)

    cd "$(dirname "$0")"

    echo "🔍 [DEBUG] Checking frontend setup..."
    echo "📍 [DEBUG] Current directory: $(pwd)"
    echo "📍 [DEBUG] Node version: $(node --version 2>/dev/null || echo 'Node not found')"
    echo "📍 [DEBUG] NPM version: $(npm --version 2>/dev/null || echo 'NPM not found')"

    echo "🚀 Starting GenFuture Career Frontend..."
    echo "======================================="

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "📦 [DEBUG] Installing dependencies..."
        npm install
    else
        echo "✅ [DEBUG] Dependencies already installed"
    fi

    # Check API connectivity
    echo "🌐 [DEBUG] Testing backend connectivity..."
    curl -s http://localhost:8000/ > /dev/null 2>&1 && echo "✅ [DEBUG] Backend is reachable" || echo "⚠️ [DEBUG] Backend not reachable on port 8000"

    # Use npx with --yes flag to auto-confirm
    echo "🌟 Starting development server (using project-local Vite via npm run dev)..."
    echo "[DEBUG] Vite declared in package.json (npm ls):"
    npm ls vite --depth=0 2>/dev/null | grep vite || echo "[WARN] vite not found in npm ls output"
    echo "[DEBUG] npm run dev -- --host 0.0.0.0 --port 5173 --strictPort"
    npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
}

# Always start legacy UI (frontend-new disabled by default)
echo "[frontend] Starting legacy UI (frontend-new disabled by default)"
run_legacy