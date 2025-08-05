@echo off
echo ========================================
echo 🚀 DEPLOYING TO VERCEL - SMS PHISHING DETECTION
echo ========================================

echo.
echo 📋 Checking for Vercel CLI...
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
) else (
    echo ✅ Vercel CLI found
)

echo.
echo 🔧 Preparing deployment...
echo ✅ Fixed files included:
echo   - mobile-sms-detector-fixed.js
echo   - firebase-fixed.js  
echo   - sw-fixed.js
echo   - test-fixes.html

echo.
echo 📦 Deploying to Vercel...
vercel --prod

echo.
echo 🎉 Deployment completed!
echo 📱 Your SMS Phishing Detection System is now live with all fixes!
echo.
echo 🔗 Check your Vercel dashboard for the live URL
echo 📊 Test the fixes at: your-url/test-fixes
echo.
pause 