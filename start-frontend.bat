@echo off
echo ================================================
echo Hill Cipher NxN - Frontend Setup
echo ================================================
echo.

echo Installing React dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install React dependencies
    echo Please make sure Node.js and npm are installed
    pause
    exit /b 1
)

echo.
echo React dependencies installed successfully!
echo.
echo Starting React development server...
echo Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo ================================================
npm start

pause
