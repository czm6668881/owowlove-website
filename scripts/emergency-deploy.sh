#!/bin/bash

# 紧急生产环境部署脚本
# 修复 Footer 链接和图片 API 问题

echo "🚨 Emergency Production Deployment Starting..."
echo "📅 $(date)"

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Current branch: $CURRENT_BRANCH"

# 检查是否有未提交的更改
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Uncommitted changes detected. Committing..."
    git add .
    git commit -m "Emergency fix: Footer links and image API for production"
    echo "✅ Changes committed"
else
    echo "✅ No uncommitted changes"
fi

# 推送到远程仓库
echo "📤 Pushing to remote repository..."
git push origin $CURRENT_BRANCH
if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to remote"
else
    echo "❌ Failed to push to remote"
    exit 1
fi

# 检查生产环境文件
echo "🔍 Checking production files..."

# 检查 Footer 组件
if grep -q "shipping-info" components/footer.tsx; then
    echo "✅ Footer component updated correctly"
else
    echo "❌ Footer component not updated"
fi

# 检查 Next.js 配置
if grep -q "owowlove.com" next.config.mjs; then
    echo "✅ Next.js config includes production domain"
else
    echo "❌ Next.js config missing production domain"
fi

# 构建生产版本
echo "🏗️ Building production version..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# 部署到生产环境（如果使用 PM2）
if command -v pm2 &> /dev/null; then
    echo "🚀 Deploying with PM2..."
    pm2 restart owowlove-production
    if [ $? -eq 0 ]; then
        echo "✅ PM2 deployment successful"
    else
        echo "❌ PM2 deployment failed"
    fi
else
    echo "⚠️ PM2 not found, manual deployment required"
fi

# 验证部署
echo "🔍 Verifying deployment..."
sleep 5

# 检查服务状态
if command -v pm2 &> /dev/null; then
    pm2 status owowlove-production
fi

echo "🎯 Emergency deployment completed!"
echo "📋 Next steps:"
echo "1. Check https://owowlove.com for Footer links"
echo "2. Verify image loading on the homepage"
echo "3. Monitor server logs for any errors"
echo "4. Run health check: npm run health-check"

echo "🔗 Quick verification URLs:"
echo "- Homepage: https://owowlove.com/en"
echo "- Image API: https://owowlove.com/api/image/product-1752080189101.jpeg"
echo "- Shipping Info: https://owowlove.com/en/shipping-info"
