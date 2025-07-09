// Execute SQL via curl command
const { spawn } = require('child_process')
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

// Read the SQL script
const sqlScript = fs.readFileSync('ONE_CLICK_SETUP.sql', 'utf8')

async function executeSQLViaCurl() {
  console.log('🚀 使用curl执行SQL脚本...')
  
  // Create a temporary file with the SQL
  const tempSqlFile = 'temp_setup.sql'
  fs.writeFileSync(tempSqlFile, sqlScript)
  
  // Try different curl approaches
  const methods = [
    // Method 1: Direct SQL execution via PostgREST
    {
      name: 'PostgREST SQL',
      command: 'curl',
      args: [
        '-X', 'POST',
        `${supabaseUrl}/rest/v1/rpc/exec_sql`,
        '-H', `Authorization: Bearer ${supabaseServiceKey}`,
        '-H', `apikey: ${supabaseServiceKey}`,
        '-H', 'Content-Type: application/json',
        '-d', JSON.stringify({ query: sqlScript })
      ]
    },
    // Method 2: Try via database URL
    {
      name: 'Database Direct',
      command: 'curl',
      args: [
        '-X', 'POST',
        `${supabaseUrl}/database/query`,
        '-H', `Authorization: Bearer ${supabaseServiceKey}`,
        '-H', 'Content-Type: application/json',
        '-d', JSON.stringify({ sql: sqlScript })
      ]
    }
  ]
  
  for (const method of methods) {
    console.log(`\n📡 尝试方法: ${method.name}`)
    
    try {
      const result = await executeCommand(method.command, method.args)
      
      if (result.success) {
        console.log('✅ 执行成功!')
        console.log('响应:', result.stdout)
        
        // Clean up temp file
        if (fs.existsSync(tempSqlFile)) {
          fs.unlinkSync(tempSqlFile)
        }
        
        return true
      } else {
        console.log('❌ 执行失败:', result.stderr)
      }
    } catch (error) {
      console.log('❌ 命令执行错误:', error.message)
    }
  }
  
  // Clean up temp file
  if (fs.existsSync(tempSqlFile)) {
    fs.unlinkSync(tempSqlFile)
  }
  
  return false
}

function executeCommand(command, args) {
  return new Promise((resolve) => {
    const process = spawn(command, args, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
    
    let stdout = ''
    let stderr = ''
    
    process.stdout.on('data', (data) => {
      stdout += data.toString()
    })
    
    process.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    
    process.on('close', (code) => {
      resolve({
        success: code === 0,
        stdout: stdout,
        stderr: stderr,
        code: code
      })
    })
    
    process.on('error', (error) => {
      resolve({
        success: false,
        stdout: '',
        stderr: error.message,
        code: -1
      })
    })
  })
}

async function createTablesManually() {
  console.log('\n🔧 尝试手动创建表...')
  
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  // Try to create tables by attempting operations that would create them
  const tableOperations = [
    {
      table: 'categories',
      operation: async () => {
        return await supabase.from('categories').insert({
          name: 'Test Category',
          description: 'Test',
          image: '/test.jpg',
          is_active: true
        })
      }
    },
    {
      table: 'products',
      operation: async () => {
        return await supabase.from('products').insert({
          name: 'Test Product',
          description: 'Test',
          price: 99.99,
          images: ['/test.jpg'],
          variants: [],
          is_active: true
        })
      }
    }
  ]
  
  for (const op of tableOperations) {
    try {
      console.log(`📄 测试表: ${op.table}`)
      const result = await op.operation()
      
      if (result.error) {
        if (result.error.message.includes('does not exist')) {
          console.log(`   ⚠️  表 ${op.table} 不存在`)
        } else {
          console.log(`   ✅ 表 ${op.table} 存在但有其他错误: ${result.error.message}`)
        }
      } else {
        console.log(`   ✅ 表 ${op.table} 存在且可用`)
      }
    } catch (error) {
      console.log(`   ❌ 表 ${op.table} 测试失败: ${error.message}`)
    }
  }
}

async function main() {
  console.log('🎯 OWOWLOVE.COM 数据库自动执行')
  console.log('=' * 50)
  
  // Try curl method
  const curlSuccess = await executeSQLViaCurl()
  
  if (!curlSuccess) {
    console.log('\n🔧 curl方法失败，尝试其他方法...')
    await createTablesManually()
  }
  
  // Always run verification at the end
  console.log('\n🧪 验证数据库设置...')
  
  const testProcess = spawn('node', ['test-supabase-connection.js'], {
    stdio: 'inherit'
  })
  
  testProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 数据库设置验证完成！')
      console.log('\n🚀 现在可以启动网站:')
      console.log('   npm run dev')
    } else {
      console.log('\n⚠️  验证失败，需要手动设置')
      console.log('\n📋 请手动执行以下步骤:')
      console.log('1. 打开: https://supabase.com/dashboard/project/zzexacrffmxmqrqamcxo/sql/new')
      console.log('2. 复制 ONE_CLICK_SETUP.sql 的内容')
      console.log('3. 粘贴到SQL编辑器并点击Run')
      console.log('4. 运行: node test-supabase-connection.js')
    }
  })
}

main().catch(error => {
  console.error('❌ 执行失败:', error.message)
  process.exit(1)
})
