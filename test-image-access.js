// Test image upload and access
const http = require('http')
const fs = require('fs')
const path = require('path')

async function testImageAccess(imagePath) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: imagePath,
      method: 'GET'
    }

    const req = http.request(options, (res) => {
      console.log(`📷 Testing image: ${imagePath}`)
      console.log(`   Status: ${res.statusCode}`)
      console.log(`   Content-Type: ${res.headers['content-type']}`)
      console.log(`   Content-Length: ${res.headers['content-length']}`)
      
      if (res.statusCode === 200) {
        console.log(`   ✅ Image accessible`)
      } else {
        console.log(`   ❌ Image not accessible`)
      }
      
      resolve({
        success: res.statusCode === 200,
        status: res.statusCode,
        contentType: res.headers['content-type'],
        contentLength: res.headers['content-length']
      })
    })

    req.on('error', (error) => {
      console.log(`   ❌ Request error: ${error.message}`)
      resolve({ success: false, error: error.message })
    })

    req.end()
  })
}

async function testUploadAPI() {
  return new Promise((resolve) => {
    // Create a simple test for the upload API
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/upload-image',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        console.log(`🔧 Upload API Test:`)
        console.log(`   Status: ${res.statusCode}`)
        console.log(`   Response: ${data}`)
        
        resolve({
          success: res.statusCode === 400, // Expected 400 for no file
          status: res.statusCode,
          response: data
        })
      })
    })

    req.on('error', (error) => {
      console.log(`   ❌ API error: ${error.message}`)
      resolve({ success: false, error: error.message })
    })

    req.end()
  })
}

async function checkUploadedFiles() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  
  console.log('📁 Checking uploaded files:')
  console.log(`   Directory: ${uploadsDir}`)
  
  try {
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir)
      console.log(`   Found ${files.length} files:`)
      
      const imageFiles = files.filter(file => 
        file.match(/\.(jpg|jpeg|png|gif|webp)$/i)
      )
      
      for (const file of imageFiles.slice(0, 3)) { // Test first 3 images
        console.log(`     - ${file}`)
        await testImageAccess(`/uploads/${file}`)
      }
      
      return imageFiles
    } else {
      console.log('   ❌ Uploads directory does not exist')
      return []
    }
  } catch (error) {
    console.log(`   ❌ Error reading directory: ${error.message}`)
    return []
  }
}

async function runImageTest() {
  console.log('🖼️  Testing Image Upload and Access')
  console.log('=' * 50)
  
  // Test upload API
  await testUploadAPI()
  
  console.log('')
  
  // Check uploaded files
  const imageFiles = await checkUploadedFiles()
  
  console.log('')
  
  // Test some common image paths
  const testPaths = [
    '/uploads/product-1751797917528.jpg',
    '/uploads/product-1751798944448.jpg',
    '/placeholder.jpg',
    '/placeholder-product.jpg'
  ]
  
  console.log('🔍 Testing common image paths:')
  for (const testPath of testPaths) {
    await testImageAccess(testPath)
  }
  
  console.log('\n💡 Troubleshooting Tips:')
  console.log('1. Check browser console for 404 errors')
  console.log('2. Verify image URLs in network tab')
  console.log('3. Check if images load directly: http://localhost:3000/uploads/[filename]')
  console.log('4. Ensure Next.js dev server is running')
  console.log('5. Check if public/uploads directory has correct permissions')
}

runImageTest().catch(error => {
  console.error('❌ Image test failed:', error.message)
})
