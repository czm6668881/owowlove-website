#!/usr/bin/env node

const http = require('http')

function testFrontendAPI() {
  console.log('🔄 Testing frontend API for image data...')
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/products',
    method: 'GET'
  }

  const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`)
    
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data)
        console.log('✅ API Response received')
        console.log('Success:', jsonData.success)
        console.log('Data length:', jsonData.data?.length || 0)
        
        if (jsonData.data && jsonData.data.length > 0) {
          console.log('\n📦 Product image analysis:')
          
          jsonData.data.forEach((product, index) => {
            console.log(`\n${index + 1}. Product: ${product.name}`)
            console.log(`   ID: ${product.id}`)
            console.log(`   Active: ${product.is_active}`)
            console.log(`   Images type: ${typeof product.images}`)
            console.log(`   Images array: ${Array.isArray(product.images)}`)
            console.log(`   Images length: ${product.images?.length || 0}`)
            
            if (product.images && product.images.length > 0) {
              product.images.forEach((img, imgIndex) => {
                console.log(`   Image ${imgIndex + 1}: ${typeof img} - ${img}`)
                
                // 检查是否是有效的图片URL
                if (typeof img === 'string') {
                  if (img.startsWith('/api/image/')) {
                    console.log(`     ✅ Valid API format`)
                  } else if (img.startsWith('http')) {
                    console.log(`     ✅ Valid HTTP URL`)
                  } else if (img.startsWith('/')) {
                    console.log(`     ⚠️  Relative path`)
                  } else {
                    console.log(`     ❌ Invalid format`)
                  }
                } else {
                  console.log(`     ❌ Not a string`)
                }
              })
            } else {
              console.log(`   ❌ No images`)
            }
          })
          
          // 测试第一个图片URL是否可访问
          if (jsonData.data[0]?.images?.[0]) {
            const firstImageUrl = jsonData.data[0].images[0]
            console.log(`\n🧪 Testing first image URL: ${firstImageUrl}`)
            testImageUrl(firstImageUrl)
          }
        }
      } catch (e) {
        console.error('❌ Failed to parse JSON:', e.message)
        console.log('Raw response:', data.substring(0, 500))
      }
    })
  })

  req.on('error', (e) => {
    console.error('❌ Request error:', e.message)
  })

  req.end()
}

function testImageUrl(imageUrl) {
  if (!imageUrl.startsWith('/api/image/')) {
    console.log('⏭️  Skipping non-API image URL')
    return
  }

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: imageUrl,
    method: 'GET'
  }

  const req = http.request(options, (res) => {
    console.log(`📸 Image test result: ${res.statusCode}`)
    if (res.statusCode === 200) {
      console.log('✅ Image is accessible')
    } else {
      console.log('❌ Image is not accessible')
    }
  })

  req.on('error', (e) => {
    console.error('❌ Image request error:', e.message)
  })

  req.end()
}

testFrontendAPI()
