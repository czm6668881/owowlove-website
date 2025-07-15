#!/usr/bin/env node

/**
 * Stripe 设置脚本
 * 
 * 这个脚本帮助您快速设置 Stripe 支付集成
 * 
 * 使用方法:
 * node scripts/setup-stripe.js
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('🚀 Stripe 支付系统设置向导')
  console.log('================================\n')

  console.log('请访问 https://dashboard.stripe.com/ 获取您的 API 密钥\n')

  // 获取用户输入
  const publicKey = await question('请输入您的 Stripe Publishable Key (pk_test_...): ')
  const secretKey = await question('请输入您的 Stripe Secret Key (sk_test_...): ')
  const webhookSecret = await question('请输入您的 Webhook Secret (whsec_...) [可选]: ')

  // 验证密钥格式
  if (!publicKey.startsWith('pk_')) {
    console.error('❌ Publishable Key 格式错误，应该以 pk_ 开头')
    process.exit(1)
  }

  if (!secretKey.startsWith('sk_')) {
    console.error('❌ Secret Key 格式错误，应该以 sk_ 开头')
    process.exit(1)
  }

  // 读取现有的 .env.local 文件
  const envPath = path.join(process.cwd(), '.env.local')
  let envContent = ''

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
  }

  // 更新或添加 Stripe 配置
  const stripeConfig = `
# Stripe 配置
STRIPE_PUBLIC_KEY=${publicKey}
STRIPE_SECRET_KEY=${secretKey}
STRIPE_WEBHOOK_SECRET=${webhookSecret}
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=${publicKey}
`

  // 移除现有的 Stripe 配置
  envContent = envContent.replace(/# Stripe 配置[\s\S]*?(?=\n#|\n[A-Z]|$)/g, '')
  
  // 添加新的 Stripe 配置
  envContent += stripeConfig

  // 写入文件
  fs.writeFileSync(envPath, envContent.trim() + '\n')

  console.log('\n✅ Stripe 配置已保存到 .env.local')

  // 创建 package.json 脚本（如果不存在）
  const packagePath = path.join(process.cwd(), 'package.json')
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    
    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }

    // 添加 Stripe 相关脚本
    packageJson.scripts['stripe:install'] = 'npm install stripe @stripe/stripe-js'
    packageJson.scripts['stripe:test'] = 'echo "Visit http://localhost:3000/stripe-test to test Stripe integration"'

    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    console.log('✅ 已添加 Stripe 脚本到 package.json')
  }

  // 检查是否需要安装依赖
  const nodeModulesPath = path.join(process.cwd(), 'node_modules', 'stripe')
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('\n📦 需要安装 Stripe 依赖:')
    console.log('npm install stripe @stripe/stripe-js')
    console.log('或者运行: npm run stripe:install')
  }

  console.log('\n🎉 Stripe 设置完成！')
  console.log('\n下一步:')
  console.log('1. 重启开发服务器: npm run dev')
  console.log('2. 访问测试页面: http://localhost:3000/stripe-test')
  console.log('3. 使用测试卡号: 4242 4242 4242 4242')
  
  if (!webhookSecret) {
    console.log('\n⚠️  Webhook 设置:')
    console.log('1. 在 Stripe Dashboard 中创建 Webhook')
    console.log('2. 端点 URL: https://yourdomain.com/api/payment/webhook/stripe')
    console.log('3. 选择事件: payment_intent.succeeded, payment_intent.payment_failed')
    console.log('4. 复制 Webhook Secret 并更新 .env.local')
  }

  console.log('\n📚 文档:')
  console.log('- Stripe 设置指南: ./STRIPE_SETUP_GUIDE.md')
  console.log('- Stripe 官方文档: https://stripe.com/docs')

  rl.close()
}

main().catch(error => {
  console.error('❌ 设置失败:', error.message)
  process.exit(1)
})
