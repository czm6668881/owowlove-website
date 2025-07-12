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

async function verifyAllImages() {
  console.log('🔍 Final image verification...')
  
  try {
    // 获取所有产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images, is_active')

    if (error) throw error

    console.log(`📦 Found ${products.length} products`)

    let totalImages = 0
    let validImages = 0
    let invalidImages = 0
    const issues = []

    for (const product of products) {
      console.log(`\n🔍 Product: ${product.name} (${product.is_active ? 'Active' : 'Inactive'})`)
      
      if (!product.images || product.images.length === 0) {
        console.log('   ⚠️  No images')
        issues.push({
          product: product.name,
          issue: 'No images',
          severity: 'warning'
        })
        continue
      }

      for (let i = 0; i < product.images.length; i++) {
        const imageUrl = product.images[i]
        totalImages++
        
        console.log(`   📸 Image ${i + 1}: ${imageUrl}`)

        // 验证URL格式
        if (typeof imageUrl !== 'string') {
          console.log('   ❌ Invalid format (not string)')
          invalidImages++
          issues.push({
            product: product.name,
            issue: `Image ${i + 1} is not a string: ${typeof imageUrl}`,
            severity: 'error'
          })
          continue
        }

        // 检查是否包含损坏的JSON数据
        if (imageUrl.includes('"url":') || imageUrl.includes('{"id":')) {
          console.log('   ❌ Contains corrupted JSON data')
          invalidImages++
          issues.push({
            product: product.name,
            issue: `Image ${i + 1} contains corrupted JSON data`,
            severity: 'error'
          })
          continue
        }

        // 验证URL格式
        if (!imageUrl.startsWith('/api/image/') && !imageUrl.startsWith('http')) {
          console.log('   ⚠️  Non-standard URL format')
          issues.push({
            product: product.name,
            issue: `Image ${i + 1} has non-standard URL format: ${imageUrl}`,
            severity: 'warning'
          })
        }

        // 检查文件是否存在
        let filename = ''
        if (imageUrl.startsWith('/api/image/')) {
          filename = imageUrl.replace('/api/image/', '')
        } else if (imageUrl.includes('/')) {
          filename = imageUrl.split('/').pop()
        } else {
          filename = imageUrl
        }

        const filePath = join(process.cwd(), 'public', 'uploads', filename)
        
        if (existsSync(filePath)) {
          console.log('   ✅ File exists and accessible')
          validImages++
        } else {
          console.log('   ❌ File not found')
          invalidImages++
          issues.push({
            product: product.name,
            issue: `Image ${i + 1} file not found: ${filename}`,
            severity: 'error'
          })
        }
      }
    }

    // 生成报告
    console.log('\n' + '='.repeat(50))
    console.log('📊 FINAL VERIFICATION REPORT')
    console.log('='.repeat(50))
    
    console.log(`\n📈 Statistics:`)
    console.log(`   Total products: ${products.length}`)
    console.log(`   Total images: ${totalImages}`)
    console.log(`   Valid images: ${validImages}`)
    console.log(`   Invalid images: ${invalidImages}`)
    console.log(`   Success rate: ${totalImages > 0 ? ((validImages / totalImages) * 100).toFixed(1) : 0}%`)

    if (issues.length > 0) {
      console.log(`\n⚠️  Issues found (${issues.length}):`)
      
      const errors = issues.filter(i => i.severity === 'error')
      const warnings = issues.filter(i => i.severity === 'warning')
      
      if (errors.length > 0) {
        console.log(`\n❌ Errors (${errors.length}):`)
        errors.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue.product}: ${issue.issue}`)
        })
      }
      
      if (warnings.length > 0) {
        console.log(`\n⚠️  Warnings (${warnings.length}):`)
        warnings.forEach((issue, index) => {
          console.log(`   ${index + 1}. ${issue.product}: ${issue.issue}`)
        })
      }
    } else {
      console.log('\n🎉 No issues found! All images are properly configured.')
    }

    // 建议
    console.log('\n💡 Recommendations:')
    if (invalidImages > 0) {
      console.log('   - Fix corrupted image data using the fix scripts')
      console.log('   - Ensure all image files exist in public/uploads/')
      console.log('   - Use /api/image/ format for all image URLs')
    } else {
      console.log('   - All images are properly configured!')
      console.log('   - New products should follow the same pattern')
      console.log('   - Regular verification recommended')
    }

    return {
      totalImages,
      validImages,
      invalidImages,
      issues,
      success: invalidImages === 0
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message)
    return null
  }
}

async function main() {
  console.log('🎯 OWOWLOVE Final Image Verification')
  console.log('=' * 40)
  
  const result = await verifyAllImages()
  
  if (result) {
    if (result.success) {
      console.log('\n✅ All images are working correctly!')
      console.log('🚀 Your website should now display all product images properly.')
    } else {
      console.log('\n⚠️  Some issues need to be resolved.')
      console.log('🔧 Please run the appropriate fix scripts.')
    }
  }
  
  console.log('\n✨ Verification completed!')
}

main().catch(console.error)
