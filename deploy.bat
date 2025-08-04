@echo off
setlocal enabledelayedexpansion

echo 🚀 Preparing SMS Phishing Detection App for Vercel Deployment...

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Not in a git repository. Please initialize git first:
    echo    git init
    echo    git add .
    echo    git commit -m "Initial commit"
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Check current status
echo 📋 Current git status:
git status --porcelain

REM Ask user if they want to commit changes
set /p commit_changes="🤔 Do you want to commit any uncommitted changes? (y/n): "
if /i "!commit_changes!"=="y" (
    echo 📝 Committing changes...
    git add .
    set /p commit_message="💬 Enter commit message: "
    if "!commit_message!"=="" set commit_message=Update for deployment
    git commit -m "!commit_message!"
)

REM Check if user is logged into Vercel
echo 🔐 Checking Vercel login status...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔑 Please log in to Vercel...
    vercel login
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🌐 Your app should now be live at the URL provided above.
echo.
echo 📋 Next steps:
echo 1. Test your deployed app
echo 2. Configure custom domain (optional)
echo 3. Set up environment variables if needed
echo 4. Monitor your app's performance
echo.
echo 📚 For more information, see VERCEL_DEPLOYMENT.md
pause 