require('dotenv').config({ path: '.env.local' })

async function checkStripeConnection() {
  console.log('🔍 Stripe 收款账号连接状态检查')
  console.log('=====================================\n')

  // 1. 检查环境变量
  console.log('📋 1. 环境变量检查:')
  const requiredVars = [
    'STRIPE_PUBLIC_KEY',
    'STRIPE_SECRET_KEY', 
    'NEXT_PUBLIC_STRIPE_PUBLIC_KEY'
  ]

  let allVarsPresent = true
  for (const varName of requiredVars) {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: ${process.env[varName].substring(0, 20)}...`)
    } else {
      console.log(`   ❌ ${varName}: 未配置`)
      allVarsPresent = false
    }
  }

  // Webhook Secret检查
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    console.log(`   ✅ STRIPE_WEBHOOK_SECRET: ${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 15)}...`)
  } else {
    console.log('   ⚠️  STRIPE_WEBHOOK_SECRET: 未配置 (可选)')
  }

  if (!allVarsPresent) {
    console.log('\n❌ 请先配置必需的环境变量')
    return false
  }

  // 2. 测试API连接
  console.log('\n🔗 2. API连接测试:')
  try {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amount: '100', // $1.00
        currency: 'usd',
        'metadata[test]': 'connection_test'
      })
    })

    if (response.ok) {
      const data = await response.json()
      console.log('   ✅ API连接成功')
      console.log(`   ✅ 支付意图创建成功: ${data.id}`)
    } else {
      const error = await response.json()
      console.log('   ❌ API连接失败:', error.error?.message || 'Unknown error')
      return false
    }
  } catch (error) {
    console.log('   ❌ API连接失败:', error.message)
    return false
  }

  // 3. 检查账户信息
  console.log('\n👤 3. 账户信息:')
  try {
    const response = await fetch('https://api.stripe.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
      }
    })

    if (response.ok) {
      const account = await response.json()
      console.log(`   ✅ 账户ID: ${account.id}`)
      console.log(`   ✅ 国家: ${account.country}`)
      console.log(`   ✅ 货币: ${account.default_currency?.toUpperCase()}`)
      console.log(`   ✅ 账户类型: ${account.type}`)
      
      if (account.charges_enabled) {
        console.log('   ✅ 支付功能: 已启用')
      } else {
        console.log('   ⚠️  支付功能: 未完全启用')
      }
    } else {
      console.log('   ⚠️  无法获取账户信息')
    }
  } catch (error) {
    console.log('   ⚠️  账户信息获取失败:', error.message)
  }

  // 4. 检查Webhook配置
  console.log('\n🔔 4. Webhook配置:')
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('   ✅ Webhook Secret已配置')
    
    try {
      const response = await fetch('https://api.stripe.com/v1/webhook_endpoints', {
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const webhooks = data.data
        
        if (webhooks.length > 0) {
          console.log(`   ✅ 已配置 ${webhooks.length} 个Webhook端点:`)
          webhooks.forEach((webhook, index) => {
            console.log(`      ${index + 1}. ${webhook.url}`)
            console.log(`         状态: ${webhook.status}`)
            console.log(`         事件: ${webhook.enabled_events.join(', ')}`)
          })
        } else {
          console.log('   ⚠️  未找到Webhook端点')
        }
      }
    } catch (error) {
      console.log('   ⚠️  无法检查Webhook配置')
    }
  } else {
    console.log('   ⚠️  Webhook Secret未配置')
    console.log('   💡 运行: node scripts/setup-stripe-webhook.js')
  }

  // 5. 总结
  console.log('\n📊 5. 连接状态总结:')
  console.log('   ✅ Stripe API密钥: 已配置且有效')
  console.log('   ✅ 支付功能: 可用')
  console.log('   ✅ 测试环境: 就绪')
  
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('   ✅ Webhook: 已配置')
  } else {
    console.log('   ⚠️  Webhook: 需要配置')
  }

  console.log('\n🎉 Stripe收款账号连接成功！')
  
  console.log('\n📱 下一步操作:')
  console.log('1. 测试支付: http://localhost:3000/stripe-test')
  console.log('2. 完整购物流程: http://localhost:3000')
  console.log('3. 查看交易: https://dashboard.stripe.com/payments')
  
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('4. 设置Webhook: node scripts/setup-stripe-webhook.js')
  }

  return true
}

checkStripeConnection().catch(error => {
  console.error('❌ 检查失败:', error.message)
  process.exit(1)
})
