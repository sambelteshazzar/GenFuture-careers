#!/bin/bash

# GenFuture Careers Project Diagnostic Script
echo "🔍 GenFuture Careers Project Diagnostic Tool"
echo "============================================"

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "📍 Project Root: $PROJECT_ROOT"
echo ""

# Check Backend Setup
echo "📡 BACKEND DIAGNOSTICS"
echo "======================"

cd "$PROJECT_ROOT/backend"

echo "🐍 Python Environment:"
if command -v python3 &> /dev/null; then
    echo "✅ Python3 found: $(python3 --version)"
else
    echo "❌ Python3 not found"
fi

echo "📦 Virtual Environment:"
if [ -d "venv" ]; then
    echo "✅ Virtual environment exists"
    source venv/bin/activate
    echo "✅ Virtual environment activated"
    echo "📋 Installed packages:"
    pip list | grep -E "(fastapi|uvicorn|sqlalchemy|pydantic)" || echo "❌ Key packages missing"
else
    echo "❌ Virtual environment not found"
fi

echo "🗄️ Database Setup:"
if [ -f "genfuture.db" ]; then
    echo "✅ Database file exists"
    echo "📊 Database size: $(du -h genfuture.db | cut -f1)"
else
    echo "❌ Database file not found"
fi

echo "🔧 Configuration Files:"
if [ -f "requirements.txt" ]; then
    echo "✅ requirements.txt exists"
else
    echo "❌ requirements.txt missing"
fi

if [ -f "app/core/config.py" ]; then
    echo "✅ config.py exists"
else
    echo "❌ config.py missing"
fi

echo ""
echo "🌐 FRONTEND DIAGNOSTICS"
echo "======================="

cd "$PROJECT_ROOT/frontend"

echo "📱 Node Environment:"
if command -v node &> /dev/null; then
    echo "✅ Node found: $(node --version)"
else
    echo "❌ Node not found"
fi

if command -v npm &> /dev/null; then
    echo "✅ NPM found: $(npm --version)"
else
    echo "❌ NPM not found"
fi

echo "📦 Dependencies:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
    echo "📋 Key packages:"
    npm list --depth=0 2>/dev/null | grep -E "(react|axios|vite|tailwind)" || echo "❌ Key packages missing"
else
    echo "❌ node_modules not found"
fi

echo "🔧 Configuration Files:"
if [ -f "package.json" ]; then
    echo "✅ package.json exists"
else
    echo "❌ package.json missing"
fi

if [ -f "vite.config.js" ]; then
    echo "✅ vite.config.js exists"
else
    echo "❌ vite.config.js missing"
fi

echo ""
echo "🌍 NETWORK DIAGNOSTICS"
echo "======================"

echo "🔗 Port Availability:"
if command -v netstat &> /dev/null; then
    if netstat -tuln 2>/dev/null | grep -q ":8000"; then
        echo "⚠️ Port 8000 is in use"
    else
        echo "✅ Port 8000 is available"
    fi
    
    if netstat -tuln 2>/dev/null | grep -q ":5173"; then
        echo "⚠️ Port 5173 is in use"
    else
        echo "✅ Port 5173 is available"
    fi
else
    echo "❌ netstat not available for port checking"
fi

echo ""
echo "🧪 INTEGRATION TESTS"
echo "===================="

# Test backend connectivity if running
echo "🔗 Testing Backend Connectivity:"
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Backend is reachable on port 8000"
    echo "📊 Backend response:"
    curl -s http://localhost:8000/ | head -1
else
    echo "❌ Backend not reachable on port 8000"
fi

# Test frontend connectivity if running
echo "🔗 Testing Frontend Connectivity:"
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo "✅ Frontend is reachable on port 5173"
else
    echo "❌ Frontend not reachable on port 5173"
fi

echo ""
echo "🔧 RECOMMENDED FIXES"
echo "===================="

# Provide specific recommendations based on findings
cd "$PROJECT_ROOT/backend"
if [ ! -d "venv" ]; then
    echo "📋 Create virtual environment:"
    echo "   cd backend && python3 -m venv venv"
    echo "   source venv/bin/activate"
    echo "   pip install -r requirements.txt"
fi

if [ ! -f "genfuture.db" ]; then
    echo "📋 Seed the database:"
    echo "   cd backend && python scripts/seed.py"
fi

cd "$PROJECT_ROOT/frontend"
if [ ! -d "node_modules" ]; then
    echo "📋 Install frontend dependencies:"
    echo "   cd frontend && npm install"
fi

echo ""
echo "🚀 STARTUP COMMANDS"
echo "=================="
echo "Backend: cd backend && ./start_backend.sh"
echo "Frontend: cd frontend && ./start_frontend.sh"
echo "Both: ./start_all.sh"

echo ""
echo "✅ Diagnostic complete!"