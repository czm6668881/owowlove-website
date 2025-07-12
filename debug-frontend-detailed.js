#!/usr/bin/env node

const http = require('http')

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    }

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        })
      })
    })

    req.on('error', (e) => {
      reject(e)
    })

    req.end()
  })
}

async function debugFrontend() {
  console.log('🔍 Debugging frontend image display...')
  
  try {
    // 1. 测试产品API
    console.log('\n📡 Testing products API...')
    const productsResponse = await makeRequest('/api/products')
    console.log(`Status: ${productsResponse.status}`)
    
    if (productsResponse.status === 200) {
      const productsData = JSON.parse(productsResponse.data)
      console.log(`✅ Products API working: ${productsData.data?.length || 0} products`)
      
      if (productsData.data && productsData.data.length > 0) {
        productsData.data.forEach((product, index) => {
          console.log(`\n📦 Product ${index + 1}: ${product.name}`)
          console.log(`   ID: ${product.id}`)
          console.log(`   Active: ${product.is_active}`)
          console.log(`   Images: ${JSON.stringify(product.images)}`)
          
          if (product.images && product.images.length > 0) {
            product.images.forEach((img, imgIndex) => {
              console.log(`   Image ${imgIndex + 1}: ${img}`)
            })
          }
        })
        
        // 2. 测试第一个图片URL
        const firstProduct = productsData.data[0]
        if (firstProduct.images && firstProduct.images.length > 0) {
          const imageUrl = firstProduct.images[0]
          console.log(`\n🖼️ Testing first image: ${imageUrl}`)
          
          try {
            const imageResponse = await makeRequest(imageUrl)
            console.log(`Image status: ${imageResponse.status}`)
            console.log(`Content-Type: ${imageResponse.headers['content-type']}`)
            console.log(`Content-Length: ${imageResponse.headers['content-length']}`)
            
            if (imageResponse.status === 200) {
              console.log('✅ Image is accessible')
            } else {
              console.log('❌ Image is not accessible')
            }
          } catch (error) {
            console.error('❌ Image request failed:', error.message)
          }
        }
      }
    } else {
      console.log('❌ Products API failed')
    }
    
    // 3. 测试主页HTML
    console.log('\n🌐 Testing main page...')
    const pageResponse = await makeRequest('/en')
    console.log(`Main page status: ${pageResponse.status}`)
    
    if (pageResponse.status === 200) {
      // 检查HTML中是否包含图片标签
      const hasImages = pageResponse.data.includes('<img')
      const hasProductImages = pageResponse.data.includes('/api/image/')
      
      console.log(`Has img tags: ${hasImages}`)
      console.log(`Has product images: ${hasProductImages}`)
      
      // 查找图片URL
      const imageMatches = pageResponse.data.match(/src="[^"]*\/api\/image\/[^"]*"/g)
      if (imageMatches) {
        console.log('Found image URLs in HTML:')
        imageMatches.forEach((match, index) => {
          console.log(`  ${index + 1}. ${match}`)
        })
      } else {
        console.log('❌ No /api/image/ URLs found in HTML')
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message)
  }
}

debugFrontend()
