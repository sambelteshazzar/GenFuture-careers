#!/bin/bash

# Script to start both GenFuture backend and frontend

echo "🚀 Starting GenFuture Career Platform..."
echo "======================================="
echo "[start_all] LEGACY_FRONTEND=${LEGACY_FRONTEND:-false}"

# Get the script directory
SCRIPT_DIR="$(dirname "$0")"
PROJECT_ROOT="$(cd "$SCRIPT_DIR" && pwd)"

# Function to start backend
start_backend() {
    echo "📡 Starting backend server..."
    cd "$PROJECT_ROOT/backend"
    source venv/bin/activate
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    echo "✅ Backend started with PID: $BACKEND_PID"
}

# Function to start frontend
start_frontend() {
    echo "🌐 Starting frontend development server..."
    cd "$PROJECT_ROOT/frontend"
    bash "./start_frontend.sh" &
    FRONTEND_PID=$!
    echo "✅ Frontend started with PID: $FRONTEND_PID"
}

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend server stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend server stopped"
    fi
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Start both servers
start_backend
sleep 3  # Give backend time to start
start_frontend

echo ""
echo "🎉 GenFuture Career Platform is now running!"
echo "🌐 Frontend: http://localhost:5173 (Professional Career Discovery)"
echo "📡 Backend API: http://localhost:8000 (University & Career Data)"
echo "📚 API Docs: http://localhost:8000/docs (Interactive Documentation)"
echo ""
echo "🌟 Professional Features Ready:"
echo "   • 30+ International Universities (Harvard, Oxford, MIT, etc.)"
echo "   • Secure User Authentication & Profiles"
echo "   • Advanced Search & Filtering System" 
echo "   • 200+ Courses across all major fields"
echo "   • 100+ Career Paths with salary data"
echo "   • Beautiful Responsive Design"
echo ""
echo "💡 Demo: Use any email/password to sign in"
echo "🔄 Press Ctrl+C to stop both servers"

# Wait for user input
wait