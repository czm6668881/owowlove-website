#!/usr/bin/env node

/**
 * 提交Google OAuth更改到版本控制
 */

const { execSync } = require('child_process')

console.log('📝 准备提交Google OAuth更改到版本控制...\n')

try {
  // 检查Git状态
  console.log('🔍 检查Git状态...')
  const status = execSync('git status --porcelain', { encoding: 'utf8' })
  
  if (status.trim() === '') {
    console.log('✅ 没有需要提交的更改')
    process.exit(0)
  }
  
  console.log('📋 待提交的文件:')
  console.log(status)
  
  // 添加所有更改
  console.log('➕ 添加所有更改...')
  execSync('git add .', { stdio: 'inherit' })
  
  // 提交更改
  const commitMessage = `feat: Add Google OAuth login functionality

✨ Features:
- Add Google OAuth login button to login page
- Implement real Google OAuth authentication
- Support both development and production environments
- Add comprehensive error handling and debugging

🔧 Technical Changes:
- Update login page with Google login button
- Configure Google OAuth routes and callbacks
- Add user authentication context support
- Update Next.js config for Google domains
- Set up production environment variables

🚀 Production Ready:
- Google Client ID: 199362477002-3nju7kir8s7am6ia9qq1takrb5ub1ba6
- Configured for owowlove.com domain
- Free Google OAuth service integration

📋 Files Modified:
- app/[lang]/login/page.tsx
- app/api/auth/google/route.ts
- app/api/auth/google/callback/route.ts
- contexts/user-auth-context.tsx
- next.config.mjs
- .env.production

🧪 Testing:
- Local testing: http://localhost:3001/en/login
- Production testing: https://owowlove.com/en/login
- Test pages: /en/test-google-oauth, /en/simple-login

Co-authored-by: Augment Agent <agent@augmentcode.com>`

  console.log('💾 提交更改...')
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' })
  
  console.log('\n🎉 更改已成功提交到版本控制！')
  console.log('\n📋 下一步操作：')
  console.log('1. 推送到远程仓库: git push origin main')
  console.log('2. 在Google Cloud Console中添加生产环境重定向URI')
  console.log('3. 部署到生产服务器')
  console.log('4. 测试Google登录功能')
  
} catch (error) {
  console.error('❌ 提交失败:', error.message)
  process.exit(1)
}
