@echo off
TITLE TomatoCare AI - Launcher
echo ========================================================
echo       TomatoCare AI - Automated System Launcher
echo ========================================================
echo.
echo [1/3] Starting FastAPI Backend (Port 8000)...
start "TomatoCare Backend API" cmd /k "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000"

echo [2/3] Starting Next.js Production Frontend (Port 3000)...
start "TomatoCare Web Frontend" cmd /k "cd frontend && npm run start -- -p 3000"

echo [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo Opening browser at http://localhost:3000...
start http://localhost:3000

echo.
echo ========================================================
echo TomatoCare AI is running successfully!
echo   Frontend : http://localhost:3000
echo   Backend  : http://127.0.0.1:8000
echo   API Docs : http://127.0.0.1:8000/docs
echo   Demo Specimen Folder: c:\wse\AgroAI\demo_samples\
echo ========================================================
echo (Keep the two console windows open during the presentation)
pause
