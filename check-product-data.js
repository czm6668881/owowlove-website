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

async function checkProductData() {
  console.log('🔍 Checking product data in database...')
  
  try {
    // 获取所有产品的详细信息
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log(`📦 Found ${products.length} products in database`)

    products.forEach((product, index) => {
      console.log(`\n${index + 1}. Product: ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Active: ${product.is_active}`)
      console.log(`   Created: ${product.created_at}`)
      console.log(`   Images type: ${typeof product.images}`)
      console.log(`   Images value: ${JSON.stringify(product.images)}`)
      console.log(`   Images length: ${product.images?.length || 0}`)
      
      if (product.images) {
        if (Array.isArray(product.images)) {
          product.images.forEach((img, imgIndex) => {
            console.log(`     Image ${imgIndex + 1}: ${typeof img} - ${img}`)
          })
        } else {
          console.log(`     ⚠️  Images is not an array: ${typeof product.images}`)
        }
      } else {
        console.log(`     ❌ No images field`)
      }
      
      // 检查变体
      console.log(`   Variants: ${product.variants?.length || 0}`)
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant, vIndex) => {
          console.log(`     Variant ${vIndex + 1}: ${variant.size} ${variant.color} - $${variant.price}`)
        })
      }
    })

    // 测试前端API
    console.log('\n🌐 Testing frontend API...')
    const response = await fetch('http://localhost:3000/api/products')
    const apiData = await response.json()
    
    if (apiData.success) {
      console.log(`✅ Frontend API returned ${apiData.data.length} products`)
      
      apiData.data.forEach((product, index) => {
        console.log(`\nFrontend Product ${index + 1}: ${product.name}`)
        console.log(`   Active: ${product.is_active}`)
        console.log(`   Images: ${JSON.stringify(product.images)}`)
      })
    } else {
      console.log('❌ Frontend API failed:', apiData.error)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkProductData()
