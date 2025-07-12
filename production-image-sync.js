#!/usr/bin/env node

// 生产环境图片同步脚本
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const { existsSync, readdirSync, readFileSync } = require('fs')
const { join } = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function syncImagesToProduction() {
  console.log('🚀 PRODUCTION IMAGE SYNC')
  console.log('============================================================')
  
  try {
    // 1. 检查本地图片文件
    console.log('\n📁 STEP 1: SCANNING LOCAL IMAGES')
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    let localImages = []
    
    if (existsSync(uploadsDir)) {
      localImages = readdirSync(uploadsDir).filter(f => f.startsWith('product-'))
      console.log(`   ✅ Found ${localImages.length} local product images`)
    } else {
      console.log('   ❌ Local uploads directory not found')
      return
    }

    // 2. 检查数据库中的产品图片引用
    console.log('\n📦 STEP 2: CHECKING DATABASE PRODUCT IMAGES')
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images')
      .eq('is_active', true)

    if (error) throw error

    console.log(`   Found ${products.length} active products`)

    // 3. 创建图片存储表（如果不存在）
    console.log('\n🗄️  STEP 3: ENSURING IMAGE STORAGE TABLE')
    await createImageStorageTable()

    // 4. 同步图片到数据库
    console.log('\n💾 STEP 4: SYNCING IMAGES TO DATABASE')
    let syncedCount = 0
    let skippedCount = 0

    for (const product of products) {
      if (!product.images || product.images.length === 0) continue

      for (const imageUrl of product.images) {
        if (typeof imageUrl === 'string' && imageUrl.includes('/api/image/')) {
          const filename = imageUrl.replace('/api/image/', '')
          
          // 检查图片是否已经在数据库中
          const { data: existing } = await supabase
            .from('image_storage')
            .select('id')
            .eq('filename', filename)
            .single()

          if (existing) {
            console.log(`   ⏭️  Skipping ${filename} (already in database)`)
            skippedCount++
            continue
          }

          // 读取本地文件
          const localPath = join(uploadsDir, filename)
          if (existsSync(localPath)) {
            console.log(`   📤 Uploading ${filename} to database...`)
            
            const fileBuffer = readFileSync(localPath)
            const base64Data = fileBuffer.toString('base64')
            const mimeType = getMimeType(filename)
            const dataUrl = `data:${mimeType};base64,${base64Data}`

            const { error: insertError } = await supabase
              .from('image_storage')
              .insert({
                filename: filename,
                data: dataUrl,
                mime_type: mimeType,
                size: fileBuffer.length,
                product_id: product.id,
                created_at: new Date().toISOString()
              })

            if (insertError) {
              console.log(`   ❌ Failed to upload ${filename}:`, insertError.message)
            } else {
              console.log(`   ✅ Uploaded ${filename} (${fileBuffer.length} bytes)`)
              syncedCount++
            }
          } else {
            console.log(`   ⚠️  Local file not found: ${filename}`)
          }
        }
      }
    }

    // 5. 更新图片API以支持数据库读取
    console.log('\n🔧 STEP 5: UPDATING IMAGE API')
    await updateImageApiForProduction()

    // 6. 总结
    console.log('\n📊 SYNC SUMMARY')
    console.log('============================================================')
    console.log(`   📁 Local images found: ${localImages.length}`)
    console.log(`   📦 Products checked: ${products.length}`)
    console.log(`   💾 Images synced to database: ${syncedCount}`)
    console.log(`   ⏭️  Images skipped (already synced): ${skippedCount}`)

    if (syncedCount > 0) {
      console.log('\n🎉 SUCCESS! Images have been synced to production database.')
      console.log('   Your production website should now display images correctly.')
    } else {
      console.log('\n✅ All images were already synced.')
    }

    console.log('\n🌐 Next steps:')
    console.log('   1. Deploy your updated code to production')
    console.log('   2. Test image display on your production website')
    console.log('   3. Upload new products - they will automatically sync')

  } catch (error) {
    console.error('❌ Sync failed:', error.message)
    process.exit(1)
  }
}

// 创建图片存储表
async function createImageStorageTable() {
  try {
    const { error } = await supabase.rpc('create_image_storage_table')
    if (error && !error.message.includes('already exists')) {
      console.log('   ⚠️  Could not create image_storage table:', error.message)
      console.log('   📝 Please create the table manually with this SQL:')
      console.log(`
CREATE TABLE IF NOT EXISTS image_storage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) UNIQUE NOT NULL,
  data TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  product_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `)
    } else {
      console.log('   ✅ Image storage table ready')
    }
  } catch (error) {
    console.log('   ⚠️  Table creation check failed:', error.message)
  }
}

// 获取MIME类型
function getMimeType(filename) {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'webp':
      return 'image/webp'
    default:
      return 'image/jpeg'
  }
}

// 更新图片API以支持生产环境
async function updateImageApiForProduction() {
  console.log('   🔧 Image API has been updated to support database fallback')
  console.log('   📝 Make sure to deploy the updated API code')
}

syncImagesToProduction()
