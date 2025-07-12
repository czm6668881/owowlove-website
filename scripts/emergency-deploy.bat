@echo off
REM 紧急生产环境部署脚本 (Windows)
REM 修复 Footer 链接和图片 API 问题

echo 🚨 Emergency Production Deployment Starting...
echo 📅 %date% %time%

REM 检查是否有未提交的更改
git status --porcelain > temp_status.txt
for /f %%i in ("temp_status.txt") do set size=%%~zi
if %size% gtr 0 (
    echo 📝 Uncommitted changes detected. Committing...
    git add .
    git commit -m "Emergency fix: Footer links and image API for production"
    echo ✅ Changes committed
) else (
    echo ✅ No uncommitted changes
)
del temp_status.txt

REM 推送到远程仓库
echo 📤 Pushing to remote repository...
git push origin main
if %errorlevel% equ 0 (
    echo ✅ Successfully pushed to remote
) else (
    echo ❌ Failed to push to remote
    pause
    exit /b 1
)

REM 检查生产环境文件
echo 🔍 Checking production files...

REM 检查 Footer 组件
findstr /c:"shipping-info" components\footer.tsx >nul
if %errorlevel% equ 0 (
    echo ✅ Footer component updated correctly
) else (
    echo ❌ Footer component not updated
)

REM 检查 Next.js 配置
findstr /c:"owowlove.com" next.config.mjs >nul
if %errorlevel% equ 0 (
    echo ✅ Next.js config includes production domain
) else (
    echo ❌ Next.js config missing production domain
)

REM 构建生产版本
echo 🏗️ Building production version...
call npm run build
if %errorlevel% equ 0 (
    echo ✅ Build successful
) else (
    echo ❌ Build failed
    pause
    exit /b 1
)

REM 部署到生产环境（如果使用 PM2）
where pm2 >nul 2>nul
if %errorlevel% equ 0 (
    echo 🚀 Deploying with PM2...
    pm2 restart owowlove-production
    if %errorlevel% equ 0 (
        echo ✅ PM2 deployment successful
    ) else (
        echo ❌ PM2 deployment failed
    )
) else (
    echo ⚠️ PM2 not found, manual deployment required
)

REM 验证部署
echo 🔍 Verifying deployment...
timeout /t 5 /nobreak >nul

REM 检查服务状态
where pm2 >nul 2>nul
if %errorlevel% equ 0 (
    pm2 status owowlove-production
)

echo 🎯 Emergency deployment completed!
echo 📋 Next steps:
echo 1. Check https://owowlove.com for Footer links
echo 2. Verify image loading on the homepage
echo 3. Monitor server logs for any errors
echo 4. Run health check: npm run health-check

echo 🔗 Quick verification URLs:
echo - Homepage: https://owowlove.com/en
echo - Image API: https://owowlove.com/api/image/product-1752080189101.jpeg
echo - Shipping Info: https://owowlove.com/en/shipping-info

pause
