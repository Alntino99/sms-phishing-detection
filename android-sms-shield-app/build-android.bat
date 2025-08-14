@echo off
echo 🚀 Building SMS Shield Android App...
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo 🔧 Building Android APK...
call npx expo run:android --variant release

echo.
echo ✅ Build complete! Check the android/app/build/outputs/apk/release/ folder for your APK.
pause
