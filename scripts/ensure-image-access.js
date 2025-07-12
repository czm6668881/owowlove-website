#!/usr/bin/env node

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')
const { copyFile, readdir } = require('fs/promises')
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

async function ensureImageAccess() {
  console.log('🔄 Ensuring all images are accessible...')
  
  try {
    // 1. 获取所有产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, images')

    if (error) throw error

    console.log(`📦 Found ${products.length} products`)

    // 2. 检查每个产品的图片
    let totalImages = 0
    let accessibleImages = 0
    let fixedImages = 0

    for (const product of products) {
      if (!product.images || product.images.length === 0) {
        continue
      }

      console.log(`\n🔍 Checking product: ${product.name}`)
      
      for (const imageUrl of product.images) {
        totalImages++
        console.log(`   📸 Image: ${imageUrl}`)

        // 提取文件名
        let filename = ''
        if (imageUrl.startsWith('/api/image/')) {
          filename = imageUrl.replace('/api/image/', '')
        } else if (imageUrl.includes('/')) {
          filename = imageUrl.split('/').pop()
        } else {
          filename = imageUrl
        }

        // 检查文件是否存在于 uploads 目录
        const uploadsPath = join(process.cwd(), 'public', 'uploads', filename)
        const productImagesPath = join(process.cwd(), 'public', 'product-images', filename)
        const publicPath = join(process.cwd(), 'public', filename)

        let fileExists = false
        let sourcePath = ''

        // 检查各个可能的位置
        if (existsSync(uploadsPath)) {
          fileExists = true
          console.log(`   ✅ Found in uploads: ${filename}`)
          accessibleImages++
        } else if (existsSync(productImagesPath)) {
          fileExists = true
          sourcePath = productImagesPath
          console.log(`   📁 Found in product-images, copying to uploads...`)
          
          try {
            await copyFile(productImagesPath, uploadsPath)
            console.log(`   ✅ Copied to uploads: ${filename}`)
            fixedImages++
            accessibleImages++
          } catch (copyError) {
            console.log(`   ❌ Failed to copy: ${copyError.message}`)
          }
        } else if (existsSync(publicPath)) {
          fileExists = true
          sourcePath = publicPath
          console.log(`   📁 Found in public root, copying to uploads...`)
          
          try {
            await copyFile(publicPath, uploadsPath)
            console.log(`   ✅ Copied to uploads: ${filename}`)
            fixedImages++
            accessibleImages++
          } catch (copyError) {
            console.log(`   ❌ Failed to copy: ${copyError.message}`)
          }
        } else {
          console.log(`   ❌ File not found: ${filename}`)
        }
      }
    }

    // 3. 报告结果
    console.log('\n📊 Summary:')
    console.log(`   Total images: ${totalImages}`)
    console.log(`   Accessible images: ${accessibleImages}`)
    console.log(`   Fixed images: ${fixedImages}`)
    console.log(`   Missing images: ${totalImages - accessibleImages}`)

    if (totalImages === accessibleImages) {
      console.log('\n🎉 All images are accessible!')
    } else {
      console.log('\n⚠️  Some images are still missing')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

async function listAvailableImages() {
  console.log('\n📁 Available image files:')
  
  const directories = [
    { name: 'uploads', path: join(process.cwd(), 'public', 'uploads') },
    { name: 'product-images', path: join(process.cwd(), 'public', 'product-images') },
    { name: 'public root', path: join(process.cwd(), 'public') }
  ]

  for (const dir of directories) {
    try {
      if (existsSync(dir.path)) {
        const files = await readdir(dir.path)
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        )
        
        console.log(`\n   ${dir.name}: ${imageFiles.length} images`)
        imageFiles.forEach(file => {
          console.log(`     - ${file}`)
        })
      } else {
        console.log(`\n   ${dir.name}: Directory not found`)
      }
    } catch (error) {
      console.log(`\n   ${dir.name}: Error reading directory - ${error.message}`)
    }
  }
}

async function main() {
  console.log('🎯 OWOWLOVE Image Access Checker')
  console.log('=' * 40)
  
  await listAvailableImages()
  await ensureImageAccess()
  
  console.log('\n✨ Image access check completed!')
}

main().catch(console.error)
