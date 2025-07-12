#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const { existsSync } = require('fs')
const { join } = require('path')

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkProductImages() {
  console.log('🔍 Checking product images...')
  
  try {
    // 获取所有产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, is_active')

    if (error) throw error

    console.log(`📦 Found ${products.length} products`)

    for (const product of products) {
      console.log(`\n📋 Product: ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Active: ${product.is_active}`)
      console.log(`   Images type: ${typeof product.images}`)
      console.log(`   Images array: ${Array.isArray(product.images)}`)
      console.log(`   Images length: ${product.images?.length || 0}`)
      
      if (product.images && product.images.length > 0) {
        product.images.forEach((img, index) => {
          console.log(`   Image ${index + 1}: ${typeof img} - ${img}`)
          
          // 检查文件是否存在
          if (typeof img === 'string' && img.startsWith('/api/image/')) {
            const filename = img.replace('/api/image/', '')
            const filePath = join(process.cwd(), 'public', 'uploads', filename)
            
            if (existsSync(filePath)) {
              console.log(`     ✅ File exists: ${filename}`)
            } else {
              console.log(`     ❌ File missing: ${filename}`)
            }
          } else {
            console.log(`     ⚠️  Non-standard URL format`)
          }
        })
      } else {
        console.log(`   ❌ No images`)
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkProductImages()
