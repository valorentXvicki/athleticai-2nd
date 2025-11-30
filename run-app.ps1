# Athletic Spirit App Launcher
# Run this script to start the app locally

Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green

Write-Host "  Athletic Spirit - AI Fitness Coaching Platform" -ForegroundColor Cyan
Write-Host "  Starting Application..." -ForegroundColor Yellow

Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green -NoNewline
Write-Host "=" -ForegroundColor Green

Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please download Node.js from https://nodejs.org/" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✓ Node.js found: $(node -v)" -ForegroundColor Green
Write-Host "✓ npm found: $(npm -v)" -ForegroundColor Green
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "App will be available at: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Start the app
npm run dev
