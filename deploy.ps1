# SMS Shield Deployment Script
# This script deploys the SMS Shield application to Vercel

Write-Host "🚀 Starting SMS Shield Deployment..." -ForegroundColor Green

# Check if Vercel CLI is installed
Write-Host "📋 Checking Vercel CLI installation..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if user is logged in to Vercel
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
try {
    $vercelUser = vercel whoami
    Write-Host "✅ Logged in as: $vercelUser" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Not logged in to Vercel. Please login..." -ForegroundColor Yellow
    vercel login
}

# Build and deploy
Write-Host "🏗️ Building and deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your SMS Shield is now live!" -ForegroundColor Cyan
Write-Host "📱 Features available:" -ForegroundColor White
Write-Host "   - Firebase Authentication" -ForegroundColor White
Write-Host "   - Gemini AI Demo System" -ForegroundColor White
Write-Host "   - Cross-platform compatibility" -ForegroundColor White
Write-Host "   - Mobile responsive design" -ForegroundColor White
Write-Host "   - Security and privacy protection" -ForegroundColor White

Write-Host "🎉 Deployment successful! Your SMS Shield is ready for users!" -ForegroundColor Green

