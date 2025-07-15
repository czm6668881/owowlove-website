#!/usr/bin/env node

/**
 * OWOWLOVE.COM 支付系统测试脚本
 * 
 * 这个脚本用于测试支付系统的各个组件和API端点
 * 
 * 使用方法:
 * node scripts/test-payment-system.js
 */

const https = require('https')
const http = require('http')

// 配置
const config = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:3000',
  testUser: {
    email: 'test@example.com',
    password: 'testpassword123'
  }
}

// 测试结果统计
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
}

// 工具函数
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https')
    const client = isHttps ? https : http
    
    const req = client.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          }
          resolve(result)
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          })
        }
      })
    })
    
    req.on('error', reject)
    
    if (options.body) {
      req.write(JSON.stringify(options.body))
    }
    
    req.end()
  })
}

function logTest(name, passed, message = '') {
  testResults.total++
  if (passed) {
    testResults.passed++
    console.log(`✅ ${name}`)
  } else {
    testResults.failed++
    console.log(`❌ ${name}: ${message}`)
    testResults.errors.push({ name, message })
  }
}

// 测试函数
async function testPaymentMethods() {
  console.log('\n🔍 测试支付方式API...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/payment/methods`)
    
    logTest(
      '获取支付方式列表',
      response.status === 200 && response.data?.success,
      response.data?.error || `状态码: ${response.status}`
    )
    
    if (response.data?.success && response.data?.data) {
      const methods = response.data.data
      logTest(
        '支付方式数据格式正确',
        Array.isArray(methods) && methods.length > 0,
        '支付方式列表为空或格式错误'
      )
      
      // 检查必需字段
      if (methods.length > 0) {
        const method = methods[0]
        const requiredFields = ['id', 'name', 'display_name', 'is_active']
        const hasAllFields = requiredFields.every(field => method.hasOwnProperty(field))
        
        logTest(
          '支付方式包含必需字段',
          hasAllFields,
          `缺少字段: ${requiredFields.filter(field => !method.hasOwnProperty(field)).join(', ')}`
        )
      }
    }
  } catch (error) {
    logTest('获取支付方式列表', false, error.message)
  }
}

async function testPaymentCreation() {
  console.log('\n🔍 测试支付创建API...')
  
  // 测试缺少参数的情况
  try {
    const response = await makeRequest(`${config.baseUrl}/api/payment/create`, {
      method: 'POST',
      body: {}
    })
    
    logTest(
      '缺少参数时返回错误',
      response.status === 400,
      `期望状态码400，实际: ${response.status}`
    )
  } catch (error) {
    logTest('缺少参数时返回错误', false, error.message)
  }
  
  // 测试无效金额
  try {
    const response = await makeRequest(`${config.baseUrl}/api/payment/create`, {
      method: 'POST',
      body: {
        order_id: 'test_order_123',
        payment_method: 'alipay',
        amount: -10
      }
    })
    
    logTest(
      '无效金额时返回错误',
      response.status === 400,
      `期望状态码400，实际: ${response.status}`
    )
  } catch (error) {
    logTest('无效金额时返回错误', false, error.message)
  }
}

async function testPaymentStatus() {
  console.log('\n🔍 测试支付状态查询API...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/payment/status/invalid_transaction_id`)
    
    logTest(
      '查询不存在的交易',
      response.status === 401 || response.status === 404 || !response.data?.success,
      `状态码: ${response.status}`
    )
  } catch (error) {
    logTest('查询不存在的交易', false, error.message)
  }
}

async function testUserTransactions() {
  console.log('\n🔍 测试用户交易记录API...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/payment/transactions`)
    
    logTest(
      '未登录用户访问交易记录',
      response.status === 401 || response.status === 500,
      `状态码: ${response.status}`
    )
  } catch (error) {
    logTest('未登录用户访问交易记录', false, error.message)
  }
}

async function testRefundAPI() {
  console.log('\n🔍 测试退款API...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/payment/refund`, {
      method: 'POST',
      body: {}
    })
    
    logTest(
      '缺少交易ID时返回错误',
      response.status === 400,
      `期望状态码400，实际: ${response.status}`
    )
  } catch (error) {
    logTest('缺少交易ID时返回错误', false, error.message)
  }
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/payment/refund`, {
      method: 'POST',
      body: {
        transaction_id: 'invalid_id',
        amount: -10
      }
    })
    
    logTest(
      '无效退款金额时返回错误',
      response.status === 400,
      `期望状态码400，实际: ${response.status}`
    )
  } catch (error) {
    logTest('无效退款金额时返回错误', false, error.message)
  }
}

async function testAdminAPIs() {
  console.log('\n🔍 测试管理员API...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/admin/payment/transactions`)
    
    logTest(
      '未授权访问管理员API',
      response.status === 401 || response.status === 403,
      `状态码: ${response.status}`
    )
  } catch (error) {
    logTest('未授权访问管理员API', false, error.message)
  }
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/admin/payment/methods`)
    
    logTest(
      '未授权访问支付方式管理API',
      response.status === 401 || response.status === 403,
      `状态码: ${response.status}`
    )
  } catch (error) {
    logTest('未授权访问支付方式管理API', false, error.message)
  }
}

async function testWebhookEndpoints() {
  console.log('\n🔍 测试Webhook端点...')
  
  const providers = ['alipay', 'wechat', 'stripe']
  
  for (const provider of providers) {
    try {
      const response = await makeRequest(`${config.baseUrl}/api/payment/webhook/${provider}`, {
        method: 'POST',
        body: { test: 'data' }
      })
      
      logTest(
        `${provider} Webhook端点响应`,
        response.status >= 200 && response.status < 500,
        `状态码: ${response.status}`
      )
    } catch (error) {
      logTest(`${provider} Webhook端点响应`, false, error.message)
    }
  }
}

async function testOrderCreation() {
  console.log('\n🔍 测试订单创建API...')
  
  try {
    const response = await makeRequest(`${config.baseUrl}/api/orders`, {
      method: 'POST',
      body: {}
    })
    
    logTest(
      '缺少订单数据时返回错误',
      response.status === 400 || response.status === 401,
      `状态码: ${response.status}`
    )
  } catch (error) {
    logTest('缺少订单数据时返回错误', false, error.message)
  }
}

// 主测试函数
async function runTests() {
  console.log('🚀 开始支付系统测试...')
  console.log(`测试目标: ${config.baseUrl}`)
  
  await testPaymentMethods()
  await testPaymentCreation()
  await testPaymentStatus()
  await testUserTransactions()
  await testRefundAPI()
  await testAdminAPIs()
  await testWebhookEndpoints()
  await testOrderCreation()
  
  // 输出测试结果
  console.log('\n📊 测试结果统计:')
  console.log(`总测试数: ${testResults.total}`)
  console.log(`通过: ${testResults.passed}`)
  console.log(`失败: ${testResults.failed}`)
  console.log(`成功率: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`)
  
  if (testResults.failed > 0) {
    console.log('\n❌ 失败的测试:')
    testResults.errors.forEach(error => {
      console.log(`  - ${error.name}: ${error.message}`)
    })
  }
  
  console.log('\n✅ 支付系统测试完成!')
  
  // 退出码
  process.exit(testResults.failed > 0 ? 1 : 0)
}

// 运行测试
if (require.main === module) {
  runTests().catch(error => {
    console.error('测试运行失败:', error)
    process.exit(1)
  })
}

module.exports = { runTests }
