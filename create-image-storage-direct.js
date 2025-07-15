#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createImageStorageTable() {
  console.log('🗄️  Creating image_storage table directly...')
  
  try {
    // 首先检查表是否已存在
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'image_storage')
      .eq('table_schema', 'public')
    
    if (checkError) {
      console.log('⚠️  Cannot check existing tables, proceeding with creation...')
    } else if (existingTables && existingTables.length > 0) {
      console.log('✅ Table image_storage already exists')
      return true
    }

    // 尝试创建表 - 使用简单的插入测试来检查表是否存在
    const { error: testError } = await supabase
      .from('image_storage')
      .select('id')
      .limit(1)
    
    if (!testError) {
      console.log('✅ Table image_storage already exists and accessible')
      return true
    }

    console.log('📝 Table does not exist. Creating via SQL...')
    
    // 使用 PostgreSQL 客户端直接执行 SQL
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS image_storage (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        filename VARCHAR(255) UNIQUE NOT NULL,
        data TEXT NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        size INTEGER NOT NULL,
        product_id UUID,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_image_storage_filename ON image_storage(filename);
      CREATE INDEX IF NOT EXISTS idx_image_storage_product_id ON image_storage(product_id);
      CREATE INDEX IF NOT EXISTS idx_image_storage_created_at ON image_storage(created_at);
    `

    // 尝试通过 RPC 执行
    const { error: rpcError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
    
    if (rpcError) {
      console.log('⚠️  RPC method failed:', rpcError.message)
      console.log('📋 Please execute this SQL manually in Supabase SQL Editor:')
      console.log('=' * 60)
      console.log(createTableSQL)
      console.log('=' * 60)
      return false
    }

    console.log('✅ Table created successfully via RPC')
    
    // 验证表创建
    const { error: verifyError } = await supabase
      .from('image_storage')
      .select('id')
      .limit(1)
    
    if (verifyError) {
      console.log('⚠️  Table creation verification failed:', verifyError.message)
      return false
    }

    console.log('✅ Table verified and accessible')
    return true

  } catch (error) {
    console.error('❌ Error creating table:', error.message)
    console.log('📋 Please execute this SQL manually in Supabase SQL Editor:')
    console.log('=' * 60)
    console.log(`
CREATE TABLE IF NOT EXISTS image_storage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) UNIQUE NOT NULL,
  data TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  product_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_image_storage_filename ON image_storage(filename);
CREATE INDEX IF NOT EXISTS idx_image_storage_product_id ON image_storage(product_id);
CREATE INDEX IF NOT EXISTS idx_image_storage_created_at ON image_storage(created_at);
    `)
    console.log('=' * 60)
    return false
  }
}

async function main() {
  const success = await createImageStorageTable()
  
  if (success) {
    console.log('🎉 Image storage table is ready!')
    console.log('✅ You can now run: node production-image-sync.js')
  } else {
    console.log('⚠️  Manual table creation required')
    console.log('📝 After creating the table manually, run: node production-image-sync.js')
  }
  
  process.exit(success ? 0 : 1)
}

main()
