#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const { copyFile, readdir, mkdir } = require('fs/promises')
const { existsSync } = require('fs')
const { join } = require('path')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔧 Environment check:')
console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
console.log('SERVICE_KEY:', supabaseServiceKey ? 'Set' : 'Missing')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateImages() {
  console.log('🔄 Starting image migration...')
  
  try {
    // 1. 确保目标目录存在
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
      console.log('📁 Created uploads directory')
    }

    // 2. 检查源目录
    const productImagesDir = join(process.cwd(), 'public', 'product-images')
    if (!existsSync(productImagesDir)) {
      console.log('⚠️  No product-images directory found, checking uploads...')
    } else {
      // 3. 复制图片文件
      const files = await readdir(productImagesDir)
      console.log(`📸 Found ${files.length} images in product-images directory`)
      
      for (const file of files) {
        const sourcePath = join(productImagesDir, file)
        const targetPath = join(uploadsDir, file)
        
        if (!existsSync(targetPath)) {
          await copyFile(sourcePath, targetPath)
          console.log(`✅ Copied: ${file}`)
        } else {
          console.log(`⏭️  Skipped (exists): ${file}`)
        }
      }
    }

    // 4. 获取所有产品
    console.log('\n📦 Fetching products from database...')
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images')

    if (error) {
      throw error
    }

    console.log(`📊 Found ${products.length} products`)

    // 5. 更新图片URL
    let updatedCount = 0
    for (const product of products) {
      if (!product.images || product.images.length === 0) {
        console.log(`⏭️  Skipping ${product.name} (no images)`)
        continue
      }

      let needsUpdate = false
      const updatedImages = product.images.map(imageUrl => {
        // 处理字符串格式的图片URL
        if (typeof imageUrl === 'string') {
          // 如果包含JSON格式的数据，提取URL
          if (imageUrl.includes('"url":')) {
            try {
              const jsonMatch = imageUrl.match(/"url":"([^"]+)"/);
              if (jsonMatch) {
                needsUpdate = true
                return jsonMatch[1]
              }
            } catch (e) {
              console.log(`⚠️  Failed to parse JSON in image URL: ${imageUrl}`)
            }
          }

          // 如果图片URL不是以 /api/image/ 开头，则需要更新
          if (!imageUrl.startsWith('/api/image/')) {
            needsUpdate = true
            // 提取文件名
            const filename = imageUrl.split('/').pop()
            return `/api/image/${filename}`
          }
        }
        return imageUrl
      })

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ images: updatedImages })
          .eq('id', product.id)

        if (updateError) {
          console.error(`❌ Failed to update ${product.name}:`, updateError.message)
        } else {
          console.log(`✅ Updated ${product.name}`)
          console.log(`   Old: ${JSON.stringify(product.images)}`)
          console.log(`   New: ${JSON.stringify(updatedImages)}`)
          updatedCount++
        }
      } else {
        console.log(`⏭️  ${product.name} already has correct URLs`)
      }
    }

    console.log(`\n🎉 Migration completed!`)
    console.log(`📊 Updated ${updatedCount} products`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

async function testImageAccess() {
  console.log('\n🧪 Testing image access...')
  
  try {
    // 获取一个有图片的产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images')
      .not('images', 'is', null)
      .limit(1)

    if (error) throw error

    if (products.length === 0) {
      console.log('⚠️  No products with images found')
      return
    }

    const product = products[0]
    console.log(`🔍 Testing product: ${product.name}`)
    console.log(`📸 Images: ${JSON.stringify(product.images)}`)

    if (product.images && product.images.length > 0) {
      const imageUrl = product.images[0]
      console.log(`🌐 Image URL: ${imageUrl}`)
      
      // 检查文件是否存在
      if (typeof imageUrl === 'string' && imageUrl.startsWith('/api/image/')) {
        const filename = imageUrl.replace('/api/image/', '')
        const filePath = join(process.cwd(), 'public', 'uploads', filename)
        
        if (existsSync(filePath)) {
          console.log(`✅ Image file exists: ${filePath}`)
        } else {
          console.log(`❌ Image file missing: ${filePath}`)
        }
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

async function main() {
  console.log('🎯 OWOWLOVE Image Path Fix')
  console.log('=' * 40)
  
  await migrateImages()
  await testImageAccess()
  
  console.log('\n✨ All done! Your images should now display correctly.')
}

main().catch(console.error)
