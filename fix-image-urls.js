#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixImageUrls() {
  console.log('🔧 Checking and fixing image URLs...')
  
  try {
    // 获取所有产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images')

    if (error) throw error

    console.log(`📦 Found ${products.length} products`)

    for (const product of products) {
      console.log(`\n🔍 Checking product: ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Images: ${JSON.stringify(product.images)}`)
      
      if (product.images && Array.isArray(product.images)) {
        let needsUpdate = false
        const fixedImages = product.images.map((imageUrl, index) => {
          console.log(`   Image ${index + 1}: ${imageUrl}`)
          
          if (typeof imageUrl === 'string') {
            // 检查是否有多余的字符
            let fixedUrl = imageUrl.trim()
            
            // 移除末尾的数字（如果不是文件扩展名的一部分）
            if (fixedUrl.match(/\.(jpg|jpeg|png|gif|webp)\d+$/i)) {
              const originalUrl = fixedUrl
              fixedUrl = fixedUrl.replace(/(\.(jpg|jpeg|png|gif|webp))\d+$/i, '$1')
              console.log(`     🔧 Fixed: ${originalUrl} → ${fixedUrl}`)
              needsUpdate = true
            }
            
            // 确保使用正确的API格式
            if (!fixedUrl.startsWith('/api/image/') && !fixedUrl.startsWith('http')) {
              if (fixedUrl.startsWith('/uploads/') || fixedUrl.startsWith('/product-images/')) {
                const filename = fixedUrl.split('/').pop()
                fixedUrl = `/api/image/${filename}`
                console.log(`     🔧 Converted to API format: ${fixedUrl}`)
                needsUpdate = true
              } else if (!fixedUrl.startsWith('/')) {
                fixedUrl = `/api/image/${fixedUrl}`
                console.log(`     🔧 Added API prefix: ${fixedUrl}`)
                needsUpdate = true
              }
            }
            
            return fixedUrl
          }
          
          return imageUrl
        })
        
        if (needsUpdate) {
          console.log(`   ✅ Updating product with fixed images:`, fixedImages)
          
          const { error: updateError } = await supabase
            .from('products')
            .update({ images: fixedImages })
            .eq('id', product.id)
          
          if (updateError) {
            console.error(`   ❌ Failed to update product ${product.id}:`, updateError.message)
          } else {
            console.log(`   ✅ Successfully updated product ${product.id}`)
          }
        } else {
          console.log(`   ✅ No changes needed`)
        }
      } else {
        console.log(`   ⚠️  No images or invalid format`)
      }
    }

    console.log('\n🎉 Image URL fix completed!')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

fixImageUrls()
