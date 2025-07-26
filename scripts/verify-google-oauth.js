#!/usr/bin/env node

/**
 * Google OAuth 配置验证脚本
 * 自动检查Google OAuth配置是否正确
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 Google OAuth 配置验证开始...\n')

// 检查项目结构
function checkProjectStructure() {
  console.log('📁 检查项目结构...')
  
  const requiredFiles = [
    '.env.local',
    'app/api/auth/google/route.ts',
    'app/api/auth/google/callback/route.ts',
    'contexts/user-auth-context.tsx'
  ]
  
  const missingFiles = []
  
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      missingFiles.push(file)
    }
  })
  
  if (missingFiles.length > 0) {
    console.log('❌ 缺少必要文件:')
    missingFiles.forEach(file => console.log(`   - ${file}`))
    return false
  }
  
  console.log('✅ 项目结构检查通过\n')
  return true
}

// 检查环境变量
function checkEnvironmentVariables() {
  console.log('🔧 检查环境变量...')
  
  // 读取 .env.local 文件
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local 文件不存在')
    return false
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')
  
  const requiredVars = {
    'GOOGLE_CLIENT_ID': null,
    'GOOGLE_CLIENT_SECRET': null,
    'NEXTAUTH_URL': null
  }
  
  // 解析环境变量
  envLines.forEach(line => {
    const [key, value] = line.split('=')
    if (key && value && requiredVars.hasOwnProperty(key)) {
      requiredVars[key] = value
    }
  })
  
  let hasErrors = false
  
  // 检查 GOOGLE_CLIENT_ID
  if (!requiredVars.GOOGLE_CLIENT_ID) {
    console.log('❌ GOOGLE_CLIENT_ID 未设置')
    hasErrors = true
  } else if (requiredVars.GOOGLE_CLIENT_ID === 'your-google-client-id-here') {
    console.log('❌ GOOGLE_CLIENT_ID 仍然是默认值')
    hasErrors = true
  } else if (!requiredVars.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
    console.log('❌ GOOGLE_CLIENT_ID 格式不正确')
    hasErrors = true
  } else {
    console.log('✅ GOOGLE_CLIENT_ID 设置正确')
  }
  
  // 检查 GOOGLE_CLIENT_SECRET
  if (!requiredVars.GOOGLE_CLIENT_SECRET) {
    console.log('❌ GOOGLE_CLIENT_SECRET 未设置')
    hasErrors = true
  } else if (requiredVars.GOOGLE_CLIENT_SECRET === 'your-google-client-secret-here') {
    console.log('❌ GOOGLE_CLIENT_SECRET 仍然是默认值')
    hasErrors = true
  } else if (!requiredVars.GOOGLE_CLIENT_SECRET.startsWith('GOCSPX-')) {
    console.log('❌ GOOGLE_CLIENT_SECRET 格式不正确')
    hasErrors = true
  } else {
    console.log('✅ GOOGLE_CLIENT_SECRET 设置正确')
  }
  
  // 检查 NEXTAUTH_URL
  if (!requiredVars.NEXTAUTH_URL) {
    console.log('❌ NEXTAUTH_URL 未设置')
    hasErrors = true
  } else if (!requiredVars.NEXTAUTH_URL.includes('localhost:3001')) {
    console.log('⚠️  NEXTAUTH_URL 端口不是3001，请确认开发服务器端口')
  } else {
    console.log('✅ NEXTAUTH_URL 设置正确')
  }
  
  if (hasErrors) {
    console.log('\n❌ 环境变量检查失败')
    return false
  }
  
  console.log('✅ 环境变量检查通过\n')
  return true
}

// 检查依赖包
function checkDependencies() {
  console.log('📦 检查依赖包...')
  
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json 文件不存在')
    return false
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  const requiredPackages = [
    'google-auth-library',
    'googleapis'
  ]
  
  const missingPackages = []
  
  requiredPackages.forEach(pkg => {
    if (!dependencies[pkg]) {
      missingPackages.push(pkg)
    }
  })
  
  if (missingPackages.length > 0) {
    console.log('❌ 缺少必要依赖包:')
    missingPackages.forEach(pkg => console.log(`   - ${pkg}`))
    console.log('\n请运行: npm install google-auth-library googleapis --legacy-peer-deps')
    return false
  }
  
  console.log('✅ 依赖包检查通过\n')
  return true
}

// 生成配置报告
function generateReport(structureOk, envOk, depsOk) {
  console.log('📊 配置验证报告')
  console.log('='.repeat(50))
  console.log(`项目结构: ${structureOk ? '✅ 通过' : '❌ 失败'}`)
  console.log(`环境变量: ${envOk ? '✅ 通过' : '❌ 失败'}`)
  console.log(`依赖包: ${depsOk ? '✅ 通过' : '❌ 失败'}`)
  console.log('='.repeat(50))
  
  if (structureOk && envOk && depsOk) {
    console.log('\n🎉 所有检查都通过了！')
    console.log('您可以开始测试Google OAuth功能了。')
    console.log('\n下一步:')
    console.log('1. 确保开发服务器正在运行: npm run dev')
    console.log('2. 访问测试页面: http://localhost:3001/en/test-google-oauth')
    console.log('3. 测试登录功能: http://localhost:3001/en/login')
  } else {
    console.log('\n❌ 配置验证失败')
    console.log('请根据上述错误信息修复配置问题。')
    console.log('\n参考文档:')
    console.log('- GOOGLE_OAUTH_QUICK_SETUP.md')
    console.log('- GOOGLE_OAUTH_CHECKLIST.md')
  }
}

// 主函数
function main() {
  const structureOk = checkProjectStructure()
  const envOk = checkEnvironmentVariables()
  const depsOk = checkDependencies()
  
  generateReport(structureOk, envOk, depsOk)
  
  process.exit(structureOk && envOk && depsOk ? 0 : 1)
}

// 运行脚本
main()
