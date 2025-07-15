#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const { readFileSync, existsSync } = require('fs')
const { join } = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function finalStatusCheck() {
  console.log('🔍 FINAL STATUS CHECK - 图片同步修复')
  console.log('============================================================')
  console.log(`📅 检查时间: ${new Date().toLocaleString('zh-CN')}`)
  console.log('')

  let overallScore = 0
  const maxScore = 100

  try {
    // 1. 检查数据库连接 (10分)
    console.log('🔌 1. 数据库连接检查')
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1)
      if (error) throw error
      console.log('   ✅ 数据库连接正常')
      overallScore += 10
    } catch (error) {
      console.log('   ❌ 数据库连接失败:', error.message)
    }

    // 2. 检查产品数据 (15分)
    console.log('\n📦 2. 产品数据检查')
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name, images, is_active')
        .eq('is_active', true)

      if (error) throw error
      console.log(`   ✅ 找到 ${products.length} 个激活产品`)
      
      let totalImages = 0
      products.forEach(product => {
        if (product.images && Array.isArray(product.images)) {
          totalImages += product.images.length
        }
      })
      console.log(`   📊 总图片数量: ${totalImages}`)
      overallScore += 15
    } catch (error) {
      console.log('   ❌ 产品数据获取失败:', error.message)
    }

    // 3. 检查本地图片文件 (20分)
    console.log('\n📁 3. 本地图片文件检查')
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const testImages = [
      'product-1752068376427.jpg',
      'product-1752080189101.jpeg',
      'product-1752312776393.jpeg',
      'product-1752401587935.jpeg',
      'product-1752401589832.jpeg',
      'product-1752401591471.jpeg'
    ]

    let localFilesFound = 0
    testImages.forEach(filename => {
      const filePath = join(uploadsDir, filename)
      if (existsSync(filePath)) {
        localFilesFound++
        console.log(`   ✅ ${filename}`)
      } else {
        console.log(`   ❌ ${filename} - 文件不存在`)
      }
    })

    const localScore = Math.round((localFilesFound / testImages.length) * 20)
    console.log(`   📊 本地文件: ${localFilesFound}/${testImages.length} (${localScore}/20分)`)
    overallScore += localScore

    // 4. 检查映射文件 (25分)
    console.log('\n📄 4. 图片映射文件检查')
    const mappingPath = join(process.cwd(), 'public', 'image-mapping.json')
    
    if (!existsSync(mappingPath)) {
      console.log('   ❌ 映射文件不存在')
    } else {
      try {
        const mappingData = JSON.parse(readFileSync(mappingPath, 'utf-8'))
        const images = mappingData.images || mappingData
        const mappedCount = Object.keys(images).length
        
        console.log(`   ✅ 映射文件存在`)
        console.log(`   📊 映射图片数量: ${mappedCount}`)
        console.log(`   📅 最后更新: ${mappingData.lastUpdated || '未知'}`)
        
        // 验证映射数据完整性
        let validMappings = 0
        Object.keys(images).forEach(filename => {
          const imageData = images[filename]
          if (imageData.data && imageData.data.startsWith('data:')) {
            validMappings++
          }
        })
        
        const mappingScore = Math.round((validMappings / Math.max(mappedCount, 1)) * 25)
        console.log(`   📊 有效映射: ${validMappings}/${mappedCount} (${mappingScore}/25分)`)
        overallScore += mappingScore
      } catch (error) {
        console.log('   ❌ 映射文件解析失败:', error.message)
      }
    }

    // 5. 检查图片API路由 (15分)
    console.log('\n🌐 5. 图片API路由检查')
    const apiRoutePath = join(process.cwd(), 'app', 'api', 'image', '[filename]', 'route.ts')
    
    if (!existsSync(apiRoutePath)) {
      console.log('   ❌ API路由文件不存在')
    } else {
      try {
        const apiContent = readFileSync(apiRoutePath, 'utf-8')
        const features = {
          '映射文件备用': apiContent.includes('loadImageFromMapping'),
          '数据库备用': apiContent.includes('loadImageFromDatabase'),
          '占位符备用': apiContent.includes('generatePlaceholderImage'),
          '环境检测': apiContent.includes('isProduction')
        }
        
        let featureCount = 0
        Object.keys(features).forEach(feature => {
          if (features[feature]) {
            console.log(`   ✅ ${feature}`)
            featureCount++
          } else {
            console.log(`   ❌ ${feature}`)
          }
        })
        
        const apiScore = Math.round((featureCount / 4) * 15)
        console.log(`   📊 API功能: ${featureCount}/4 (${apiScore}/15分)`)
        overallScore += apiScore
      } catch (error) {
        console.log('   ❌ API文件读取失败:', error.message)
      }
    }

    // 6. 检查image_storage表 (15分)
    console.log('\n🗄️  6. 数据库表检查')
    try {
      const { data, error } = await supabase.from('image_storage').select('id').limit(1)
      if (error) {
        console.log('   ⚠️  image_storage表不存在或无法访问')
        console.log('   💡 请参考 MANUAL_DATABASE_SETUP.md 手动创建')
      } else {
        console.log('   ✅ image_storage表存在')
        
        const { count } = await supabase
          .from('image_storage')
          .select('*', { count: 'exact', head: true })
        
        console.log(`   📊 存储的图片数量: ${count || 0}`)
        overallScore += 15
      }
    } catch (error) {
      console.log('   ❌ 数据库表检查失败:', error.message)
    }

    // 7. 生成最终报告
    console.log('\n📊 最终状态报告')
    console.log('============================================================')
    console.log(`🎯 总分: ${overallScore}/${maxScore} (${Math.round(overallScore/maxScore*100)}%)`)
    console.log('')

    if (overallScore >= 80) {
      console.log('🎉 状态: 优秀 - 图片同步修复完成!')
      console.log('✅ 您的网站图片应该能正常显示')
    } else if (overallScore >= 60) {
      console.log('⚠️  状态: 良好 - 基本修复完成，建议完善数据库备用方案')
      console.log('💡 大部分图片应该能正常显示')
    } else if (overallScore >= 40) {
      console.log('🔧 状态: 需要改进 - 部分功能正常，需要进一步修复')
      console.log('⚠️  部分图片可能无法显示')
    } else {
      console.log('❌ 状态: 需要重新修复 - 多个关键组件有问题')
      console.log('🆘 建议重新运行修复脚本')
    }

    console.log('')
    console.log('🔗 测试链接:')
    console.log('   生产网站: https://owowlove.com')
    console.log('   图片API: https://owowlove.com/api/image/product-1752068376427.jpg')
    console.log('')
    console.log('📝 下一步建议:')
    
    if (overallScore < 100) {
      console.log('   1. 创建 image_storage 数据库表 (参考 MANUAL_DATABASE_SETUP.md)')
      console.log('   2. 运行: node production-image-sync.js')
      console.log('   3. 验证: node verify-production-images.js')
    } else {
      console.log('   1. 定期运行此检查脚本监控状态')
      console.log('   2. 测试新产品图片上传功能')
      console.log('   3. 监控网站图片加载性能')
    }

    return overallScore >= 60

  } catch (error) {
    console.error('❌ 状态检查失败:', error.message)
    return false
  }
}

async function main() {
  const success = await finalStatusCheck()
  process.exit(success ? 0 : 1)
}

main()
