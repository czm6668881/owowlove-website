#!/usr/bin/env node

const http = require('http')

function testAPI() {
  console.log('🔍 Testing API data...')
  
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
        
        if (jsonData.success && jsonData.data) {
          console.log(`📦 Found ${jsonData.data.length} products`)
          
          jsonData.data.forEach((product, index) => {
            console.log(`\n${index + 1}. Product: ${product.name}`)
            console.log(`   ID: ${product.id}`)
            console.log(`   Active: ${product.is_active}`)
            console.log(`   Images type: ${typeof product.images}`)
            console.log(`   Images array: ${Array.isArray(product.images)}`)
            console.log(`   Images raw: ${JSON.stringify(product.images)}`)
            
            if (product.images && product.images.length > 0) {
              product.images.forEach((img, imgIndex) => {
                console.log(`   Image ${imgIndex + 1}:`)
                console.log(`     Type: ${typeof img}`)
                console.log(`     Value: "${img}"`)
                console.log(`     Length: ${img.length}`)
                console.log(`     Ends with: "${img.slice(-5)}"`)
                
                // 检查是否有异常字符
                for (let i = 0; i < img.length; i++) {
                  const char = img[i]
                  const code = char.charCodeAt(0)
                  if (code < 32 || code > 126) {
                    console.log(`     ⚠️  Unusual character at position ${i}: "${char}" (code: ${code})`)
                  }
                }
              })
            }
          })
        } else {
          console.log('❌ API Error:', jsonData.error)
        }
      } catch (e) {
        console.error('❌ Failed to parse JSON:', e.message)
        console.log('Raw response (first 500 chars):', data.substring(0, 500))
      }
    })
  })

  req.on('error', (e) => {
    console.error('❌ Request error:', e.message)
  })

  req.end()
}

testAPI()
