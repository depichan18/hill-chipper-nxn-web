@echo off
echo ================================================================
echo           Hill Cipher NxN - Complete Setup Script
echo ================================================================
echo.
echo This script will set up both the backend and frontend for you.
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://www.python.org/
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✓ Python and Node.js are installed
echo.

:: Setup Backend
echo [1/4] Setting up Python backend...
cd backend
echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
cd ..
echo ✓ Backend dependencies installed

:: Setup Frontend
echo.
echo [2/4] Setting up React frontend...
echo Installing React dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install React dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed

echo.
echo [3/4] Setup complete! 
echo.
echo [4/4] Next steps:
echo.
echo 1. Open TWO command prompt windows
echo 2. In the FIRST window, run:  start-backend.bat
echo 3. In the SECOND window, run: start-frontend.bat
echo 4. Open your browser to: http://localhost:3000
echo.
echo OR simply:
echo 1. Double-click start-backend.bat
echo 2. Double-click start-frontend.bat
echo 3. Open browser to http://localhost:3000
echo.
echo ================================================================
echo 🔐 Hill Cipher NxN is ready to use!
echo ================================================================
echo.
pause
