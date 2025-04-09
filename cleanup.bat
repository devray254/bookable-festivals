
@echo off
echo Running cleanup with elevated permissions...
echo This will close all Node.js processes and clean up your project

:: Kill any Node processes that might be locking files
taskkill /F /IM node.exe /T

:: Try to remove node_modules using various methods
echo Removing node_modules folder...
rd /s /q node_modules
if exist node_modules (
  echo Trying with rimraf...
  npx rimraf node_modules
)

:: Remove package-lock.json
echo Removing package-lock.json...
del /f package-lock.json

:: Clear npm cache
echo Clearing npm cache...
npm cache clean --force

:: Reinstall dependencies
echo Reinstalling dependencies...
npm install --no-optional --no-audit --no-fund

echo Cleanup complete!
pause
