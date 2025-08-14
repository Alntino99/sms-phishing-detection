# SMS Shield - Real SMS Setup Script
# This script helps set up the development build for real SMS access

Write-Host "🚀 SMS Shield - Real SMS Setup" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found." -ForegroundColor Red
    exit 1
}

# Check if Expo CLI is installed
Write-Host "`n🔧 Checking Expo CLI..." -ForegroundColor Yellow
try {
    $expoVersion = expo --version
    Write-Host "✅ Expo CLI: $expoVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Expo CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @expo/cli
}

# Check if EAS CLI is installed
Write-Host "`n🔧 Checking EAS CLI..." -ForegroundColor Yellow
try {
    $easVersion = eas --version
    Write-Host "✅ EAS CLI: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  EAS CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g eas-cli
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Check if user is logged into Expo
Write-Host "`n🔐 Checking Expo login..." -ForegroundColor Yellow
try {
    $expoWhoami = expo whoami
    Write-Host "✅ Logged in as: $expoWhoami" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Not logged into Expo. Please login:" -ForegroundColor Yellow
    Write-Host "   Run: expo login" -ForegroundColor Cyan
    Write-Host "   Or: eas login" -ForegroundColor Cyan
}

# Display next steps
Write-Host "`n🎯 Next Steps:" -ForegroundColor Green
Write-Host "=============" -ForegroundColor Green
Write-Host "1. Login to Expo: expo login" -ForegroundColor Cyan
Write-Host "2. Build development version: eas build --platform android --profile development" -ForegroundColor Cyan
Write-Host "3. Download and install the APK on your Android device" -ForegroundColor Cyan
Write-Host "4. Grant SMS permissions when prompted" -ForegroundColor Cyan
Write-Host "5. Test with real SMS messages" -ForegroundColor Cyan

Write-Host "`n📚 For detailed instructions, see: REAL_SMS_SETUP.md" -ForegroundColor Yellow
Write-Host "📱 For Expo Go testing, see: EXPO_GO_SETUP.md" -ForegroundColor Yellow

Write-Host "`n✅ Setup complete! Ready to build development version." -ForegroundColor Green
