#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixProductVariants() {
  console.log('🔧 FIXING PRODUCT VARIANTS')
  console.log('============================================================')
  
  try {
    // 获取所有产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, price, variants')

    if (error) throw error

    console.log(`📦 Found ${products.length} products`)

    let fixedCount = 0

    for (const product of products) {
      console.log(`\n🔍 Checking product: ${product.name}`)
      console.log(`   Price: $${product.price}`)
      console.log(`   Variants: ${JSON.stringify(product.variants)}`)

      let needsUpdate = false
      let variants = product.variants

      // 如果没有variants或variants为空，创建默认variant
      if (!variants || variants.length === 0) {
        console.log('   ❌ No variants found, creating default variant')
        variants = [
          {
            id: `${product.id}-default`,
            size: 'One Size',
            color: 'Default',
            price: product.price,
            stock: 10
          }
        ]
        needsUpdate = true
      } else {
        // 检查variants是否有必要的字段
        let validVariants = []
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i]
          let fixedVariant = { ...variant }

          // 确保有必要的字段
          if (!fixedVariant.id) {
            fixedVariant.id = `${product.id}-${i}`
            needsUpdate = true
          }
          if (!fixedVariant.size) {
            fixedVariant.size = 'One Size'
            needsUpdate = true
          }
          if (!fixedVariant.color) {
            fixedVariant.color = 'Default'
            needsUpdate = true
          }
          if (!fixedVariant.price) {
            fixedVariant.price = product.price
            needsUpdate = true
          }
          if (!fixedVariant.stock) {
            fixedVariant.stock = 10
            needsUpdate = true
          }

          validVariants.push(fixedVariant)
        }
        variants = validVariants
      }

      // 更新产品如果需要
      if (needsUpdate) {
        console.log('   🔧 Updating variants...')
        const { error: updateError } = await supabase
          .from('products')
          .update({ variants: variants })
          .eq('id', product.id)

        if (updateError) {
          console.log(`   ❌ Failed to update ${product.name}:`, updateError.message)
        } else {
          console.log(`   ✅ Updated ${product.name} variants`)
          console.log(`   📊 New variants: ${JSON.stringify(variants, null, 2)}`)
          fixedCount++
        }
      } else {
        console.log('   ✅ Variants are valid')
      }
    }

    console.log('\n📊 SUMMARY:')
    console.log(`   📦 Total products: ${products.length}`)
    console.log(`   🔧 Products fixed: ${fixedCount}`)

    if (fixedCount > 0) {
      console.log('\n🎉 SUCCESS! Product variants have been fixed.')
      console.log('   Please refresh your browser and check the homepage.')
    } else {
      console.log('\n✅ All product variants were already valid.')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

fixProductVariants()
