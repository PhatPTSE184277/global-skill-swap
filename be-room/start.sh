#!/bin/bash

echo "🚀 Starting Meeting Room System..."

# Start Backend
echo "📡 Starting Backend Server..."
cd be-room
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting Frontend..."
cd ../GSS
npm run dev &
FRONTEND_PID=$!

echo "✅ System Started!"
echo "📡 Backend: http://localhost:3000"
echo "🎨 Frontend: http://localhost:5173"
echo "📖 API Docs: http://localhost:3000/api-docs"

# Function to cleanup on exit
cleanup() {
  echo "🛑 Stopping servers..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  exit
}

# Setup trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID