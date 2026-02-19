@echo off
title PPT Tool - First Time Setup

REM Move to project root (where this file exists)
cd /d "%~dp0"

echo ========================================
echo Setting up PPT Generation Tool...
echo ========================================

REM ===============================
REM BACKEND SETUP
REM ===============================

echo.
echo Setting up Backend...

cd backend

REM Create virtual environment if it doesn't exist
if not exist .venv (
    echo Creating virtual environment...
    python -m venv .venv
)

REM Activate virtual environment
call .venv\Scripts\activate

REM Upgrade pip
python -m pip install --upgrade pip

REM Install all dependencies from requirements.txt
if exist requirements.txt (
    echo Installing backend dependencies...
    pip install -r requirements.txt
) else (
    echo ERROR: requirements.txt not found!
    pause
    exit
)

cd ..

REM ===============================
REM FRONTEND SETUP
REM ===============================

echo.
echo Setting up Frontend...

if exist package.json (
    npm install
) else (
    echo ERROR: package.json not found in root!
    pause
    exit
)

echo.
echo ========================================
echo Setup Complete Successfully!
echo Now run: run.bat
echo ========================================

pause
