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

async function fixCorruptedImageData() {
  console.log('🔧 Fixing corrupted image data...')
  
  try {
    // 获取所有产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images')

    if (error) throw error

    console.log(`📦 Found ${products.length} products`)

    let fixedCount = 0

    for (const product of products) {
      if (!product.images || product.images.length === 0) {
        continue
      }

      console.log(`\n🔍 Checking product: ${product.name}`)
      
      let needsUpdate = false
      const fixedImages = []

      for (const imageUrl of product.images) {
        console.log(`   📸 Original: ${imageUrl}`)

        // 检查是否包含JSON格式的数据
        if (typeof imageUrl === 'string' && imageUrl.includes('"url":')) {
          console.log('   🔧 Found corrupted JSON data, extracting URL...')
          
          try {
            // 尝试提取URL
            const urlMatch = imageUrl.match(/"url":"([^"]+)"/);
            if (urlMatch) {
              const extractedUrl = urlMatch[1]
              console.log(`   ✅ Extracted URL: ${extractedUrl}`)
              fixedImages.push(extractedUrl)
              needsUpdate = true
            } else {
              console.log('   ❌ Could not extract URL from corrupted data')
              // 尝试其他方法
              if (imageUrl.includes('/api/image/')) {
                const apiMatch = imageUrl.match(/\/api\/image\/[^"]+/)
                if (apiMatch) {
                  const extractedUrl = apiMatch[0]
                  console.log(`   ✅ Extracted API URL: ${extractedUrl}`)
                  fixedImages.push(extractedUrl)
                  needsUpdate = true
                } else {
                  console.log('   ❌ Could not extract API URL')
                  fixedImages.push(imageUrl) // 保持原样
                }
              } else {
                fixedImages.push(imageUrl) // 保持原样
              }
            }
          } catch (e) {
            console.log(`   ❌ Error parsing corrupted data: ${e.message}`)
            fixedImages.push(imageUrl) // 保持原样
          }
        } else {
          // 正常的URL，直接添加
          fixedImages.push(imageUrl)
        }
      }

      // 如果需要更新，保存到数据库
      if (needsUpdate) {
        console.log(`   💾 Updating product with fixed images...`)
        console.log(`   Old: ${JSON.stringify(product.images)}`)
        console.log(`   New: ${JSON.stringify(fixedImages)}`)

        const { error: updateError } = await supabase
          .from('products')
          .update({ images: fixedImages })
          .eq('id', product.id)

        if (updateError) {
          console.log(`   ❌ Failed to update: ${updateError.message}`)
        } else {
          console.log(`   ✅ Successfully updated product`)
          fixedCount++
        }
      } else {
        console.log(`   ✅ No corruption found`)
      }
    }

    console.log(`\n🎉 Fixed ${fixedCount} products`)

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

async function main() {
  console.log('🎯 OWOWLOVE Corrupted Image Data Fixer')
  console.log('=' * 40)
  
  await fixCorruptedImageData()
  
  console.log('\n✨ Corruption fix completed!')
}

main().catch(console.error)
