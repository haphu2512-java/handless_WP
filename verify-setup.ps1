# PowerShell verification script for Headless WordPress + Next.js setup

Write-Host "🔍 Headless WordPress Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "1️⃣ Checking Docker..." -ForegroundColor Yellow
try {
    $version = docker --version
    Write-Host "✅ Docker found: $version" -ForegroundColor Green
    Write-Host "   Running containers:" -ForegroundColor Gray
    docker ps --filter "label=com.docker.compose.project" --format "table {{.Names}}`t{{.Ports}}" | ForEach-Object { Write-Host "   $_" }
} catch {
    Write-Host "❌ Docker not found or not running" -ForegroundColor Red
}

Write-Host ""
Write-Host "2️⃣ Checking WordPress API..." -ForegroundColor Yellow

# Check WordPress status endpoint
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/wp-json/wp/v2/status" -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ WordPress API is running" -ForegroundColor Green
        Write-Host "   Status:" -ForegroundColor Gray
        $json = $response.Content | ConvertFrom-Json
        $json | ConvertTo-Json | ForEach-Object { Write-Host "   $_" -ForegroundColor Gray }
    }
} catch {
    Write-Host "❌ WordPress API not accessible" -ForegroundColor Red
    Write-Host "   Make sure: docker-compose up --build" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3️⃣ Checking CORS Headers..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/wp-json/wp/v2/posts" -Method Head -ErrorAction Stop
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    if ($corsHeader) {
        Write-Host "✅ CORS enabled" -ForegroundColor Green
        Write-Host "   Access-Control-Allow-Origin: $corsHeader" -ForegroundColor Gray
    } else {
        Write-Host "❌ CORS headers not found" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️ Cannot check headers (WordPress may not be running)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "4️⃣ Checking Services..." -ForegroundColor Yellow
Write-Host ""
Write-Host "   WordPress API:" -ForegroundColor Cyan
Write-Host "   - REST API: http://localhost:8000/wp-json/wp/v2/posts" -ForegroundColor Gray
Write-Host "   - Status: http://localhost:8000/wp-json/wp/v2/status" -ForegroundColor Gray
Write-Host ""
Write-Host "   Database Tools:" -ForegroundColor Cyan
Write-Host "   - phpMyAdmin: http://localhost:8080" -ForegroundColor Gray
Write-Host "   - MySQL Port: 3307" -ForegroundColor Gray
Write-Host ""
Write-Host "   Frontend:" -ForegroundColor Cyan
Write-Host "   - Next.js (when running): http://localhost:3000" -ForegroundColor Gray
Write-Host "   - Posts API: http://localhost:3000/api/posts" -ForegroundColor Gray
Write-Host ""

Write-Host "✅ Verification complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Start Next.js: cd apps/web && npm install && npm run dev" -ForegroundColor Gray
Write-Host "   2. Open http://localhost:3000 in browser" -ForegroundColor Gray
Write-Host "   3. Check console for any errors" -ForegroundColor Gray
Write-Host ""
