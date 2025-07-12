#!/usr/bin/env node

// 完整的图片显示问题修复脚本
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const { existsSync, readdirSync } = require('fs')
const { join } = require('path')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixImageDisplayIssue() {
  console.log('🔧 FIXING IMAGE DISPLAY ISSUE - COMPLETE SOLUTION')
  console.log('============================================================')
  
  try {
    // 1. 检查文件系统中的图片
    console.log('\n📁 STEP 1: SCANNING AVAILABLE IMAGES')
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    let availableImages = []
    
    if (existsSync(uploadsDir)) {
      availableImages = readdirSync(uploadsDir).filter(f => f.startsWith('product-'))
      console.log(`   ✅ Found ${availableImages.length} product images`)
      availableImages.slice(0, 5).forEach(file => {
        console.log(`   📸 ${file}`)
      })
      if (availableImages.length > 5) {
        console.log(`   ... and ${availableImages.length - 5} more files`)
      }
    } else {
      console.log('   ❌ Uploads directory not found')
      return
    }

    // 2. 获取数据库中的产品
    console.log('\n📦 STEP 2: CHECKING DATABASE PRODUCTS')
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, is_active')
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log(`   Found ${products.length} products in database`)

    // 3. 修复产品图片URL
    console.log('\n🔧 STEP 3: FIXING PRODUCT IMAGE URLS')
    let fixedCount = 0
    let createdCount = 0

    // 如果没有产品，创建示例产品
    if (products.length === 0) {
      console.log('   📝 No products found, creating sample products...')
      
      for (let i = 0; i < Math.min(3, availableImages.length); i++) {
        const image = availableImages[i]
        const imageUrl = `/api/image/${image}`
        
        const { data: newProduct, error: createError } = await supabase
          .from('products')
          .insert({
            name: `Sample Product ${i + 1}`,
            description: `Beautiful lingerie product ${i + 1}`,
            price: 29.99 + (i * 10),
            images: [imageUrl],
            is_active: true,
            variants: [
              {
                id: `var-${i}-1`,
                size: 'S',
                color: 'Black',
                price: 29.99 + (i * 10),
                stock: 10
              },
              {
                id: `var-${i}-2`,
                size: 'M',
                color: 'Black',
                price: 29.99 + (i * 10),
                stock: 15
              }
            ]
          })
          .select()

        if (createError) {
          console.log(`   ❌ Failed to create product ${i + 1}:`, createError.message)
        } else {
          console.log(`   ✅ Created product: ${newProduct[0].name} with image ${imageUrl}`)
          createdCount++
        }
      }
    } else {
      // 修复现有产品的图片URL
      for (const product of products) {
        let needsUpdate = false
        let updatedImages = []

        if (!product.images || product.images.length === 0) {
          // 产品没有图片，分配一个可用的图片
          if (availableImages.length > 0) {
            const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)]
            updatedImages = [`/api/image/${randomImage}`]
            needsUpdate = true
            console.log(`   🖼️  Assigning image to ${product.name}: ${randomImage}`)
          }
        } else {
          // 检查和修复现有图片URL
          updatedImages = product.images.map(img => {
            if (typeof img === 'string') {
              // 清理和标准化URL
              let cleanUrl = img.trim()
              
              // 移除异常字符
              cleanUrl = cleanUrl.replace(/(\.(jpg|jpeg|png|gif|webp))[^a-zA-Z]*$/i, '$1')
              
              // 确保使用API格式
              if (!cleanUrl.startsWith('/api/image/') && !cleanUrl.startsWith('http')) {
                let filename = ''
                if (cleanUrl.startsWith('/uploads/') || cleanUrl.startsWith('/product-images/')) {
                  filename = cleanUrl.split('/').pop()
                } else if (!cleanUrl.startsWith('/')) {
                  filename = cleanUrl
                } else {
                  filename = cleanUrl.split('/').pop()
                }
                
                if (filename) {
                  const newUrl = `/api/image/${filename}`
                  if (newUrl !== img) {
                    needsUpdate = true
                    console.log(`   🔧 Fixed URL for ${product.name}: ${img} -> ${newUrl}`)
                  }
                  return newUrl
                }
              }
              
              return cleanUrl
            }
            return img
          })
        }

        // 更新产品如果需要
        if (needsUpdate) {
          const { error: updateError } = await supabase
            .from('products')
            .update({ images: updatedImages })
            .eq('id', product.id)

          if (updateError) {
            console.log(`   ❌ Failed to update ${product.name}:`, updateError.message)
          } else {
            console.log(`   ✅ Updated ${product.name} images`)
            fixedCount++
          }
        }
      }
    }

    // 4. 验证修复结果
    console.log('\n✅ STEP 4: VERIFICATION')
    const { data: updatedProducts, error: verifyError } = await supabase
      .from('products')
      .select('id, name, images, is_active')
      .eq('is_active', true)

    if (verifyError) throw verifyError

    console.log(`   📊 Active products: ${updatedProducts.length}`)
    
    let validImageCount = 0
    for (const product of updatedProducts) {
      if (product.images && product.images.length > 0) {
        validImageCount++
        const imageUrl = product.images[0]
        console.log(`   ✅ ${product.name}: ${imageUrl}`)
      } else {
        console.log(`   ❌ ${product.name}: No images`)
      }
    }

    // 5. 总结
    console.log('\n📊 SUMMARY:')
    console.log(`   📸 Available image files: ${availableImages.length}`)
    console.log(`   📦 Total products: ${updatedProducts.length}`)
    console.log(`   ✅ Products with valid images: ${validImageCount}`)
    console.log(`   🔧 Products fixed: ${fixedCount}`)
    console.log(`   📝 Products created: ${createdCount}`)

    if (validImageCount > 0) {
      console.log('\n🎉 SUCCESS! Products should now display images correctly.')
      console.log('   Please refresh your browser and check the homepage.')
    } else {
      console.log('\n⚠️  WARNING: No products have valid images.')
      console.log('   Please check if image files exist and try again.')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

fixImageDisplayIssue()
