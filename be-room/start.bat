@echo off
echo 🚀 Starting Meeting Room System...

echo 📡 Starting Backend Server...
cd be-room
start "Backend" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend...
cd ..\GSS
start "Frontend" cmd /k "npm run dev"

echo ✅ System Started!
echo 📡 Backend: http://localhost:3000
echo 🎨 Frontend: http://localhost:5173
echo 📖 API Docs: http://localhost:3000/api-docs

pause