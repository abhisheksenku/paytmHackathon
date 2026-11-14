@echo off
TITLE Vyapaar AI 2.0 - Launcher
echo ========================================================
echo   Launching Vyapaar AI 2.0 (Paytm Edition)
echo   Merchant Growth AI - Hyderabad Hackathon
echo ========================================================
echo.

echo Starting Backend Server (FastAPI on Port 8000)...
start "Vyapaar AI - Backend API" cmd /k "cd /d "%~dp0backend" && .\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

ping -n 4 127.0.0.1 >nul

echo Starting Frontend Server (Next.js on Port 3000)...
start "Vyapaar AI - Frontend UI" cmd /k "cd /d "%~dp0frontend" && npm run dev"

ping -n 5 127.0.0.1 >nul

echo Opening browser at http://localhost:3000...
start http://localhost:3000

echo.
echo ========================================================
echo   Vyapaar AI is now LIVE!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000/docs
echo ========================================================
