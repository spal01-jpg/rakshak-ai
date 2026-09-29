@echo off
title Rakshak AI (रक्षक AI) - Tactical Welfare System Launcher
color 0B
cls
echo ===============================================================================
echo                      RAKSHAK AI (रक्षक AI)
echo           Tactical Welfare & Physiological Stress Monitoring Platform
echo ===============================================================================
echo.
echo [1/3] Checking environment & server status...

set PYTHON_CMD=python
if exist ".venv\Scripts\python.exe" (
    set PYTHON_CMD=.venv\Scripts\python.exe
)

netstat -ano | findstr ":8000" | findstr "LISTENING" >nul
if %errorlevel% == 0 (
    echo [OK] Backend server is already running on http://127.0.0.1:8000
) else (
    echo [2/3] Launching Rakshak AI backend API server...
    start /B "" %PYTHON_CMD% -m uvicorn server:app --host 127.0.0.1 --port 8000
    timeout /t 3 /nobreak >nul
)

echo [3/3] Opening Rakshak AI Desktop Application Window...
set BROWSER_CMD=
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_CMD=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
    set "BROWSER_CMD=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
) else if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_CMD=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
) else if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
    set "BROWSER_CMD=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
)

if defined BROWSER_CMD (
    start "" "%BROWSER_CMD%" --app=http://127.0.0.1:8000 --window-size=1440,920
) else (
    start http://127.0.0.1:8000
)

echo.
echo ===============================================================================
echo Rakshak AI is running! Press any key or close this terminal to dismiss.
echo ===============================================================================
