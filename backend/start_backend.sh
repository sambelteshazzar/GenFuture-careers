#!/bin/bash

# Script to start the GenFuture backend with proper virtual environment

cd "$(dirname "$0")"

echo "🔍 [DEBUG] Checking backend setup..."
echo "📍 [DEBUG] Current directory: $(pwd)"
echo "📍 [DEBUG] Python version: $(python3 --version 2>/dev/null || echo 'Python not found')"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ [ERROR] Virtual environment not found. Creating..."
    python3 -m venv venv
    echo "✅ [DEBUG] Virtual environment created"
fi

# Activate virtual environment
echo "🔄 [DEBUG] Activating virtual environment..."
source venv/bin/activate

# Check if requirements are installed
echo "📦 [DEBUG] Checking installed packages..."
pip list | grep -E "(fastapi|uvicorn|sqlalchemy)" || {
    echo "📥 [DEBUG] Installing requirements..."
    pip install -r requirements.txt
}

# Check database setup
echo "🗄️ [DEBUG] Checking database setup..."
if [ ! -f "genfuture.db" ]; then
    echo "🌱 [DEBUG] Database not found. Seeding database..."
    python scripts/seed.py
else
    echo "✅ [DEBUG] Database exists"
fi

# Run the FastAPI server
echo "🚀 [DEBUG] Starting FastAPI server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000