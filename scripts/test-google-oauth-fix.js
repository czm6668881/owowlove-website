#!/usr/bin/env node

/**
 * Google OAuth 修复验证脚本
 * 验证404错误是否已修复
 */

const https = require('https')
const http = require('http')

console.log('🔍 Google OAuth 修复验证开始...\n')

// 测试配置
const testConfig = {
  baseUrl: 'http://localhost:3001',
  endpoints: [
    '/api/auth/google',
    '/api/auth/google/callback',
    '/api/auth/google/dev-mode',
    '/api/auth/google/test-config',
    '/api/auth/google/verify-free'
  ]
}

// 测试HTTP请求
function testEndpoint(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (res) => {
      const statusCode = res.statusCode
      const statusText = res.statusMessage
      
      // 收集响应数据
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        resolve({
          url,
          statusCode,
          statusText,
          success: statusCode !== 404,
          redirect: statusCode >= 300 && statusCode < 400,
          location: res.headers.location || null
        })
      })
    }).on('error', (err) => {
      resolve({
        url,
        statusCode: 'ERROR',
        statusText: err.message,
        success: false,
        redirect: false,
        location: null
      })
    })
    
    // 设置超时
    request.setTimeout(5000, () => {
      request.destroy()
      resolve({
        url,
        statusCode: 'TIMEOUT',
        statusText: 'Request timeout',
        success: false,
        redirect: false,
        location: null
      })
    })
  })
}

// 主测试函数
async function runTests() {
  console.log('📋 测试端点列表:')
  testConfig.endpoints.forEach((endpoint, index) => {
    console.log(`${index + 1}. ${testConfig.baseUrl}${endpoint}`)
  })
  console.log('')

  const results = []
  
  for (const endpoint of testConfig.endpoints) {
    const url = `${testConfig.baseUrl}${endpoint}`
    console.log(`🧪 测试: ${endpoint}`)
    
    const result = await testEndpoint(url)
    results.push(result)
    
    // 显示结果
    if (result.success) {
      if (result.redirect) {
        console.log(`✅ 成功 (${result.statusCode} ${result.statusText})`)
        if (result.location) {
          console.log(`   重定向到: ${result.location}`)
        }
      } else {
        console.log(`✅ 成功 (${result.statusCode} ${result.statusText})`)
      }
    } else {
      if (result.statusCode === 404) {
        console.log(`❌ 404错误 - 端点不存在`)
      } else {
        console.log(`⚠️  ${result.statusCode} ${result.statusText}`)
      }
    }
    console.log('')
  }

  // 生成测试报告
  console.log('📊 测试结果汇总:')
  console.log('=' .repeat(50))
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  const redirects = results.filter(r => r.redirect).length
  
  console.log(`✅ 成功: ${successful}/${results.length}`)
  console.log(`❌ 失败: ${failed}/${results.length}`)
  console.log(`🔄 重定向: ${redirects}/${results.length}`)
  
  if (failed === 0) {
    console.log('\n🎉 所有测试通过！Google OAuth 404错误已修复！')
  } else {
    console.log('\n⚠️  仍有部分端点存在问题，请检查:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.url}: ${r.statusCode} ${r.statusText}`)
    })
  }

  // 特别检查主要的Google OAuth端点
  const mainEndpoint = results.find(r => r.url.includes('/api/auth/google') && !r.url.includes('/'))
  if (mainEndpoint && mainEndpoint.success) {
    console.log('\n🚀 主要Google OAuth端点工作正常！')
    console.log('现在可以在登录页面测试Google登录功能。')
  }
}

// 运行测试
runTests().catch(console.error)
