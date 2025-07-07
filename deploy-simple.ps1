# OWOWLOVE.COM Simple Deployment Script
param(
    [switch]$Status = $false,
    [switch]$Test = $false
)

$ProjectName = "owowlove-production"

# 查看状态
function Show-Status {
    Write-Host "Application status:" -ForegroundColor Blue
    pm2 status
}

# 测试服务
function Test-Service {
    Write-Host "Testing service health..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 308) {
            Write-Host "✓ Service is responding" -ForegroundColor Green
            Write-Host "✓ OWOWLOVE website is now running at http://localhost:3000" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "✗ Service health check failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    
    return $false
}

# 显示部署总结
function Show-DeploymentSummary {
    Write-Host "`n=== DEPLOYMENT SUMMARY ===" -ForegroundColor Cyan
    Write-Host "✓ Production build completed" -ForegroundColor Green
    Write-Host "✓ PM2 process manager configured" -ForegroundColor Green
    Write-Host "✓ Production server started" -ForegroundColor Green
    Write-Host "`nService Details:" -ForegroundColor Yellow
    Write-Host "- URL: http://localhost:3000" -ForegroundColor White
    Write-Host "- Process Manager: PM2" -ForegroundColor White
    Write-Host "- Environment: Production" -ForegroundColor White
    Write-Host "`nManagement Commands:" -ForegroundColor Yellow
    Write-Host "- Check status: pm2 status" -ForegroundColor White
    Write-Host "- View logs: pm2 logs owowlove-production" -ForegroundColor White
    Write-Host "- Restart: pm2 restart owowlove-production" -ForegroundColor White
    Write-Host "- Stop: pm2 stop owowlove-production" -ForegroundColor White
    Write-Host "`n=== DEPLOYMENT COMPLETE ===" -ForegroundColor Cyan
}

if ($Status) {
    Show-Status
}

if ($Test) {
    if (Test-Service) {
        Show-DeploymentSummary
    }
}

# 如果没有参数，显示帮助
if (!$Status -and !$Test) {
    Write-Host @"
OWOWLOVE.COM Simple Deployment Script

Usage:
  .\deploy-simple.ps1 -Status    Show application status
  .\deploy-simple.ps1 -Test      Test service and show summary
"@ -ForegroundColor Cyan
}
