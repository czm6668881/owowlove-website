#!/usr/bin/env node

// 测试图片上传API的脚本
const fs = require('fs')
const path = require('path')

async function testImageUpload() {
  console.log('🔍 TESTING IMAGE UPLOAD API')
  console.log('============================================================')
  
  try {
    // 1. 检查本地环境
    console.log('\n📁 STEP 1: CHECKING LOCAL ENVIRONMENT')
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    console.log(`   Upload directory: ${uploadsDir}`)
    console.log(`   Directory exists: ${fs.existsSync(uploadsDir)}`)
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('   📁 Creating uploads directory...')
      fs.mkdirSync(uploadsDir, { recursive: true })
      console.log('   ✅ Directory created')
    }
    
    // 检查权限
    try {
      const testFile = path.join(uploadsDir, 'test-write.txt')
      fs.writeFileSync(testFile, 'test')
      fs.unlinkSync(testFile)
      console.log('   ✅ Write permissions OK')
    } catch (error) {
      console.log('   ❌ Write permission error:', error.message)
    }

    // 2. 测试本地API
    console.log('\n🌐 STEP 2: TESTING LOCAL API')
    
    // 创建一个测试图片文件
    const testImagePath = path.join(process.cwd(), 'test-image.jpg')
    if (!fs.existsSync(testImagePath)) {
      // 创建一个简单的测试图片（1x1像素的JPEG）
      const jpegHeader = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
        0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
        0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
        0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x80, 0xFF, 0xD9
      ])
      fs.writeFileSync(testImagePath, jpegHeader)
      console.log('   📸 Created test image file')
    }

    // 测试API端点
    const testUrl = 'http://localhost:3002/api/admin/upload-image'
    console.log(`   Testing URL: ${testUrl}`)
    
    try {
      // 使用fetch测试（需要Node.js 18+）
      const FormData = require('form-data')
      const fetch = require('node-fetch')
      
      const form = new FormData()
      form.append('image', fs.createReadStream(testImagePath), {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      })
      
      console.log('   📤 Sending test upload request...')
      const response = await fetch(testUrl, {
        method: 'POST',
        body: form
      })
      
      console.log(`   📊 Response status: ${response.status}`)
      console.log(`   📊 Response headers:`, Object.fromEntries(response.headers.entries()))
      
      const responseText = await response.text()
      console.log(`   📊 Response body: ${responseText}`)
      
      if (response.ok) {
        console.log('   ✅ Local API test successful')
        try {
          const result = JSON.parse(responseText)
          if (result.success) {
            console.log(`   📸 Image URL: ${result.url}`)
            console.log(`   📁 Filename: ${result.filename}`)
          }
        } catch (parseError) {
          console.log('   ⚠️  Response is not JSON')
        }
      } else {
        console.log('   ❌ Local API test failed')
      }
      
    } catch (fetchError) {
      console.log('   ❌ Fetch error:', fetchError.message)
      console.log('   💡 Make sure the development server is running (npm run dev)')
    }

    // 3. 检查生产环境
    console.log('\n🌐 STEP 3: TESTING PRODUCTION API')
    const prodUrl = 'https://owowlove.com/api/admin/upload-image'
    console.log(`   Testing URL: ${prodUrl}`)
    
    try {
      const FormData = require('form-data')
      const fetch = require('node-fetch')
      
      const form = new FormData()
      form.append('image', fs.createReadStream(testImagePath), {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      })
      
      console.log('   📤 Sending production upload request...')
      const response = await fetch(prodUrl, {
        method: 'POST',
        body: form
      })
      
      console.log(`   📊 Response status: ${response.status}`)
      console.log(`   📊 Response headers:`, Object.fromEntries(response.headers.entries()))
      
      const responseText = await response.text()
      console.log(`   📊 Response body: ${responseText.substring(0, 500)}...`)
      
      if (response.ok) {
        console.log('   ✅ Production API test successful')
      } else {
        console.log('   ❌ Production API test failed')
        
        // 分析常见错误
        if (response.status === 500) {
          console.log('   🔍 500 Error Analysis:')
          console.log('     - Possible file system permission issues')
          console.log('     - Possible directory creation failures')
          console.log('     - Possible memory/disk space issues')
        }
      }
      
    } catch (fetchError) {
      console.log('   ❌ Production fetch error:', fetchError.message)
    }

    // 4. 清理
    console.log('\n🧹 STEP 4: CLEANUP')
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath)
      console.log('   ✅ Test image file removed')
    }

    console.log('\n📊 SUMMARY')
    console.log('============================================================')
    console.log('   If you see 500 errors, the issue is likely:')
    console.log('   1. File system permissions in production')
    console.log('   2. Missing uploads directory in production')
    console.log('   3. Vercel function limitations')
    console.log('')
    console.log('   Recommended fixes:')
    console.log('   1. Use /tmp directory for Vercel')
    console.log('   2. Implement cloud storage (Cloudinary/AWS S3)')
    console.log('   3. Add better error handling')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// 检查是否有必要的依赖
async function checkDependencies() {
  try {
    require('node-fetch')
    require('form-data')
    return true
  } catch (error) {
    console.log('❌ Missing dependencies. Installing...')
    console.log('   Run: npm install node-fetch form-data')
    return false
  }
}

// 运行测试
checkDependencies().then(hasDepends => {
  if (hasDepends) {
    testImageUpload()
  }
})
