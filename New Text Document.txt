@echo off
title PPT Generation Tool Launcher

REM Move to this .bat file directory
cd /d "%~dp0"

echo ========================================
echo Starting PPT Generation Tool...
echo ========================================

REM ===============================
REM BACKEND
REM ===============================

start "Backend Server" cmd /k "cd backend & python main.py"

REM ===============================
REM FRONTEND
REM ===============================

start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo ========================================

pause
