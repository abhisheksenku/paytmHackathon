@echo off
TITLE Vyapaar AI 2.0 - Launcher
echo ========================================================
echo   Launching Vyapaar AI 2.0 (Paytm Edition)
echo   Merchant Growth AI - Hyderabad Hackathon
echo ========================================================
echo.

echo Starting Backend Server (FastAPI on Port 8000)...
start "Vyapaar AI - Backend API" cmd /k "cd backend && .\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server (Next.js on Port 3000)...
start "Vyapaar AI - Frontend UI" cmd /k "cd frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo Opening browser at http://localhost:3000...
start http://localhost:3000

echo.
echo ========================================================
echo   Vyapaar AI is now LIVE!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:8000/docs
echo ========================================================
pause
