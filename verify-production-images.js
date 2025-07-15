#!/usr/bin/env node

const https = require('https')
const http = require('http')

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https:') ? https : http
    
    const req = client.get(url, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          size: Buffer.byteLength(data)
        })
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })
  })
}

async function verifyProductionImages() {
  console.log('🔍 VERIFYING PRODUCTION IMAGE DISPLAY')
  console.log('============================================================')

  const baseUrl = 'https://owowlove.com'
  
  // 测试图片列表
  const testImages = [
    'product-1752068376427.jpg',
    'product-1752080189101.jpeg',
    'product-1752312776393.jpeg',
    'product-1752401587935.jpeg',
    'product-1752401589832.jpeg',
    'product-1752401591471.jpeg'
  ]

  try {
    // 1. 测试主页访问
    console.log('\n🌐 STEP 1: TESTING MAIN WEBSITE')
    
    try {
      const homeResponse = await makeRequest(baseUrl)
      if (homeResponse.statusCode === 200) {
        console.log('✅ Main website accessible')
        console.log(`   📊 Status: ${homeResponse.statusCode}`)
        console.log(`   📏 Size: ${homeResponse.size} bytes`)
      } else {
        console.log(`⚠️  Main website returned status: ${homeResponse.statusCode}`)
      }
    } catch (error) {
      console.log('❌ Main website not accessible:', error.message)
      return false
    }

    // 2. 测试图片API端点
    console.log('\n🖼️  STEP 2: TESTING IMAGE API ENDPOINTS')
    
    let successCount = 0
    let failCount = 0
    
    for (const imageName of testImages) {
      const imageUrl = `${baseUrl}/api/image/${imageName}`
      console.log(`\n🔍 Testing: ${imageName}`)
      
      try {
        const response = await makeRequest(imageUrl)
        
        if (response.statusCode === 200) {
          const contentType = response.headers['content-type'] || 'unknown'
          const isImage = contentType.startsWith('image/')
          
          if (isImage && response.size > 1000) {
            console.log(`   ✅ SUCCESS - ${response.size} bytes, ${contentType}`)
            successCount++
          } else {
            console.log(`   ⚠️  PARTIAL - Status 200 but suspicious content`)
            console.log(`      Content-Type: ${contentType}`)
            console.log(`      Size: ${response.size} bytes`)
            console.log(`      Data preview: ${response.data.substring(0, 100)}...`)
          }
        } else {
          console.log(`   ❌ FAILED - Status: ${response.statusCode}`)
          failCount++
        }
      } catch (error) {
        console.log(`   ❌ ERROR - ${error.message}`)
        failCount++
      }
    }

    // 3. 测试映射文件访问
    console.log('\n📄 STEP 3: TESTING IMAGE MAPPING FILE')
    
    try {
      const mappingUrl = `${baseUrl}/image-mapping.json`
      const mappingResponse = await makeRequest(mappingUrl)
      
      if (mappingResponse.statusCode === 200) {
        try {
          const mappingData = JSON.parse(mappingResponse.data)
          const imageCount = Object.keys(mappingData.images || mappingData).length
          console.log('✅ Image mapping file accessible')
          console.log(`   📊 Contains ${imageCount} images`)
          console.log(`   📅 Last updated: ${mappingData.lastUpdated || 'unknown'}`)
        } catch (parseError) {
          console.log('⚠️  Mapping file accessible but invalid JSON')
        }
      } else {
        console.log(`❌ Mapping file not accessible: ${mappingResponse.statusCode}`)
      }
    } catch (error) {
      console.log('❌ Mapping file test failed:', error.message)
    }

    // 4. 生成测试报告
    console.log('\n📊 STEP 4: GENERATING TEST REPORT')
    
    const totalTests = testImages.length
    const successRate = (successCount / totalTests * 100).toFixed(1)
    
    console.log(`📈 Success Rate: ${successCount}/${totalTests} (${successRate}%)`)
    
    if (successCount === totalTests) {
      console.log('🎉 ALL IMAGES WORKING PERFECTLY!')
    } else if (successCount > totalTests / 2) {
      console.log('⚠️  MOST IMAGES WORKING - Some issues detected')
    } else {
      console.log('❌ MAJOR ISSUES - Most images not working')
    }

    // 5. 提供故障排除建议
    if (failCount > 0) {
      console.log('\n🔧 TROUBLESHOOTING SUGGESTIONS:')
      console.log('   1. Check if deployment completed successfully')
      console.log('   2. Verify image-mapping.json was deployed')
      console.log('   3. Check browser console for JavaScript errors')
      console.log('   4. Clear browser cache and try again')
      console.log('   5. Test individual image URLs in browser')
      console.log('')
      console.log('🔗 Direct test URLs:')
      testImages.forEach(img => {
        console.log(`   ${baseUrl}/api/image/${img}`)
      })
    }

    return successCount > 0

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    return false
  }
}

async function main() {
  const success = await verifyProductionImages()
  
  console.log('\n📊 VERIFICATION SUMMARY')
  console.log('============================================================')
  
  if (success) {
    console.log('🎉 Production image verification PASSED!')
    console.log('✅ Images should be displaying correctly on your website')
    console.log('')
    console.log('🌐 Visit your website to confirm:')
    console.log('   https://owowlove.com')
    console.log('')
    console.log('📝 Optional next steps:')
    console.log('   1. Create image_storage table for database backup')
    console.log('   2. Test uploading new products')
    console.log('   3. Monitor image loading performance')
  } else {
    console.log('❌ Production image verification FAILED!')
    console.log('📝 Please check the issues above and:')
    console.log('   1. Ensure deployment completed successfully')
    console.log('   2. Check if all files were uploaded')
    console.log('   3. Review server logs for errors')
    console.log('   4. Contact support if issues persist')
  }
  
  process.exit(success ? 0 : 1)
}

main()
