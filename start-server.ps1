# PowerShell script to start HTTP server
Write-Host "Starting HTTP server for SMS Phishing Detection..." -ForegroundColor Green

# Change to the project directory
Set-Location "C:\Users\Ntino\Desktop\End of year project\N-pro"

# Start Python HTTP server
Write-Host "Server will be available at: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Red

# Start the server
python -m http.server 8000 