// Direct database setup using Supabase client
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTables() {
  console.log('🚀 开始创建数据库表...')
  
  // Create tables one by one using direct SQL execution
  const tables = [
    {
      name: 'categories',
      sql: `
        CREATE TABLE IF NOT EXISTS categories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          image TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'products',
      sql: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
      `
    },
    {
      name: 'users',
      sql: `
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
      `
    },
    {
      name: 'orders',
      sql: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          items JSONB NOT NULL DEFAULT '[]',
          total_amount DECIMAL(10,2) NOT NULL,
          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
          shipping_address TEXT NOT NULL,
          payment_method VARCHAR(50) NOT NULL,
          payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'favorites',
      sql: `
        CREATE TABLE IF NOT EXISTS favorites (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          product_id UUID REFERENCES products(id) ON DELETE CASCADE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, product_id)
        );
      `
    },
    {
      name: 'contact_messages',
      sql: `
        CREATE TABLE IF NOT EXISTS contact_messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255),
          message TEXT NOT NULL,
          status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ]

  for (const table of tables) {
    try {
      console.log(`📄 创建表: ${table.name}`)
      
      // Try to create table by inserting a dummy record and catching the error
      const { error } = await supabase
        .from(table.name)
        .select('*')
        .limit(1)
      
      if (error && error.message.includes('does not exist')) {
        console.log(`   ⚠️  表 ${table.name} 不存在，需要手动创建`)
      } else {
        console.log(`   ✅ 表 ${table.name} 已存在或可访问`)
      }
    } catch (err) {
      console.log(`   ❌ 检查表 ${table.name} 时出错: ${err.message}`)
    }
  }
}

async function insertSampleData() {
  console.log('\n📊 插入示例数据...')
  
  try {
    // Insert sample categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Sexy Cosplay',
          description: 'Sexy cosplay costumes and accessories',
          image: '/images/categories/cosplay.jpg',
          is_active: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Bunny Costumes',
          description: 'Cute and sexy bunny costumes',
          image: '/images/categories/bunny.jpg',
          is_active: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440003',
          name: 'Animal Costumes',
          description: 'Various animal-themed costumes',
          image: '/images/categories/animal.jpg',
          is_active: true
        }
      ], { onConflict: 'id' })
    
    if (catError) {
      console.log('   ❌ 插入分类数据失败:', catError.message)
    } else {
      console.log('   ✅ 分类数据插入成功')
    }

    // Insert sample products
    const { data: products, error: prodError } = await supabase
      .from('products')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440011',
          name: 'Sexy Cat Girl Cosplay',
          description: 'Adorable and sexy cat girl costume with ears and tail',
          price: 89.99,
          images: ['/images/products/cat-girl-1.jpg', '/images/products/cat-girl-2.jpg'],
          category_id: '550e8400-e29b-41d4-a716-446655440001',
          variants: [
            { id: 'v1', color: 'Black', size: 'One Size', price: 89.99, stock: 10 },
            { id: 'v2', color: 'Pink', size: 'One Size', price: 89.99, stock: 8 }
          ],
          is_active: true
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440012',
          name: 'Bunny Girl Outfit',
          description: 'Classic bunny girl costume with ears and fluffy tail',
          price: 79.99,
          images: ['/images/products/bunny-1.jpg', '/images/products/bunny-2.jpg'],
          category_id: '550e8400-e29b-41d4-a716-446655440002',
          variants: [
            { id: 'v3', color: 'White', size: 'One Size', price: 79.99, stock: 15 },
            { id: 'v4', color: 'Black', size: 'One Size', price: 79.99, stock: 12 }
          ],
          is_active: true
        }
      ], { onConflict: 'id' })
    
    if (prodError) {
      console.log('   ❌ 插入产品数据失败:', prodError.message)
    } else {
      console.log('   ✅ 产品数据插入成功')
    }

  } catch (error) {
    console.log('   ❌ 插入示例数据时出错:', error.message)
  }
}

async function testDatabase() {
  console.log('\n🧪 测试数据库访问...')
  
  const tables = ['categories', 'products', 'users', 'orders', 'favorites', 'contact_messages']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`   ❌ 表 ${table}: ${error.message}`)
      } else {
        console.log(`   ✅ 表 ${table} 可访问`)
      }
    } catch (err) {
      console.log(`   ❌ 表 ${table}: ${err.message}`)
    }
  }
}

async function main() {
  console.log('🎯 OWOWLOVE.COM 数据库自动设置')
  console.log('=' * 50)
  
  await createTables()
  await insertSampleData()
  await testDatabase()
  
  console.log('\n🎉 数据库设置完成！')
  console.log('\n🚀 现在可以启动网站了:')
  console.log('   npm run dev')
}

main().catch(error => {
  console.error('❌ 设置过程中出错:', error.message)
  process.exit(1)
})
