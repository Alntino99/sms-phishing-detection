# Android Build Setup Script for SMS Shield App
Write-Host "🚀 Setting up Android Build Environment..." -ForegroundColor Green

# Check if Chocolatey is installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Chocolatey package manager..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install Android Studio and SDK
Write-Host "📱 Installing Android Studio and SDK..." -ForegroundColor Yellow
choco install androidstudio -y

# Install Gradle
Write-Host "🔧 Installing Gradle..." -ForegroundColor Yellow
choco install gradle -y

# Set environment variables
Write-Host "⚙️ Setting up environment variables..." -ForegroundColor Yellow
$androidHome = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$androidSdkRoot = $androidHome

# Add to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$newPaths = @(
    "$androidHome\platform-tools",
    "$androidHome\tools",
    "$androidHome\tools\bin",
    "$androidHome\emulator"
)

foreach ($path in $newPaths) {
    if ($currentPath -notlike "*$path*") {
        $currentPath = "$currentPath;$path"
    }
}

[Environment]::SetEnvironmentVariable("PATH", $currentPath, "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $androidHome, "User")
[Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", $androidSdkRoot, "User")

Write-Host "✅ Android build environment setup complete!" -ForegroundColor Green
Write-Host "📱 Android SDK Location: $androidHome" -ForegroundColor Cyan
Write-Host "🔄 Please restart your terminal and run the build script again." -ForegroundColor Yellow

# Install project dependencies
Write-Host "📦 Installing project dependencies..." -ForegroundColor Yellow
npm install

Write-Host "🎉 Setup complete! You can now build your Android app." -ForegroundColor Green
