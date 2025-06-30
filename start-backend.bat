@echo off
echo ================================================
echo Hill Cipher NxN - Backend Setup
echo ================================================
echo.

echo Installing Python dependencies...
cd backend
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ERROR: Failed to install Python dependencies
    echo Please make sure Python and pip are installed
    pause
    exit /b 1
)

echo.
echo Python dependencies installed successfully!
echo.
echo Starting Flask backend server...
echo Backend will be available at: http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ================================================
python app.py

pause
