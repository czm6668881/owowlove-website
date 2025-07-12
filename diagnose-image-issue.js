#!/usr/bin/env node

// Load environment variables
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

async function diagnoseImageIssue() {
  console.log('🔍 DIAGNOSING IMAGE DISPLAY ISSUE')
  console.log('=' * 60)
  
  try {
    // 1. 检查文件系统中的图片
    console.log('\n📁 STEP 1: CHECKING FILE SYSTEM')
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (existsSync(uploadsDir)) {
      const files = readdirSync(uploadsDir).filter(f => f.startsWith('product-'))
      console.log(`   ✅ Found ${files.length} product images in uploads directory:`)
      files.slice(0, 5).forEach(file => {
        console.log(`   📸 ${file}`)
      })
      if (files.length > 5) {
        console.log(`   ... and ${files.length - 5} more files`)
      }
    } else {
      console.log('   ❌ Uploads directory not found')
    }

    // 2. 获取数据库中的产品
    console.log('\n📦 STEP 2: CHECKING DATABASE PRODUCTS')
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    console.log(`   ✅ Found ${products.length} active products in database`)

    let hasValidImages = false
    for (const product of products) {
      console.log(`\n📋 Product: ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Images type: ${typeof product.images}`)
      console.log(`   Images array: ${Array.isArray(product.images)}`)
      console.log(`   Images length: ${product.images?.length || 0}`)
      
      if (product.images && product.images.length > 0) {
        hasValidImages = true
        product.images.forEach((img, index) => {
          console.log(`   Image ${index + 1}: ${typeof img} - ${img}`)
          
          // 检查文件是否存在
          if (typeof img === 'string') {
            let filename = ''
            
            // 提取文件名
            if (img.startsWith('/api/image/')) {
              filename = img.replace('/api/image/', '')
            } else if (img.startsWith('/uploads/')) {
              filename = img.replace('/uploads/', '')
            } else if (img.includes('/')) {
              filename = img.split('/').pop()
            } else {
              filename = img
            }
            
            if (filename) {
              const filePath = join(process.cwd(), 'public', 'uploads', filename)
              
              if (existsSync(filePath)) {
                console.log(`     ✅ File exists: ${filename}`)
              } else {
                console.log(`     ❌ File missing: ${filename}`)
                
                // 检查是否有类似的文件名
                const uploadsDir = join(process.cwd(), 'public', 'uploads')
                if (existsSync(uploadsDir)) {
                  const files = readdirSync(uploadsDir)
                  const similar = files.filter(f => f.includes(filename.split('.')[0]))
                  if (similar.length > 0) {
                    console.log(`     🔍 Similar files found: ${similar.join(', ')}`)
                  }
                }
              }
            }
          } else {
            console.log(`     ⚠️  Non-string image data: ${typeof img}`)
          }
        })
      } else {
        console.log(`   ❌ No images`)
      }
    }

    // 3. 检查主页产品获取API
    console.log('\n🌐 STEP 3: TESTING FRONTEND API')
    try {
      const response = await fetch('http://localhost:3000/api/products')
      const apiProducts = await response.json()
      console.log(`   API Response Status: ${response.status}`)
      console.log(`   API Products Count: ${apiProducts.length}`)
      
      if (apiProducts.length > 0) {
        const firstProduct = apiProducts[0]
        console.log(`   First Product: ${firstProduct.name}`)
        console.log(`   First Product Images: ${JSON.stringify(firstProduct.images)}`)
      }
    } catch (error) {
      console.log(`   ❌ API Test Failed: ${error.message}`)
    }

    // 4. 总结问题
    console.log('\n📊 STEP 4: DIAGNOSIS SUMMARY')
    if (!hasValidImages) {
      console.log('   ❌ ISSUE: No products have valid images in database')
      console.log('   💡 SOLUTION: Need to update product image URLs in database')
    } else {
      console.log('   ✅ Products have images in database')
      console.log('   🔍 Issue might be in frontend image processing or display logic')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

diagnoseImageIssue()
