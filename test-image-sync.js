#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { readFileSync, existsSync } = require('fs')
const { join } = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 获取文件MIME类型
function getMimeType(filename) {
  const ext = filename.toLowerCase().split('.').pop()
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp'
  }
  return mimeTypes[ext] || 'image/jpeg'
}

async function testImageSync() {
  console.log('🧪 TESTING IMAGE SYNC TO DATABASE')
  console.log('============================================================')

  try {
    // 1. 测试数据库连接
    console.log('\n🔌 STEP 1: TESTING DATABASE CONNECTION')
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (testError) {
      console.log('❌ Database connection failed:', testError.message)
      return false
    }
    console.log('✅ Database connection successful')

    // 2. 检查 image_storage 表是否存在
    console.log('\n🗄️  STEP 2: CHECKING IMAGE_STORAGE TABLE')
    const { data: tableData, error: tableError } = await supabase
      .from('image_storage')
      .select('id')
      .limit(1)

    if (tableError) {
      console.log('❌ image_storage table not accessible:', tableError.message)
      console.log('📝 Please create the table using CREATE_IMAGE_STORAGE_TABLE.sql')
      return false
    }
    console.log('✅ image_storage table exists and accessible')

    // 3. 获取产品数据
    console.log('\n📦 STEP 3: FETCHING PRODUCTS')
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, images, is_active')
      .eq('is_active', true)

    if (productsError) {
      console.log('❌ Failed to fetch products:', productsError.message)
      return false
    }

    console.log(`✅ Found ${products.length} active products`)

    // 4. 测试同步一个图片
    console.log('\n💾 STEP 4: TESTING IMAGE SYNC')
    
    let testFilename = null
    let testProduct = null

    // 找到第一个有图片的产品
    for (const product of products) {
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const imageUrl = product.images[0]
        if (typeof imageUrl === 'string') {
          testFilename = imageUrl.replace('/api/image/', '').replace(/[^a-zA-Z0-9.-]/g, '')
          testProduct = product
          break
        }
      }
    }

    if (!testFilename) {
      console.log('⚠️  No images found to test')
      return true
    }

    console.log(`🔍 Testing with: ${testFilename}`)

    // 检查本地文件
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const localPath = join(uploadsDir, testFilename)

    if (!existsSync(localPath)) {
      console.log(`❌ Local file not found: ${localPath}`)
      return false
    }

    // 检查是否已存在于数据库
    const { data: existingData, error: existingError } = await supabase
      .from('image_storage')
      .select('id, filename')
      .eq('filename', testFilename)
      .single()

    if (existingData) {
      console.log(`✅ Image already exists in database: ${testFilename}`)
      return true
    }

    // 读取文件并上传
    console.log(`📤 Uploading ${testFilename} to database...`)
    
    const fileBuffer = readFileSync(localPath)
    const base64Data = fileBuffer.toString('base64')
    const mimeType = getMimeType(testFilename)
    const dataUrl = `data:${mimeType};base64,${base64Data}`

    const { error: insertError } = await supabase
      .from('image_storage')
      .insert({
        filename: testFilename,
        data: dataUrl,
        mime_type: mimeType,
        size: fileBuffer.length,
        product_id: testProduct.id,
        created_at: new Date().toISOString()
      })

    if (insertError) {
      console.log(`❌ Failed to upload ${testFilename}:`, insertError.message)
      return false
    }

    console.log(`✅ Successfully uploaded ${testFilename} (${fileBuffer.length} bytes)`)

    // 5. 验证上传
    console.log('\n✅ STEP 5: VERIFYING UPLOAD')
    const { data: verifyData, error: verifyError } = await supabase
      .from('image_storage')
      .select('filename, size, mime_type')
      .eq('filename', testFilename)
      .single()

    if (verifyError) {
      console.log('❌ Verification failed:', verifyError.message)
      return false
    }

    console.log('✅ Upload verified successfully:')
    console.log(`   📄 Filename: ${verifyData.filename}`)
    console.log(`   📏 Size: ${verifyData.size} bytes`)
    console.log(`   🎭 MIME Type: ${verifyData.mime_type}`)

    return true

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

async function main() {
  const success = await testImageSync()
  
  console.log('\n📊 TEST SUMMARY')
  console.log('============================================================')
  
  if (success) {
    console.log('🎉 Image sync test PASSED!')
    console.log('✅ Database is ready for image synchronization')
    console.log('🚀 You can now run: node production-image-sync.js')
  } else {
    console.log('❌ Image sync test FAILED!')
    console.log('📝 Please check the errors above and fix them')
    console.log('💡 Make sure to create the image_storage table first')
  }
  
  process.exit(success ? 0 : 1)
}

main()
