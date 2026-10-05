@echo off
TITLE TomatoCare AI - Shutdown
echo Stopping TomatoCare AI services...
powershell -Command "Get-Process -Name python, node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*uvicorn*' -or $_.CommandLine -like '*next*' } | Stop-Process -Force"
echo All TomatoCare AI services stopped.
pause
