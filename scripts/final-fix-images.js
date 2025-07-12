#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const { existsSync } = require('fs')
const { join } = require('path')
const http = require('http')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testImageUrl(url) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: url,
      method: 'GET'
    }

    const req = http.request(options, (res) => {
      resolve(res.statusCode === 200)
    })

    req.on('error', () => {
      resolve(false)
    })

    req.setTimeout(5000, () => {
      req.destroy()
      resolve(false)
    })

    req.end()
  })
}

async function finalFixImages() {
  console.log('🔧 Final image fix...')
  
  try {
    // 1. 获取所有产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, is_active')

    if (error) throw error

    console.log(`📦 Found ${products.length} products`)

    let fixedCount = 0

    for (const product of products) {
      console.log(`\n🔍 Product: ${product.name}`)
      console.log(`   Active: ${product.is_active}`)
      console.log(`   Images:`, product.images)

      if (!product.images || product.images.length === 0) {
        console.log('   ⚠️  No images')
        continue
      }

      let needsUpdate = false
      const fixedImages = []

      for (let i = 0; i < product.images.length; i++) {
        const imageUrl = product.images[i]
        console.log(`   📸 Processing image ${i + 1}: ${imageUrl}`)

        let finalUrl = imageUrl

        // 处理损坏的JSON数据
        if (typeof imageUrl === 'string' && imageUrl.includes('"url":')) {
          try {
            const urlMatch = imageUrl.match(/"url":"([^"]+)"/);
            if (urlMatch) {
              finalUrl = urlMatch[1]
              needsUpdate = true
              console.log(`   🔧 Extracted from JSON: ${finalUrl}`)
            }
          } catch (e) {
            console.log(`   ❌ Failed to extract from JSON`)
            continue
          }
        }

        // 确保URL格式正确
        if (typeof finalUrl === 'string' && !finalUrl.startsWith('/api/image/') && !finalUrl.startsWith('http')) {
          // 提取文件名
          const filename = finalUrl.split('/').pop()
          finalUrl = `/api/image/${filename}`
          needsUpdate = true
          console.log(`   🔧 Fixed URL format: ${finalUrl}`)
        }

        // 检查文件是否存在
        if (finalUrl.startsWith('/api/image/')) {
          const filename = finalUrl.replace('/api/image/', '')
          const filePath = join(process.cwd(), 'public', 'uploads', filename)
          
          if (existsSync(filePath)) {
            console.log(`   ✅ File exists: ${filename}`)
            
            // 测试URL是否可访问
            const accessible = await testImageUrl(finalUrl)
            if (accessible) {
              console.log(`   ✅ URL accessible: ${finalUrl}`)
              fixedImages.push(finalUrl)
            } else {
              console.log(`   ❌ URL not accessible: ${finalUrl}`)
              fixedImages.push(finalUrl) // 仍然保留，可能是服务器问题
            }
          } else {
            console.log(`   ❌ File not found: ${filename}`)
            // 不添加到fixedImages，这样会移除无效的图片
            needsUpdate = true
          }
        } else {
          fixedImages.push(finalUrl)
        }
      }

      // 如果需要更新，保存到数据库
      if (needsUpdate && fixedImages.length > 0) {
        console.log(`   💾 Updating product...`)
        console.log(`   Old: ${JSON.stringify(product.images)}`)
        console.log(`   New: ${JSON.stringify(fixedImages)}`)

        const { error: updateError } = await supabase
          .from('products')
          .update({ images: fixedImages })
          .eq('id', product.id)

        if (updateError) {
          console.log(`   ❌ Failed to update: ${updateError.message}`)
        } else {
          console.log(`   ✅ Successfully updated`)
          fixedCount++
        }
      } else if (fixedImages.length === 0) {
        console.log(`   ⚠️  No valid images found`)
      } else {
        console.log(`   ✅ No update needed`)
      }
    }

    console.log(`\n🎉 Fixed ${fixedCount} products`)

    // 2. 测试API端点
    console.log('\n🧪 Testing API endpoints...')
    
    const testUrls = [
      '/api/products',
      '/api/image/product-1752068376427.jpg',
      '/api/image/product-1752080189101.jpeg'
    ]

    for (const url of testUrls) {
      const accessible = await testImageUrl(url)
      console.log(`${accessible ? '✅' : '❌'} ${url}`)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

async function main() {
  console.log('🎯 OWOWLOVE Final Image Fix')
  console.log('=' * 40)
  
  await finalFixImages()
  
  console.log('\n✨ Final fix completed!')
  console.log('🔄 Please refresh your browser to see the changes.')
}

main().catch(console.error)
