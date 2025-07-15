#!/usr/bin/env node

// 生产环境部署验证脚本
const https = require('https')
const http = require('http')

async function verifyProductionDeployment() {
  console.log('🌐 VERIFYING PRODUCTION DEPLOYMENT')
  console.log('============================================================')
  
  const baseUrl = 'https://owowlove.com'
  
  try {
    // 1. 测试主页
    console.log('\n🏠 STEP 1: TESTING HOMEPAGE')
    const homepageResult = await testUrl(`${baseUrl}`)
    console.log(`   Homepage: ${homepageResult.status} - ${homepageResult.success ? 'SUCCESS' : 'FAILED'}`)
    
    // 2. 测试产品API
    console.log('\n📦 STEP 2: TESTING PRODUCTS API')
    const productsResult = await testUrl(`${baseUrl}/api/products`)
    console.log(`   Products API: ${productsResult.status} - ${productsResult.success ? 'SUCCESS' : 'FAILED'}`)
    
    if (productsResult.success && productsResult.data) {
      try {
        const products = JSON.parse(productsResult.data)
        console.log(`   Products returned: ${products.data?.length || 0}`)
        
        // 3. 测试图片API
        if (products.data && products.data.length > 0) {
          console.log('\n🖼️  STEP 3: TESTING IMAGE API')
          
          for (let i = 0; i < Math.min(3, products.data.length); i++) {
            const product = products.data[i]
            if (product.images && product.images.length > 0) {
              const imageUrl = product.images[0]
              const fullImageUrl = `${baseUrl}${imageUrl}`
              
              console.log(`   Testing: ${product.name}`)
              console.log(`   Image URL: ${imageUrl}`)
              
              const imageResult = await testUrl(fullImageUrl)
              console.log(`   Image API: ${imageResult.status} - ${imageResult.success ? 'SUCCESS' : 'FAILED'}`)
              
              if (imageResult.success) {
                console.log(`   Content-Type: ${imageResult.contentType}`)
                console.log(`   Content-Length: ${imageResult.contentLength} bytes`)
              }
            }
          }
        }
      } catch (parseError) {
        console.log(`   ❌ Failed to parse products data: ${parseError.message}`)
      }
    }
    
    // 4. 测试映射文件
    console.log('\n📋 STEP 4: TESTING IMAGE MAPPING FILE')
    const mappingResult = await testUrl(`${baseUrl}/image-mapping.json`)
    console.log(`   Mapping file: ${mappingResult.status} - ${mappingResult.success ? 'SUCCESS' : 'FAILED'}`)
    
    if (mappingResult.success && mappingResult.data) {
      try {
        const mapping = JSON.parse(mappingResult.data)
        const imageCount = Object.keys(mapping).length
        console.log(`   Images in mapping: ${imageCount}`)
      } catch (parseError) {
        console.log(`   ⚠️  Failed to parse mapping file`)
      }
    }
    
    // 5. 总结
    console.log('\n📊 DEPLOYMENT VERIFICATION SUMMARY')
    console.log('============================================================')
    
    const allTests = [
      { name: 'Homepage', result: homepageResult },
      { name: 'Products API', result: productsResult },
      { name: 'Image Mapping', result: mappingResult }
    ]
    
    const passedTests = allTests.filter(test => test.result.success).length
    const totalTests = allTests.length
    
    console.log(`   Tests passed: ${passedTests}/${totalTests}`)
    
    allTests.forEach(test => {
      const status = test.result.success ? '✅' : '❌'
      console.log(`   ${status} ${test.name}: ${test.result.status}`)
    })
    
    if (passedTests === totalTests) {
      console.log('\n🎉 SUCCESS! Production deployment is working correctly!')
      console.log('   Your domain should now display product images properly.')
    } else {
      console.log('\n⚠️  Some tests failed. Please check the details above.')
      console.log('   The deployment may still be in progress or there may be issues.')
    }
    
    console.log('\n🔗 URLs to check manually:')
    console.log(`   Homepage: ${baseUrl}`)
    console.log(`   Products API: ${baseUrl}/api/products`)
    console.log(`   Image Mapping: ${baseUrl}/image-mapping.json`)

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
  }
}

// 测试URL的辅助函数
function testUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url)
    const client = urlObj.protocol === 'https:' ? https : http
    
    const req = client.get(url, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: res.headers['content-length'],
          data: data
        })
      })
    })
    
    req.on('error', (error) => {
      resolve({
        success: false,
        status: 'ERROR',
        error: error.message
      })
    })
    
    req.setTimeout(10000, () => {
      req.destroy()
      resolve({
        success: false,
        status: 'TIMEOUT',
        error: 'Request timeout'
      })
    })
  })
}

verifyProductionDeployment()
