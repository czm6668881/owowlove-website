const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function main() {
  console.log('🔔 Stripe Webhook 设置向导')
  console.log('================================\n')

  console.log('请按照以下步骤设置Stripe Webhook：\n')
  
  console.log('1. 访问 Stripe Dashboard: https://dashboard.stripe.com/')
  console.log('2. 点击 "Developers" → "Webhooks"')
  console.log('3. 点击 "Add endpoint"')
  console.log('4. 设置端点URL为: https://owowlove.com/api/payment/webhook/stripe')
  console.log('5. 选择以下事件:')
  console.log('   - payment_intent.succeeded')
  console.log('   - payment_intent.payment_failed')
  console.log('   - payment_intent.canceled')
  console.log('   - charge.dispute.created')
  console.log('6. 创建后，复制 Webhook 签名密钥 (以 whsec_ 开头)\n')

  const webhookSecret = await question('请输入您的 Webhook Secret (whsec_...): ')

  // 验证密钥格式
  if (!webhookSecret.startsWith('whsec_')) {
    console.error('❌ Webhook Secret 格式错误，应该以 whsec_ 开头')
    process.exit(1)
  }

  // 读取现有的 .env.local 文件
  const envPath = path.join(process.cwd(), '.env.local')
  let envContent = ''

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8')
  }

  // 更新 STRIPE_WEBHOOK_SECRET
  if (envContent.includes('STRIPE_WEBHOOK_SECRET=')) {
    // 替换现有的值
    envContent = envContent.replace(
      /STRIPE_WEBHOOK_SECRET=.*/,
      `STRIPE_WEBHOOK_SECRET=${webhookSecret}`
    )
  } else {
    // 添加新的配置
    envContent += `\nSTRIPE_WEBHOOK_SECRET=${webhookSecret}\n`
  }

  // 写入文件
  fs.writeFileSync(envPath, envContent)

  console.log('\n✅ Webhook Secret 已保存到 .env.local')
  
  // 测试Webhook配置
  console.log('\n🧪 测试Webhook配置...')
  
  try {
    // 检查环境变量
    require('dotenv').config({ path: '.env.local' })
    
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      console.log('✅ Webhook Secret 配置成功')
    } else {
      console.log('❌ Webhook Secret 配置失败')
    }
  } catch (error) {
    console.log('⚠️  无法验证配置，请手动检查')
  }

  console.log('\n🎉 Webhook 设置完成！')
  console.log('\n下一步:')
  console.log('1. 重启开发服务器: npm run dev')
  console.log('2. 测试支付功能: http://localhost:3000/stripe-test')
  console.log('3. 在Stripe Dashboard中测试Webhook')
  
  console.log('\n📋 Webhook端点信息:')
  console.log('- 测试环境: http://localhost:3000/api/payment/webhook/stripe')
  console.log('- 生产环境: https://owowlove.com/api/payment/webhook/stripe')
  
  console.log('\n🔍 验证Webhook:')
  console.log('1. 在Stripe Dashboard的Webhook页面')
  console.log('2. 点击您创建的Webhook')
  console.log('3. 点击 "Send test webhook" 测试连接')

  rl.close()
}

main().catch(error => {
  console.error('❌ 设置失败:', error.message)
  process.exit(1)
})
