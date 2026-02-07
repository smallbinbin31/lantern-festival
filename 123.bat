@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo ======================================
echo   Lantern Festival Website Server
echo ======================================
echo.
echo Starting HTTP Server on port 8000...
echo.
echo Open browser: http://localhost:8000
echo.
echo Press Ctrl+C to stop server
echo.
python -m http.server 8000 -d public
pause