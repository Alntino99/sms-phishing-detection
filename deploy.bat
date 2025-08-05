@echo off
echo Starting deployment process...

echo.
echo Step 1: Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed
    pause
    exit /b 1
)

echo.
echo Step 2: Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 3: Deploying to Vercel...
npx vercel --prod
if %errorlevel% neq 0 (
    echo Error: Deployment failed
    pause
    exit /b 1
)

echo.
echo Deployment completed successfully!
echo.
echo Your app is now live at the URL shown above.
echo.
pause 