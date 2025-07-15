#!/usr/bin/env node

/**
 * Stripe API 测试脚本
 */

require('dotenv').config({ path: '.env.local' })

async function testStripeAPI() {
  console.log('🔍 测试 Stripe API 连接...\n')

  // 检查环境变量
  const publicKey = process.env.STRIPE_PUBLIC_KEY
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!publicKey || !secretKey) {
    console.log('❌ Stripe 密钥未配置')
    return false
  }

  console.log('✅ 环境变量已配置')
  console.log(`   公钥: ${publicKey.substring(0, 20)}...`)
  console.log(`   私钥: ${secretKey.substring(0, 20)}...\n`)

  try {
    // 测试 API 连接
    const response = await fetch('https://api.stripe.com/v1/payment_methods', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (response.ok) {
      console.log('✅ Stripe API 连接成功！')
      console.log('✅ 密钥有效且可以访问 Stripe 服务')
    } else {
      console.log('❌ Stripe API 连接失败')
      console.log(`   状态码: ${response.status}`)
    }

    // 测试创建支付意图
    console.log('\n🔍 测试创建支付意图...')
    
    const intentResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        amount: '2999', // $29.99
        currency: 'usd',
        'metadata[test]': 'true'
      })
    })

    const intentResult = await intentResponse.json()

    if (intentResponse.ok && intentResult.id) {
      console.log('✅ 支付意图创建成功！')
      console.log(`   支付意图 ID: ${intentResult.id}`)
      console.log(`   客户端密钥: ${intentResult.client_secret.substring(0, 30)}...`)
    } else {
      console.log('❌ 支付意图创建失败')
      console.log('   错误:', intentResult.error?.message || '未知错误')
    }

  } catch (error) {
    console.log('❌ 网络错误:', error.message)
    return false
  }

  console.log('\n🎉 Stripe 集成测试完成！')
  console.log('\n📱 下一步:')
  console.log('1. 访问: http://localhost:3000/stripe-test')
  console.log('2. 使用测试卡号: 4242 4242 4242 4242')
  console.log('3. 过期日期: 12/25, CVC: 123')

  return true
}

if (require.main === module) {
  testStripeAPI().catch(console.error)
}

module.exports = { testStripeAPI }
