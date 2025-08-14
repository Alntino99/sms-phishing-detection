Write-Host "Starting SMS Shield App with Expo Go..." -ForegroundColor Green
Write-Host ""
Write-Host "Make sure you have Expo Go installed on your phone!" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Download Expo Go from:" -ForegroundColor Cyan
Write-Host "   Android: https://play.google.com/store/apps/details?id=host.exp.exponent" -ForegroundColor White
Write-Host "   iOS: https://apps.apple.com/app/expo-go/id982107779" -ForegroundColor White
Write-Host ""
Write-Host "2. Scan the QR code that appears below" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Your app will load on your phone!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to continue"
npx expo start --tunnel
