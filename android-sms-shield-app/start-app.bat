@echo off
echo Starting SMS Shield App with Expo Go...
echo.
echo Make sure you have Expo Go installed on your phone!
echo.
echo 1. Download Expo Go from:
echo    Android: https://play.google.com/store/apps/details?id=host.exp.exponent
echo    iOS: https://apps.apple.com/app/expo-go/id982107779
echo.
echo 2. Scan the QR code that appears below
echo.
echo 3. Your app will load on your phone!
echo.
pause
npx expo start --tunnel
