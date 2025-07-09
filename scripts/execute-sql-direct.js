// Direct SQL execution via Supabase REST API
const fs = require('fs')
const https = require('https')

// Read environment variables from .env.local
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

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!')
  process.exit(1)
}

// Extract project reference from URL
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql })
    
    const options = {
      hostname: `${projectRef}.supabase.co`,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: data })
        } else {
          resolve({ success: false, error: data, statusCode: res.statusCode })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.write(postData)
    req.end()
  })
}

async function executeSQLStatements() {
  console.log('🚀 开始执行数据库设置...')
  
  try {
    // Read the complete SQL file
    const sqlContent = fs.readFileSync('complete-database-setup.sql', 'utf8')
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== '')
    
    console.log(`📋 找到 ${statements.length} 个SQL语句`)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      console.log(`\n📄 执行语句 ${i + 1}/${statements.length}...`)
      console.log(`   ${statement.substring(0, 50)}...`)
      
      try {
        const result = await executeSQL(statement)
        
        if (result.success) {
          console.log(`   ✅ 执行成功`)
          successCount++
        } else {
          console.log(`   ❌ 执行失败: ${result.error}`)
          errorCount++
        }
      } catch (error) {
        console.log(`   ❌ 网络错误: ${error.message}`)
        errorCount++
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`\n📊 执行结果:`)
    console.log(`   ✅ 成功: ${successCount}`)
    console.log(`   ❌ 失败: ${errorCount}`)
    
    if (errorCount === 0) {
      console.log('\n🎉 数据库设置完成！')
    } else {
      console.log('\n⚠️  部分语句执行失败，但这可能是正常的（如表已存在等）')
    }
    
  } catch (error) {
    console.error('❌ 执行过程中出错:', error.message)
  }
}

// Alternative method using curl
async function executeSQLWithCurl() {
  console.log('🔄 尝试使用curl方法执行SQL...')
  
  const { spawn } = require('child_process')
  
  const sqlContent = fs.readFileSync('complete-database-setup.sql', 'utf8')
  
  const curlCommand = [
    'curl',
    '-X', 'POST',
    `${supabaseUrl}/rest/v1/rpc/exec_sql`,
    '-H', `Authorization: Bearer ${supabaseServiceKey}`,
    '-H', `apikey: ${supabaseServiceKey}`,
    '-H', 'Content-Type: application/json',
    '-d', JSON.stringify({ query: sqlContent })
  ]
  
  return new Promise((resolve, reject) => {
    const process = spawn(curlCommand[0], curlCommand.slice(1), {
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
      if (code === 0) {
        console.log('✅ curl执行成功')
        console.log('响应:', stdout)
        resolve(true)
      } else {
        console.log('❌ curl执行失败')
        console.log('错误:', stderr)
        resolve(false)
      }
    })
    
    process.on('error', (error) => {
      console.log('❌ curl命令错误:', error.message)
      resolve(false)
    })
  })
}

// Main execution
async function main() {
  console.log('🎯 OWOWLOVE.COM 数据库自动设置')
  console.log('=' * 50)
  
  // Try method 1: Direct HTTPS request
  await executeSQLStatements()
  
  // Try method 2: curl (if available)
  console.log('\n🔄 尝试备用方法...')
  await executeSQLWithCurl()
  
  console.log('\n🧪 验证数据库设置...')
  
  // Run the test script
  const { spawn } = require('child_process')
  
  const testProcess = spawn('node', ['test-supabase-connection.js'], {
    stdio: 'inherit'
  })
  
  testProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n🎉 数据库设置验证成功！')
      console.log('\n🚀 现在可以启动网站了:')
      console.log('   npm run dev')
    } else {
      console.log('\n⚠️  验证失败，可能需要手动设置')
      console.log('\n📋 请按照 SUPABASE_QUICK_SETUP.md 中的步骤手动执行')
    }
  })
}

main().catch(error => {
  console.error('❌ 主程序执行失败:', error.message)
  process.exit(1)
})
