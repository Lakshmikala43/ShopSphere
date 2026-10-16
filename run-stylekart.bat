@echo off
title StyleKart AI Marketplace Launcher
echo =======================================================
echo          Starting StyleKart AI Marketplace...
echo =======================================================
echo.

set PATH=C:\Users\WINDOWS\.gemini\antigravity\scratch\node_bin\node-v20.18.0-win-x64;%PATH%
set NODE_TLS_REJECT_UNAUTHORIZED=0

echo Opening web browser to http://localhost:3000...
start http://localhost:3000

echo Starting StyleKart AI Server...
npm run start

pause
