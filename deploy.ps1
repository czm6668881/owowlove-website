# OWOWLOVE.COM Production Deployment Script for Windows
# PowerShell script to deploy the application to production

param(
    [switch]$Build = $false,
    [switch]$Start = $false,
    [switch]$Stop = $false,
    [switch]$Restart = $false,
    [switch]$Status = $false,
    [switch]$Logs = $false
)

$ProjectName = "owowlove-production"
$LogDir = "logs"

# 创建日志目录
if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir
    Write-Host "Created logs directory" -ForegroundColor Green
}

# 检查PM2是否安装
function Check-PM2 {
    try {
        pm2 --version | Out-Null
        return $true
    }
    catch {
        Write-Host "PM2 not found. Installing PM2..." -ForegroundColor Yellow
        npm install -g pm2
        return $true
    }
}

# 构建应用
function Build-App {
    Write-Host "Building application for production..." -ForegroundColor Blue
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Build failed!" -ForegroundColor Red
        exit 1
    }
}

# 启动应用
function Start-App {
    Write-Host "Starting application..." -ForegroundColor Blue
    pm2 start ecosystem.config.js --env production
    pm2 save
    Write-Host "Application started!" -ForegroundColor Green
}

# 停止应用
function Stop-App {
    Write-Host "Stopping application..." -ForegroundColor Blue
    pm2 stop $ProjectName
    Write-Host "Application stopped!" -ForegroundColor Green
}

# 重启应用
function Restart-App {
    Write-Host "Restarting application..." -ForegroundColor Blue
    pm2 restart $ProjectName
    Write-Host "Application restarted!" -ForegroundColor Green
}

# 查看状态
function Show-Status {
    Write-Host "Application status:" -ForegroundColor Blue
    pm2 status
    pm2 monit
}

# 查看日志
function Show-Logs {
    Write-Host "Showing application logs..." -ForegroundColor Blue
    pm2 logs $ProjectName --lines 50
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

# 主逻辑
if (!(Check-PM2)) {
    Write-Host "Failed to install PM2" -ForegroundColor Red
    exit 1
}

if ($Build) {
    Build-App
}

if ($Stop) {
    Stop-App
}

if ($Start) {
    Start-App
    Start-Sleep -Seconds 3
    if (Test-Service) {
        Show-DeploymentSummary
    }
}

if ($Restart) {
    Restart-App
}

if ($Status) {
    Show-Status
}

if ($Logs) {
    Show-Logs
}

# 如果没有参数，显示帮助
if (!$Build -and !$Start -and !$Stop -and !$Restart -and !$Status -and !$Logs) {
    Write-Host @"
OWOWLOVE.COM Production Deployment Script

Usage:
  .\deploy.ps1 -Build          Build the application
  .\deploy.ps1 -Start          Start the application
  .\deploy.ps1 -Stop           Stop the application
  .\deploy.ps1 -Restart        Restart the application
  .\deploy.ps1 -Status         Show application status
  .\deploy.ps1 -Logs           Show application logs

Examples:
  .\deploy.ps1 -Build -Start   Build and start the application
  .\deploy.ps1 -Restart        Restart the running application
"@ -ForegroundColor Cyan
}
