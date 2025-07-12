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

async function checkDatabaseData() {
  console.log('🔍 Checking database data...')
  
  try {
    // 获取所有产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, is_active, variants')

    if (error) throw error

    console.log(`📦 Found ${products.length} products`)

    for (const product of products) {
      console.log(`\n📋 Product: ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Active: ${product.is_active}`)
      console.log(`   Images type: ${typeof product.images}`)
      console.log(`   Images array: ${Array.isArray(product.images)}`)
      console.log(`   Images length: ${product.images?.length || 0}`)
      console.log(`   Images data:`, product.images)
      console.log(`   Variants type: ${typeof product.variants}`)
      console.log(`   Variants array: ${Array.isArray(product.variants)}`)
      console.log(`   Variants length: ${product.variants?.length || 0}`)
      console.log(`   Variants data:`, product.variants)

      if (product.images && product.images.length > 0) {
        product.images.forEach((img, index) => {
          console.log(`   Image ${index + 1}: ${typeof img} - ${img}`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

checkDatabaseData()
