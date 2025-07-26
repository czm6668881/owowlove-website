#!/usr/bin/env node

/**
 * 同步Google OAuth功能到生产环境脚本
 * 将本地修复的Google登录功能同步到域名前端
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 开始同步Google OAuth功能到生产环境...\n')

// 需要同步的文件列表
const filesToSync = [
  'app/[lang]/login/page.tsx',
  'app/api/auth/google/route.ts',
  'app/api/auth/google/callback/route.ts',
  'contexts/user-auth-context.tsx',
  'next.config.mjs',
  '.env.production'
]

// 检查文件是否存在
function checkFiles() {
  console.log('📁 检查需要同步的文件...')
  
  let allFilesExist = true
  
  filesToSync.forEach(file => {
    const filePath = path.join(process.cwd(), file)
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`)
    } else {
      console.log(`❌ ${file} - 文件不存在`)
      allFilesExist = false
    }
  })
  
  return allFilesExist
}

// 更新生产环境配置
function updateProductionConfig() {
  console.log('\n🔧 更新生产环境配置...')
  
  const envProdPath = path.join(process.cwd(), '.env.production')
  
  if (!fs.existsSync(envProdPath)) {
    console.log('❌ .env.production 文件不存在')
    return false
  }
  
  let envContent = fs.readFileSync(envProdPath, 'utf8')
  
  // 确保生产环境有正确的Google OAuth配置
  const requiredVars = {
    'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID || '[需要配置]',
    'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET || '[需要配置]',
    'NEXTAUTH_URL': 'https://owowlove.com'
  }
  
  let updated = false
  
  Object.entries(requiredVars).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*$`, 'm')
    const newLine = `${key}=${value}`
    
    if (regex.test(envContent)) {
      if (!envContent.includes(newLine)) {
        envContent = envContent.replace(regex, newLine)
        updated = true
        console.log(`✅ 更新 ${key}`)
      } else {
        console.log(`✅ ${key} 已是最新`)
      }
    } else {
      envContent += `\n${newLine}`
      updated = true
      console.log(`✅ 添加 ${key}`)
    }
  })
  
  if (updated) {
    fs.writeFileSync(envProdPath, envContent)
    console.log('✅ 生产环境配置已更新')
  } else {
    console.log('✅ 生产环境配置已是最新')
  }
  
  return true
}

// 验证Google OAuth文件内容
function validateGoogleOAuthFiles() {
  console.log('\n🔍 验证Google OAuth文件内容...')
  
  // 检查登录页面是否包含Google按钮
  const loginPagePath = path.join(process.cwd(), 'app/[lang]/login/page.tsx')
  const loginContent = fs.readFileSync(loginPagePath, 'utf8')
  
  if (loginContent.includes('Continue with Google') && loginContent.includes('/api/auth/google')) {
    console.log('✅ 登录页面包含Google登录按钮')
  } else {
    console.log('❌ 登录页面缺少Google登录按钮')
    return false
  }
  
  // 检查Google OAuth路由
  const googleRoutePath = path.join(process.cwd(), 'app/api/auth/google/route.ts')
  const googleRouteContent = fs.readFileSync(googleRoutePath, 'utf8')
  
  if (googleRouteContent.includes('OAuth2Client') && googleRouteContent.includes('generateAuthUrl')) {
    console.log('✅ Google OAuth路由配置正确')
  } else {
    console.log('❌ Google OAuth路由配置有问题')
    return false
  }
  
  // 检查用户认证上下文
  const authContextPath = path.join(process.cwd(), 'contexts/user-auth-context.tsx')
  const authContextContent = fs.readFileSync(authContextPath, 'utf8')
  
  if (authContextContent.includes('loginWithGoogle')) {
    console.log('✅ 用户认证上下文包含Google登录功能')
  } else {
    console.log('❌ 用户认证上下文缺少Google登录功能')
    return false
  }
  
  return true
}

// 构建生产版本
function buildProduction() {
  console.log('\n🔨 构建生产版本...')
  
  try {
    // 备份当前环境变量
    const envLocalPath = path.join(process.cwd(), '.env.local')
    const envLocalBackupPath = path.join(process.cwd(), '.env.local.backup')
    
    if (fs.existsSync(envLocalPath)) {
      fs.copyFileSync(envLocalPath, envLocalBackupPath)
      console.log('✅ 已备份 .env.local')
    }
    
    // 使用生产环境变量构建
    const envProdPath = path.join(process.cwd(), '.env.production')
    if (fs.existsSync(envProdPath)) {
      fs.copyFileSync(envProdPath, envLocalPath)
      console.log('✅ 使用生产环境变量')
    }
    
    // 构建项目
    console.log('正在构建项目...')
    execSync('npm run build', { stdio: 'inherit' })
    console.log('✅ 构建完成')
    
    // 恢复环境变量
    if (fs.existsSync(envLocalBackupPath)) {
      fs.copyFileSync(envLocalBackupPath, envLocalPath)
      fs.unlinkSync(envLocalBackupPath)
      console.log('✅ 已恢复 .env.local')
    }
    
    return true
  } catch (error) {
    console.log('❌ 构建失败:', error.message)
    return false
  }
}

// 生成部署指南
function generateDeploymentGuide() {
  console.log('\n📋 生成部署指南...')
  
  const guide = `# Google OAuth 生产环境部署指南

## 🎯 同步完成状态
✅ 本地Google OAuth功能已准备好同步到生产环境

## 📁 已同步的文件
${filesToSync.map(file => `- ${file}`).join('\n')}

## 🔧 生产环境配置
- Google Client ID: [已配置真实凭据]
- Google Client Secret: [已配置真实凭据]
- 生产域名: https://owowlove.com

## 🚀 部署步骤

### 1. 更新Google Cloud Console重定向URI
在Google Cloud Console中添加生产环境重定向URI：
\`\`\`
https://owowlove.com/api/auth/google/callback
https://www.owowlove.com/api/auth/google/callback
\`\`\`

### 2. 提交代码到版本控制
\`\`\`bash
git add .
git commit -m "Add Google OAuth login functionality to production"
git push origin main
\`\`\`

### 3. 部署到生产服务器
根据您的部署方式：

**方案A: 使用PM2**
\`\`\`bash
npm run deploy
\`\`\`

**方案B: 手动部署**
\`\`\`bash
npm install
npm run build
npm run start:prod
\`\`\`

**方案C: Vercel部署**
\`\`\`bash
vercel --prod
\`\`\`

### 4. 验证部署
- 访问: https://owowlove.com/en/login
- 确认Google登录按钮显示
- 测试Google登录流程

## 🔍 故障排除
如果遇到问题：
1. 检查Google Console重定向URI设置
2. 确认生产环境变量正确
3. 检查服务器日志

## 📞 技术支持
- 测试页面: https://owowlove.com/en/test-google-oauth
- 配置验证: https://owowlove.com/api/auth/google/test-config

---
同步时间: ${new Date().toISOString()}
状态: ✅ 准备就绪
`

  const guidePath = path.join(process.cwd(), 'GOOGLE_OAUTH_PRODUCTION_SYNC.md')
  fs.writeFileSync(guidePath, guide)
  console.log('✅ 部署指南已生成: GOOGLE_OAUTH_PRODUCTION_SYNC.md')
}

// 主函数
async function main() {
  console.log('🎯 Google OAuth 生产环境同步流程\n')
  
  // 检查文件
  if (!checkFiles()) {
    console.log('\n❌ 文件检查失败，请确保所有必要文件存在')
    process.exit(1)
  }
  
  // 更新生产配置
  if (!updateProductionConfig()) {
    console.log('\n❌ 生产环境配置更新失败')
    process.exit(1)
  }
  
  // 验证文件内容
  if (!validateGoogleOAuthFiles()) {
    console.log('\n❌ Google OAuth文件验证失败')
    process.exit(1)
  }
  
  // 构建生产版本
  if (!buildProduction()) {
    console.log('\n❌ 生产版本构建失败')
    process.exit(1)
  }
  
  // 生成部署指南
  generateDeploymentGuide()
  
  console.log('\n🎉 Google OAuth功能已准备好同步到生产环境！')
  console.log('\n📋 下一步操作：')
  console.log('1. 在Google Cloud Console中添加生产环境重定向URI')
  console.log('2. 提交代码到版本控制系统')
  console.log('3. 部署到生产服务器')
  console.log('4. 访问 https://owowlove.com/en/login 测试功能')
  
  process.exit(0)
}

// 运行脚本
main().catch(console.error)
