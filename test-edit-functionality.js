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

async function testEditFunctionality() {
  console.log('🧪 Testing edit functionality...')
  
  try {
    // 1. 获取第一个产品
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (error) throw error

    if (products.length === 0) {
      console.log('❌ No products found to test')
      return
    }

    const product = products[0]
    console.log(`\n📦 Testing with product: ${product.name}`)
    console.log(`   ID: ${product.id}`)
    console.log(`   Description: ${product.description}`)
    console.log(`   Active: ${product.is_active}`)
    console.log(`   Category ID: ${product.category_id}`)
    console.log(`   Images: ${product.images?.length || 0}`)
    console.log(`   Variants: ${product.variants?.length || 0}`)

    // 2. 测试编辑页面应该接收的数据格式
    console.log('\n🔍 Data format for edit form:')
    console.log('✅ product.name:', product.name)
    console.log('✅ product.description:', product.description)
    console.log('✅ product.is_active:', product.is_active)
    console.log('✅ product.category_id:', product.category_id)
    console.log('✅ product.images:', product.images)
    console.log('✅ product.variants:', product.variants)

    // 3. 获取分类信息
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')

    if (catError) throw catError

    console.log(`\n📂 Available categories: ${categories.length}`)
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (ID: ${cat.id})`)
    })

    // 4. 找到产品对应的分类
    if (product.category_id) {
      const productCategory = categories.find(cat => cat.id === product.category_id)
      if (productCategory) {
        console.log(`\n✅ Product category: ${productCategory.name}`)
      } else {
        console.log(`\n⚠️  Product category not found for ID: ${product.category_id}`)
      }
    } else {
      console.log(`\n⚠️  Product has no category assigned`)
    }

    console.log('\n🎉 Edit functionality test completed!')
    console.log('\n📝 Expected behavior:')
    console.log('1. Edit form should load with product name:', product.name)
    console.log('2. Edit form should load with description:', product.description)
    console.log('3. Edit form should show active status:', product.is_active)
    console.log('4. Edit form should show images:', product.images?.length || 0)
    console.log('5. Edit form should show variants:', product.variants?.length || 0)

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

testEditFunctionality()
