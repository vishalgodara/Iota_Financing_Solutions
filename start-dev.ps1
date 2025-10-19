# PowerShell script to start both backend and frontend servers
# Usage: .\start-dev.ps1

Write-Host "🚀 Starting Iota Financial Solutions Development Environment..." -ForegroundColor Cyan
Write-Host ""

# Navigate to project root
$projectRoot = $PSScriptRoot
if (-not $projectRoot) {
    $projectRoot = Get-Location
}
Set-Location $projectRoot

# Start backend server in a new window
Write-Host "📦 Starting Backend Server (port 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js" -WindowStyle Normal

# Give backend a moment to start
Start-Sleep -Seconds 2

# Start frontend server in current window
Write-Host "⚛️  Starting Frontend Server (Vite)..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend is running in a separate window" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the frontend server" -ForegroundColor Yellow
Write-Host ""

npm run dev
