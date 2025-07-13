#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { readFileSync, writeFileSync, existsSync } = require('fs')
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

async function updateImageMapping() {
  console.log('🚀 UPDATING IMAGE MAPPING FILE')
  console.log('============================================================')

  try {
    // 1. 获取所有激活的产品
    console.log('\n📦 STEP 1: FETCHING ACTIVE PRODUCTS')
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, is_active')
      .eq('is_active', true)

    if (error) throw error

    console.log(`   ✅ Found ${products.length} active products`)

    // 2. 收集所有需要的图片文件名
    const imageFilenames = new Set()
    
    for (const product of products) {
      if (product.images && Array.isArray(product.images)) {
        for (const imageUrl of product.images) {
          if (typeof imageUrl === 'string') {
            // 从URL中提取文件名
            let filename = imageUrl
            if (imageUrl.startsWith('/api/image/')) {
              filename = imageUrl.replace('/api/image/', '')
            } else if (imageUrl.includes('/')) {
              filename = imageUrl.split('/').pop()
            }
            
            // 清理文件名
            filename = filename.replace(/[^a-zA-Z0-9.-]/g, '')
            if (filename && filename.includes('.')) {
              imageFilenames.add(filename)
            }
          }
        }
      }
    }

    console.log(`   📋 Found ${imageFilenames.size} unique image files needed`)

    // 3. 检查本地图片文件
    console.log('\n📁 STEP 2: SCANNING LOCAL IMAGES')
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const productImagesDir = join(process.cwd(), 'public', 'product-images')
    const publicDir = join(process.cwd(), 'public')

    const imageMapping = {}
    let foundCount = 0
    let missingCount = 0

    for (const filename of imageFilenames) {
      console.log(`   🔍 Processing: ${filename}`)
      
      // 检查多个可能的路径
      const possiblePaths = [
        join(uploadsDir, filename),
        join(productImagesDir, filename),
        join(publicDir, filename)
      ]

      let found = false
      for (const path of possiblePaths) {
        if (existsSync(path)) {
          try {
            const fileBuffer = readFileSync(path)
            const mimeType = getMimeType(filename)
            const base64Data = fileBuffer.toString('base64')
            const dataUrl = `data:${mimeType};base64,${base64Data}`

            imageMapping[filename] = {
              data: dataUrl,
              mimeType: mimeType,
              size: fileBuffer.length,
              path: path,
              lastUpdated: new Date().toISOString()
            }

            console.log(`     ✅ Found at: ${path} (${fileBuffer.length} bytes)`)
            foundCount++
            found = true
            break
          } catch (error) {
            console.log(`     ❌ Error reading ${path}: ${error.message}`)
          }
        }
      }

      if (!found) {
        console.log(`     ⚠️  Not found: ${filename}`)
        missingCount++
      }
    }

    // 4. 保存映射文件
    console.log('\n💾 STEP 3: SAVING IMAGE MAPPING')
    const mappingPath = join(process.cwd(), 'public', 'image-mapping.json')
    
    const mappingData = {
      lastUpdated: new Date().toISOString(),
      totalImages: foundCount,
      missingImages: missingCount,
      images: imageMapping
    }

    writeFileSync(mappingPath, JSON.stringify(mappingData, null, 2))
    console.log(`   ✅ Saved mapping to: ${mappingPath}`)

    // 5. 生成统计报告
    console.log('\n📊 MAPPING SUMMARY')
    console.log('============================================================')
    console.log(`   📁 Total images needed: ${imageFilenames.size}`)
    console.log(`   ✅ Images found and mapped: ${foundCount}`)
    console.log(`   ⚠️  Images missing: ${missingCount}`)
    console.log(`   📄 Mapping file size: ${JSON.stringify(mappingData).length} characters`)

    if (missingCount > 0) {
      console.log('\n⚠️  MISSING IMAGES:')
      for (const filename of imageFilenames) {
        if (!imageMapping[filename]) {
          console.log(`     - ${filename}`)
        }
      }
    }

    console.log('\n🌐 NEXT STEPS:')
    console.log('   1. Deploy your updated code to production')
    console.log('   2. Test image display on your production website')
    console.log('   3. Images will now load from mapping file as backup')

    return foundCount > 0

  } catch (error) {
    console.error('❌ Error updating image mapping:', error.message)
    return false
  }
}

updateImageMapping().then(success => {
  if (success) {
    console.log('\n🎉 Image mapping updated successfully!')
  } else {
    console.log('\n❌ Image mapping update failed')
  }
  process.exit(success ? 0 : 1)
})
