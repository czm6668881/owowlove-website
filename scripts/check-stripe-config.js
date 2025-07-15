#!/usr/bin/env node

/**
 * Stripe 配置检查脚本
 * 
 * 检查 Stripe 配置是否正确设置
 */

const fs = require('fs')
const path = require('path')

function checkStripeConfig() {
  console.log('🔍 检查 Stripe 配置...\n')

  // 检查环境变量文件
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local 文件不存在')
    console.log('请创建 .env.local 文件并添加 Stripe 配置')
    return false
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // 检查必需的 Stripe 环境变量
  const requiredVars = [
    'STRIPE_PUBLIC_KEY',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLIC_KEY'
  ]

  const missingVars = []
  const presentVars = []

  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your_`)) {
      presentVars.push(varName)
    } else {
      missingVars.push(varName)
    }
  })

  // 显示结果
  if (presentVars.length > 0) {
    console.log('✅ 已配置的变量:')
    presentVars.forEach(varName => {
      console.log(`   - ${varName}`)
    })
    console.log()
  }

  if (missingVars.length > 0) {
    console.log('❌ 缺失的变量:')
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`)
    })
    console.log()
  }

  // 检查 package.json 中的依赖
  const packagePath = path.join(process.cwd(), 'package.json')
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
    
    const requiredDeps = ['stripe', '@stripe/stripe-js']
    const missingDeps = requiredDeps.filter(dep => !dependencies[dep])
    
    if (missingDeps.length === 0) {
      console.log('✅ Stripe 依赖已安装')
    } else {
      console.log('❌ 缺失的依赖:')
      missingDeps.forEach(dep => {
        console.log(`   - ${dep}`)
      })
      console.log('\n运行以下命令安装依赖:')
      console.log(`npm install ${missingDeps.join(' ')}`)
    }
  }

  // 检查关键文件是否存在
  const requiredFiles = [
    'lib/services/payment-providers/stripe-enhanced.ts',
    'components/payment/stripe-payment-form.tsx',
    'app/api/payment/stripe/config/route.ts',
    'contexts/stripe-context.tsx'
  ]

  console.log('\n📁 检查关键文件:')
  requiredFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath)
    if (fs.existsSync(fullPath)) {
      console.log(`   ✅ ${filePath}`)
    } else {
      console.log(`   ❌ ${filePath}`)
    }
  })

  // 总结
  console.log('\n📊 配置状态:')
  if (missingVars.length === 0) {
    console.log('✅ Stripe 环境变量配置完成')
  } else {
    console.log(`❌ 还需要配置 ${missingVars.length} 个环境变量`)
  }

  // 提供下一步指导
  if (missingVars.length > 0) {
    console.log('\n🚀 下一步:')
    console.log('1. 访问 https://dashboard.stripe.com/')
    console.log('2. 获取您的 API 密钥')
    console.log('3. 运行: node scripts/setup-stripe.js')
    console.log('4. 或手动添加到 .env.local 文件')
  } else {
    console.log('\n🎉 Stripe 配置完成！')
    console.log('访问 http://localhost:3000/stripe-test 进行测试')
  }

  return missingVars.length === 0
}

if (require.main === module) {
  checkStripeConfig()
}
