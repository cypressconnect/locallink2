@echo off
rem Double-click to run Local Link. Installs the packages the first time, starts
rem the site and opens it in your browser. Close this window to stop the site.
cd /d "%~dp0local-link"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download the LTS version from https://nodejs.org,
  echo install it, then double-click this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing packages ^(first run only, takes a minute^)...
  call npm install
  if errorlevel 1 (
    echo Install failed.
    pause
    exit /b 1
  )
)

call npm run dev -- --open
pause
