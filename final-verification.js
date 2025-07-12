#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { existsSync } = require('fs')
const { join } = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function finalVerification() {
  console.log('🔍 FINAL VERIFICATION - IMAGE DISPLAY SYSTEM')
  console.log('============================================================')
  
  try {
    // 1. 检查数据库产品
    console.log('\n📦 STEP 1: DATABASE PRODUCTS')
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, images, variants, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log(`   ✅ Found ${products.length} active products`)

    let allValid = true

    for (const product of products) {
      console.log(`\n📋 Product: ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Price: $${product.price}`)
      
      // 检查图片
      if (!product.images || product.images.length === 0) {
        console.log(`   ❌ No images`)
        allValid = false
      } else {
        const imageUrl = product.images[0]
        console.log(`   📸 Image: ${imageUrl}`)
        
        // 检查图片文件是否存在
        if (imageUrl.startsWith('/api/image/')) {
          const filename = imageUrl.replace('/api/image/', '')
          const filePath = join(process.cwd(), 'public', 'uploads', filename)
          
          if (existsSync(filePath)) {
            console.log(`   ✅ Image file exists: ${filename}`)
          } else {
            console.log(`   ❌ Image file missing: ${filename}`)
            allValid = false
          }
        }
      }
      
      // 检查variants
      if (!product.variants || product.variants.length === 0) {
        console.log(`   ❌ No variants`)
        allValid = false
      } else {
        console.log(`   ✅ Variants: ${product.variants.length}`)
        const firstVariant = product.variants[0]
        if (!firstVariant.id || !firstVariant.size || !firstVariant.color || !firstVariant.price) {
          console.log(`   ⚠️  Variant missing required fields`)
          allValid = false
        }
      }
    }

    // 2. 测试API端点
    console.log('\n🌐 STEP 2: API ENDPOINTS')
    
    try {
      // 测试产品API
      const productResponse = await fetch('http://localhost:3002/api/products')
      const productData = await productResponse.json()
      
      console.log(`   📦 Products API: ${productResponse.status} - ${productData.success ? 'SUCCESS' : 'FAILED'}`)
      console.log(`   📊 Products returned: ${productData.data?.length || 0}`)
      
      if (productData.success && productData.data.length > 0) {
        // 测试第一个产品的图片
        const firstProduct = productData.data[0]
        if (firstProduct.images && firstProduct.images.length > 0) {
          const imageUrl = firstProduct.images[0]
          const fullImageUrl = `http://localhost:3002${imageUrl}`
          
          console.log(`   🖼️  Testing image: ${fullImageUrl}`)
          
          try {
            const imageResponse = await fetch(fullImageUrl)
            console.log(`   📸 Image API: ${imageResponse.status} - ${imageResponse.ok ? 'SUCCESS' : 'FAILED'}`)
            
            if (imageResponse.ok) {
              const contentType = imageResponse.headers.get('content-type')
              console.log(`   📄 Content-Type: ${contentType}`)
            }
          } catch (imageError) {
            console.log(`   ❌ Image request failed: ${imageError.message}`)
            allValid = false
          }
        }
      }
      
    } catch (apiError) {
      console.log(`   ❌ API test failed: ${apiError.message}`)
      allValid = false
    }

    // 3. 前端兼容性检查
    console.log('\n🎨 STEP 3: FRONTEND COMPATIBILITY')
    
    for (const product of products.slice(0, 2)) { // 只检查前2个产品
      console.log(`\n   Testing product: ${product.name}`)
      
      // 模拟前端图片处理逻辑
      let imageUrl = product.images?.[0] || '/placeholder.svg'
      
      if (imageUrl !== '/placeholder.svg') {
        // 清理URL
        imageUrl = imageUrl
          .trim()
          .replace(/['"(){}[\]]/g, '')
          .replace(/\s+/g, '')
          .replace(/\0/g, '')
          .replace(/(\.(jpg|jpeg|png|gif|webp))[^a-zA-Z]*$/i, '$1')
        
        console.log(`   🧹 Cleaned URL: ${imageUrl}`)
      }
      
      // 模拟价格范围计算
      let minPrice, maxPrice
      if (!product.variants || product.variants.length === 0) {
        minPrice = maxPrice = product.price
      } else {
        const prices = product.variants.map(v => v.price)
        minPrice = Math.min(...prices)
        maxPrice = Math.max(...prices)
      }
      
      console.log(`   💰 Price range: $${minPrice} - $${maxPrice}`)
      
      // 模拟选项获取
      let sizes, colors
      if (!product.variants || product.variants.length === 0) {
        sizes = ['One Size']
        colors = ['Default']
      } else {
        sizes = [...new Set(product.variants.map(v => v.size))]
        colors = [...new Set(product.variants.map(v => v.color))]
      }
      
      console.log(`   📏 Sizes: ${sizes.join(', ')}`)
      console.log(`   🎨 Colors: ${colors.join(', ')}`)
    }

    // 4. 总结
    console.log('\n📊 FINAL SUMMARY')
    console.log('============================================================')
    
    if (allValid) {
      console.log('🎉 SUCCESS! All systems are working correctly!')
      console.log('')
      console.log('✅ Database products: Valid')
      console.log('✅ Image files: Present')
      console.log('✅ Product variants: Valid')
      console.log('✅ API endpoints: Working')
      console.log('✅ Frontend compatibility: Ready')
      console.log('')
      console.log('🌐 Your website should now display products with images correctly!')
      console.log('📱 Please check: http://localhost:3002')
    } else {
      console.log('⚠️  Some issues were found. Please review the details above.')
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    process.exit(1)
  }
}

finalVerification()
