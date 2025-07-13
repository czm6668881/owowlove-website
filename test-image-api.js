#!/usr/bin/env node

const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

async function testImageAPI() {
  console.log('🧪 TESTING IMAGE API FUNCTIONALITY')
  console.log('============================================================')

  try {
    // 1. 检查映射文件
    console.log('\n📄 STEP 1: CHECKING IMAGE MAPPING FILE')
    const mappingPath = join(process.cwd(), 'public', 'image-mapping.json')
    
    if (!existsSync(mappingPath)) {
      console.log('❌ Image mapping file not found')
      return false
    }

    const mappingData = JSON.parse(readFileSync(mappingPath, 'utf-8'))
    console.log('✅ Image mapping file found')
    console.log(`   📊 Total images: ${mappingData.totalImages || 'unknown'}`)
    console.log(`   📅 Last updated: ${mappingData.lastUpdated || 'unknown'}`)

    // 2. 检查映射文件中的图片
    console.log('\n🖼️  STEP 2: CHECKING MAPPED IMAGES')
    const images = mappingData.images || mappingData
    const imageList = Object.keys(images)
    
    if (imageList.length === 0) {
      console.log('❌ No images found in mapping file')
      return false
    }

    console.log(`✅ Found ${imageList.length} images in mapping:`)
    imageList.forEach((filename, index) => {
      const imageData = images[filename]
      const size = imageData.size || 'unknown'
      const mimeType = imageData.mimeType || imageData.mime_type || 'unknown'
      console.log(`   ${index + 1}. ${filename} (${size} bytes, ${mimeType})`)
    })

    // 3. 检查本地图片文件
    console.log('\n📁 STEP 3: CHECKING LOCAL IMAGE FILES')
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    let localFilesFound = 0
    
    for (const filename of imageList) {
      const localPath = join(uploadsDir, filename)
      if (existsSync(localPath)) {
        localFilesFound++
        console.log(`   ✅ ${filename} - local file exists`)
      } else {
        console.log(`   ⚠️  ${filename} - local file missing (will use mapping)`)
      }
    }

    console.log(`📊 Local files: ${localFilesFound}/${imageList.length} found`)

    // 4. 验证映射文件数据完整性
    console.log('\n🔍 STEP 4: VALIDATING MAPPING DATA')
    let validImages = 0
    
    for (const filename of imageList) {
      const imageData = images[filename]
      
      if (!imageData.data) {
        console.log(`   ❌ ${filename} - missing data field`)
        continue
      }
      
      if (!imageData.data.startsWith('data:')) {
        console.log(`   ❌ ${filename} - invalid data URL format`)
        continue
      }
      
      const base64Part = imageData.data.split(',')[1]
      if (!base64Part || base64Part.length < 100) {
        console.log(`   ❌ ${filename} - invalid or too short base64 data`)
        continue
      }
      
      validImages++
      console.log(`   ✅ ${filename} - data valid (${base64Part.length} chars)`)
    }

    console.log(`📊 Valid images: ${validImages}/${imageList.length}`)

    // 5. 测试图片API路径
    console.log('\n🌐 STEP 5: TESTING API PATHS')
    
    // 检查API路由文件
    const apiRoutePath = join(process.cwd(), 'app', 'api', 'image', '[filename]', 'route.ts')
    if (!existsSync(apiRoutePath)) {
      console.log('❌ Image API route file not found')
      return false
    }
    
    console.log('✅ Image API route file exists')
    
    // 读取API文件内容检查关键功能
    const apiContent = readFileSync(apiRoutePath, 'utf-8')
    const hasMapping = apiContent.includes('loadImageFromMapping')
    const hasDatabase = apiContent.includes('loadImageFromDatabase')
    const hasPlaceholder = apiContent.includes('generatePlaceholderImage')
    
    console.log(`   📋 Mapping fallback: ${hasMapping ? '✅' : '❌'}`)
    console.log(`   📋 Database fallback: ${hasDatabase ? '✅' : '❌'}`)
    console.log(`   📋 Placeholder fallback: ${hasPlaceholder ? '✅' : '❌'}`)

    // 6. 生成测试URL
    console.log('\n🔗 STEP 6: GENERATING TEST URLS')
    const testImage = imageList[0]
    if (testImage) {
      console.log('📝 Test these URLs in your browser or with curl:')
      console.log(`   Local dev: http://localhost:3000/api/image/${testImage}`)
      console.log(`   Production: https://owowlove.com/api/image/${testImage}`)
      console.log('')
      console.log('💡 Expected behavior:')
      console.log('   - Local: Should load from file system first, then mapping')
      console.log('   - Production: Should load from mapping file (since files don\'t exist)')
    }

    return validImages > 0

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

async function main() {
  const success = await testImageAPI()
  
  console.log('\n📊 API TEST SUMMARY')
  console.log('============================================================')
  
  if (success) {
    console.log('🎉 Image API test PASSED!')
    console.log('✅ Mapping file is ready for production')
    console.log('🚀 Images should display correctly on production website')
    console.log('')
    console.log('🌐 Next steps:')
    console.log('   1. Deploy your code to production')
    console.log('   2. Test image display on https://owowlove.com')
    console.log('   3. Create image_storage table for database backup')
  } else {
    console.log('❌ Image API test FAILED!')
    console.log('📝 Please check the errors above and fix them')
    console.log('💡 Run: node update-image-mapping.js to regenerate mapping')
  }
  
  process.exit(success ? 0 : 1)
}

main()
