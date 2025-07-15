#!/usr/bin/env node

// 诊断生产环境问题
const https = require('https')

async function diagnoseProductionIssue() {
  console.log('🔍 DIAGNOSING PRODUCTION ISSUE')
  console.log('============================================================')
  
  const baseUrl = 'https://owowlove.com'
  
  try {
    // 1. 检查主页重定向
    console.log('\n🏠 STEP 1: CHECKING HOMEPAGE REDIRECT')
    const homepageResult = await testUrlWithRedirect(`${baseUrl}`)
    console.log(`   Initial response: ${homepageResult.status}`)
    if (homepageResult.location) {
      console.log(`   Redirects to: ${homepageResult.location}`)
      
      // 跟随重定向
      const finalResult = await testUrl(homepageResult.location)
      console.log(`   Final response: ${finalResult.status} - ${finalResult.success ? 'SUCCESS' : 'FAILED'}`)
    }
    
    // 2. 检查产品API
    console.log('\n📦 STEP 2: CHECKING PRODUCTS API')
    const productsResult = await testUrl(`${baseUrl}/api/products`)
    console.log(`   Products API: ${productsResult.status} - ${productsResult.success ? 'SUCCESS' : 'FAILED'}`)
    
    if (productsResult.success && productsResult.data) {
      try {
        const products = JSON.parse(productsResult.data)
        console.log(`   Products returned: ${products.data?.length || 0}`)
        
        if (products.data && products.data.length > 0) {
          console.log('\n   Product details:')
          products.data.forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.name}`)
            console.log(`      ID: ${product.id}`)
            console.log(`      Images: ${JSON.stringify(product.images)}`)
          })
        }
      } catch (parseError) {
        console.log(`   ❌ Failed to parse products: ${parseError.message}`)
      }
    }
    
    // 3. 检查图片API详细信息
    console.log('\n🖼️  STEP 3: DETAILED IMAGE API CHECK')
    const testImages = [
      'product-1752068376427.jpg',
      'product-1752080189101.jpeg', 
      'product-1752312776393.jpeg'
    ]
    
    for (const filename of testImages) {
      console.log(`\n   Testing: ${filename}`)
      const imageUrl = `${baseUrl}/api/image/${filename}`
      console.log(`   URL: ${imageUrl}`)
      
      const imageResult = await testUrl(imageUrl)
      console.log(`   Status: ${imageResult.status}`)
      console.log(`   Success: ${imageResult.success}`)
      console.log(`   Content-Type: ${imageResult.contentType}`)
      console.log(`   Content-Length: ${imageResult.contentLength}`)
      
      if (!imageResult.success) {
        console.log(`   Error: ${imageResult.error || 'Unknown error'}`)
        console.log(`   Response body: ${imageResult.data?.substring(0, 200)}...`)
      }
    }
    
    // 4. 检查映射文件
    console.log('\n📋 STEP 4: CHECKING IMAGE MAPPING')
    const mappingResult = await testUrl(`${baseUrl}/image-mapping.json`)
    console.log(`   Mapping file: ${mappingResult.status} - ${mappingResult.success ? 'SUCCESS' : 'FAILED'}`)
    
    if (mappingResult.success && mappingResult.data) {
      try {
        const mapping = JSON.parse(mappingResult.data)
        const imageCount = Object.keys(mapping).length
        console.log(`   Images in mapping: ${imageCount}`)
        console.log(`   Mapping keys: ${Object.keys(mapping).join(', ')}`)
      } catch (parseError) {
        console.log(`   ❌ Failed to parse mapping: ${parseError.message}`)
      }
    }
    
    // 5. 检查前端页面
    console.log('\n🌐 STEP 5: CHECKING FRONTEND PAGE')
    const frontendResult = await testUrl(`${baseUrl}/en`)
    console.log(`   Frontend page: ${frontendResult.status} - ${frontendResult.success ? 'SUCCESS' : 'FAILED'}`)
    
    if (frontendResult.success && frontendResult.data) {
      const hasProducts = frontendResult.data.includes('product') || frontendResult.data.includes('Spider') || frontendResult.data.includes('Cow')
      console.log(`   Contains product content: ${hasProducts}`)
      
      const hasImages = frontendResult.data.includes('/api/image/') || frontendResult.data.includes('product-')
      console.log(`   Contains image references: ${hasImages}`)
    }
    
    // 6. 总结问题
    console.log('\n📊 ISSUE DIAGNOSIS SUMMARY')
    console.log('============================================================')
    
    const issues = []
    
    if (!homepageResult.success && homepageResult.status !== 307) {
      issues.push('Homepage not accessible')
    }
    
    if (!productsResult.success) {
      issues.push('Products API not working')
    }
    
    const imageIssues = testImages.filter(async (filename) => {
      const result = await testUrl(`${baseUrl}/api/image/${filename}`)
      return !result.success
    })
    
    if (imageIssues.length > 0) {
      issues.push(`${imageIssues.length} image(s) not loading`)
    }
    
    if (!mappingResult.success) {
      issues.push('Image mapping file not accessible')
    }
    
    if (issues.length === 0) {
      console.log('✅ No obvious issues detected with APIs')
      console.log('🔍 The problem might be in the frontend rendering or caching')
      console.log('')
      console.log('💡 Possible causes:')
      console.log('   1. Browser cache - try hard refresh (Ctrl+F5)')
      console.log('   2. CDN cache - images might be cached with old version')
      console.log('   3. Frontend JavaScript errors - check browser console')
      console.log('   4. React hydration issues - check for SSR/CSR mismatches')
    } else {
      console.log('❌ Issues detected:')
      issues.forEach(issue => console.log(`   - ${issue}`))
    }
    
    console.log('\n🔗 Manual verification URLs:')
    console.log(`   Homepage: ${baseUrl}`)
    console.log(`   Products API: ${baseUrl}/api/products`)
    console.log(`   Image example: ${baseUrl}/api/image/product-1752068376427.jpg`)
    console.log(`   Mapping file: ${baseUrl}/image-mapping.json`)

  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message)
  }
}

// 测试URL并跟踪重定向
function testUrlWithRedirect(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url)
    
    const req = https.get(url, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        resolve({
          success: res.statusCode >= 200 && res.statusCode < 400,
          status: res.statusCode,
          location: res.headers.location,
          contentType: res.headers['content-type'],
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
        status: 'TIMEOUT'
      })
    })
  })
}

// 测试URL
function testUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url)
    
    const req = https.get(url, (res) => {
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
        status: 'TIMEOUT'
      })
    })
  })
}

diagnoseProductionIssue()
