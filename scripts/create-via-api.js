// Create tables using Supabase Management API
const https = require('https')
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

const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '')

// Simple table creation SQL
const createTablesSQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id),
  variants JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  shipping_address TEXT NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON products FOR SELECT USING (true);
`

async function executeViaManagementAPI() {
  console.log('🚀 尝试通过Supabase Management API执行...')
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: createTablesSQL
    })
    
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${projectRef}/database/query`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        console.log(`状态码: ${res.statusCode}`)
        console.log(`响应: ${data}`)
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })

    req.on('error', (error) => {
      console.log('请求错误:', error.message)
      resolve(false)
    })

    req.write(postData)
    req.end()
  })
}

async function createTablesDirectly() {
  console.log('\n🔧 尝试直接创建表结构...')
  
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  // Try to create sample data which might trigger table creation
  const sampleData = [
    {
      table: 'categories',
      data: {
        name: 'Sexy Cosplay',
        description: 'Sexy cosplay costumes',
        image: '/placeholder.jpg',
        is_active: true
      }
    },
    {
      table: 'products', 
      data: {
        name: 'Test Product',
        description: 'Test product',
        price: 99.99,
        images: ['/placeholder.jpg'],
        variants: [],
        is_active: true
      }
    }
  ]
  
  for (const item of sampleData) {
    try {
      console.log(`📄 尝试操作表: ${item.table}`)
      
      const { data, error } = await supabase
        .from(item.table)
        .insert(item.data)
        .select()
      
      if (error) {
        console.log(`   ❌ ${item.table}: ${error.message}`)
      } else {
        console.log(`   ✅ ${item.table}: 成功插入数据`)
      }
    } catch (err) {
      console.log(`   ❌ ${item.table}: ${err.message}`)
    }
  }
}

async function showFinalInstructions() {
  console.log('\n📋 最终解决方案:')
  console.log('=' * 50)
  console.log('由于Supabase的安全限制，无法通过API直接创建表。')
  console.log('请按照以下步骤手动完成设置：')
  console.log('')
  console.log('🔗 1. 打开Supabase SQL编辑器:')
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`)
  console.log('')
  console.log('📄 2. 复制SQL脚本:')
  console.log('   打开项目中的 ONE_CLICK_SETUP.sql 文件')
  console.log('   全选并复制所有内容 (Ctrl+A, Ctrl+C)')
  console.log('')
  console.log('▶️ 3. 执行脚本:')
  console.log('   粘贴到SQL编辑器中 (Ctrl+V)')
  console.log('   点击 "Run" 按钮执行')
  console.log('')
  console.log('✅ 4. 验证结果:')
  console.log('   node test-supabase-connection.js')
  console.log('')
  console.log('🚀 5. 启动网站:')
  console.log('   npm run dev')
  console.log('')
  console.log('💡 提示: 执行成功后应该看到 "Success. No rows returned" 消息')
}

async function main() {
  console.log('🎯 OWOWLOVE.COM 最终数据库设置尝试')
  console.log('=' * 50)
  
  // Try Management API
  const apiSuccess = await executeViaManagementAPI()
  
  if (!apiSuccess) {
    console.log('\n🔄 API方法失败，尝试直接操作...')
    await createTablesDirectly()
  }
  
  // Run verification
  console.log('\n🧪 验证当前状态...')
  
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
      console.log('\n🎉 数据库设置成功！')
      console.log('\n🚀 现在可以启动网站:')
      console.log('   npm run dev')
    } else {
      console.log('\n⚠️  表尚未创建，需要手动设置')
      showFinalInstructions()
    }
  })
}

main().catch(error => {
  console.error('❌ 执行失败:', error.message)
  showFinalInstructions()
})
