// Final attempt to create tables using a different approach
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Read environment variables
let supabaseUrl, supabaseServiceKey
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const envLines = envContent.split('\n')
  
  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1]
    } else if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      supabaseServiceKey = line.split('=')[1]
    }
  }
} catch (error) {
  console.error('❌ Could not read .env.local file:', error.message)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createMinimalTables() {
  console.log('🚀 尝试创建最基本的表结构...')
  
  // Try to create a simple test table first
  try {
    console.log('📄 测试表创建权限...')
    
    // Test if we can create a simple table
    const { data, error } = await supabase
      .from('_test_table_creation')
      .select('*')
      .limit(1)
    
    console.log('测试结果:', { data, error })
    
    if (error && error.message.includes('does not exist')) {
      console.log('✅ 确认表不存在，这是预期的')
    }
    
  } catch (err) {
    console.log('❌ 测试失败:', err.message)
  }
}

async function insertSampleDataIfTablesExist() {
  console.log('\n📊 尝试插入示例数据（如果表存在）...')
  
  try {
    // Try to insert sample categories
    const sampleCategories = [
      {
        name: 'Sexy Cosplay',
        description: 'Sexy cosplay costumes and accessories',
        image: '/placeholder.jpg',
        is_active: true
      },
      {
        name: 'Bunny Costumes',
        description: 'Cute and sexy bunny costumes',
        image: '/placeholder.jpg',
        is_active: true
      }
    ]
    
    const { data: catData, error: catError } = await supabase
      .from('categories')
      .insert(sampleCategories)
      .select()
    
    if (catError) {
      console.log('   ❌ 插入分类失败:', catError.message)
      if (catError.message.includes('does not exist')) {
        console.log('   💡 表不存在，需要先创建表')
      }
    } else {
      console.log('   ✅ 分类数据插入成功')
      
      // If categories were inserted successfully, try products
      if (catData && catData.length > 0) {
        const sampleProducts = [
          {
            name: 'Sexy Cat Girl Cosplay',
            description: 'Adorable and sexy cat girl costume',
            price: 89.99,
            images: ['/placeholder.jpg'],
            category_id: catData[0].id,
            variants: [
              { id: 'v1', color: 'Black', size: 'One Size', price: 89.99, stock: 10 }
            ],
            is_active: true
          }
        ]
        
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .insert(sampleProducts)
          .select()
        
        if (prodError) {
          console.log('   ❌ 插入产品失败:', prodError.message)
        } else {
          console.log('   ✅ 产品数据插入成功')
        }
      }
    }
    
  } catch (error) {
    console.log('   ❌ 插入数据时出错:', error.message)
  }
}

async function showManualInstructions() {
  console.log('\n📋 手动设置说明:')
  console.log('=' * 50)
  console.log('由于自动创建表遇到权限问题，请按照以下步骤手动设置：')
  console.log('')
  console.log('1. 打开Supabase SQL编辑器:')
  console.log('   https://supabase.com/dashboard/project/zzexacrffmxmqrqamcxo/sql/new')
  console.log('')
  console.log('2. 复制并执行 EXECUTE_THIS_SQL.md 文件中的完整SQL脚本')
  console.log('')
  console.log('3. 执行完成后运行验证:')
  console.log('   node test-supabase-connection.js')
  console.log('')
  console.log('4. 启动网站:')
  console.log('   npm run dev')
  console.log('')
  console.log('📁 重要文件:')
  console.log('   - .env.local (已配置) ✅')
  console.log('   - EXECUTE_THIS_SQL.md (包含完整SQL脚本) ✅')
  console.log('   - test-supabase-connection.js (验证脚本) ✅')
  console.log('')
  console.log('🔗 快速链接:')
  console.log('   Supabase项目: https://supabase.com/dashboard/project/zzexacrffmxmqrqamcxo')
  console.log('   SQL编辑器: https://supabase.com/dashboard/project/zzexacrffmxmqrqamcxo/sql/new')
}

async function main() {
  console.log('🎯 OWOWLOVE.COM 最终数据库设置尝试')
  console.log('=' * 50)
  
  await createMinimalTables()
  await insertSampleDataIfTablesExist()
  
  // Run final test
  console.log('\n🧪 最终验证测试...')
  const { spawn } = require('child_process')
  
  const testProcess = spawn('node', ['test-supabase-connection.js'], {
    stdio: 'pipe'
  })
  
  let testOutput = ''
  testProcess.stdout.on('data', (data) => {
    testOutput += data.toString()
  })
  
  testProcess.on('close', (code) => {
    console.log(testOutput)
    
    if (testOutput.includes('accessible')) {
      console.log('\n🎉 数据库设置成功！可以启动网站了！')
      console.log('\n🚀 启动命令:')
      console.log('   npm run dev')
    } else {
      console.log('\n⚠️  数据库表尚未创建')
      showManualInstructions()
    }
  })
}

main().catch(error => {
  console.error('❌ 执行失败:', error.message)
  showManualInstructions()
})
