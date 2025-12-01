#!/usr/bin/env bash
set -euo pipefail

# Ensure we are in the frontend-new project directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-5173}"

echo "[frontend-new] Starting redesigned UI (Vite) on ${HOST}:${PORT}"

# Basic prerequisites checks
if ! command -v node >/dev/null 2>&1; then
  echo "[frontend-new] Error: Node.js is required but not found on PATH"
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "[frontend-new] Error: npx is required but not found on PATH (usually available with npm >= 5.2)"
  exit 1
fi

# Informative warning if dependencies appear missing
if [ ! -d "node_modules" ]; then
  echo "[frontend-new] Warning: node_modules not found. Dependencies may be missing."
fi

# Launch local Vite via npx; strictPort avoids silent port changes
# Use exec so signals (CTRL+C, termination) are properly forwarded
exec npx vite --host "${HOST}" --port "${PORT}" --strictPort