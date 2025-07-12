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

async function fixSpecificProduct() {
  console.log('🔧 Fixing specific product with corrupted image data...')
  
  try {
    // 获取 "Sexy knight uniform" 产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images')
      .eq('name', 'Sexy knight uniform')

    if (error) throw error

    if (products.length === 0) {
      console.log('❌ Product "Sexy knight uniform" not found')
      return
    }

    const product = products[0]
    console.log(`📦 Found product: ${product.name}`)
    console.log(`📸 Current images: ${JSON.stringify(product.images)}`)

    // 修复图片数据
    const fixedImages = ['/api/image/product-1752080189101.jpeg']
    
    console.log(`🔧 Fixing to: ${JSON.stringify(fixedImages)}`)

    const { error: updateError } = await supabase
      .from('products')
      .update({ images: fixedImages })
      .eq('id', product.id)

    if (updateError) {
      console.log(`❌ Failed to update: ${updateError.message}`)
    } else {
      console.log(`✅ Successfully updated product`)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

async function main() {
  console.log('🎯 OWOWLOVE Specific Product Fixer')
  console.log('=' * 40)
  
  await fixSpecificProduct()
  
  console.log('\n✨ Fix completed!')
}

main().catch(console.error)
