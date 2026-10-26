@echo off
setlocal
cd /d "%~dp0"

netstat -ano | findstr /R /C:":8765 .*LISTENING" >nul
if not errorlevel 1 (
  start "" "http://127.0.0.1:8765/admin"
  exit /b 0
)

start "ITECH Fix Local Server" /min cmd /k "py -3 backend\server.py"

for /L %%I in (1,1,15) do (
  curl.exe --silent --fail --max-time 1 http://127.0.0.1:8765/api/status >nul 2>&1
  if not errorlevel 1 goto open_admin
  ping -n 2 127.0.0.1 >nul
)

:open_admin
start "" "http://127.0.0.1:8765/admin"
