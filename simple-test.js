// Simple test to check if tables exist
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Read environment variables
let supabaseUrl, supabaseAnonKey, supabaseServiceKey
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const envLines = envContent.split('\n')
  
  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1]
    } else if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1]
    } else if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      supabaseServiceKey = line.split('=')[1]
    }
  }
} catch (error) {
  console.error('❌ Could not read .env.local file:', error.message)
  process.exit(1)
}

console.log('🔍 检查Supabase配置...')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')
console.log('Service Key:', supabaseServiceKey ? 'Present' : 'Missing')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testTables() {
  console.log('\n📊 测试数据库表...')
  
  const tables = ['categories', 'products', 'users', 'orders', 'favorites', 'contact_messages']
  let successCount = 0
  
  for (const table of tables) {
    try {
      console.log(`📄 测试表: ${table}`)
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`)
      } else {
        console.log(`   ✅ ${table}: 表存在且可访问`)
        successCount++
      }
    } catch (err) {
      console.log(`   ❌ ${table}: ${err.message}`)
    }
  }
  
  console.log(`\n📊 结果: ${successCount}/${tables.length} 个表可访问`)
  
  if (successCount === tables.length) {
    console.log('\n🎉 所有表都已成功创建！')
    console.log('\n🚀 现在可以启动网站:')
    console.log('   npm run dev')
    
    // Try to start the dev server
    const { spawn } = require('child_process')
    console.log('\n🚀 正在启动开发服务器...')
    
    const devProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    })
    
    devProcess.on('error', (error) => {
      console.error('❌ 启动失败:', error.message)
      console.log('\n💡 请手动启动: npm run dev')
    })
    
  } else if (successCount > 0) {
    console.log(`\n⚠️  部分表创建成功 (${successCount}/${tables.length})`)
    console.log('💡 可能需要重新执行SQL脚本或检查权限设置')
  } else {
    console.log('\n❌ 没有表被创建')
    console.log('💡 请检查SQL脚本是否正确执行')
  }
}

testTables().catch(error => {
  console.error('❌ 测试失败:', error.message)
})
