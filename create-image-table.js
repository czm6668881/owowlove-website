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

async function createImageTable() {
  console.log('🗄️  Creating image_storage table...')
  
  try {
    // 创建表的SQL
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
    `
    
    const { error: createError } = await supabase.rpc('exec_sql', { 
      sql: createTableSQL 
    })
    
    if (createError) {
      console.log('⚠️  Using direct SQL execution...')
      
      // 尝试直接执行SQL
      const { error: directError } = await supabase
        .from('image_storage')
        .select('id')
        .limit(1)
      
      if (directError && directError.message.includes('does not exist')) {
        console.log('❌ Table does not exist. Please create it manually in Supabase SQL Editor:')
        console.log('')
        console.log(createTableSQL)
        console.log('')
        console.log('Then create indexes:')
        console.log('CREATE INDEX IF NOT EXISTS idx_image_storage_filename ON image_storage(filename);')
        console.log('CREATE INDEX IF NOT EXISTS idx_image_storage_product_id ON image_storage(product_id);')
        console.log('')
        return false
      } else {
        console.log('✅ Table already exists or accessible')
        return true
      }
    } else {
      console.log('✅ Table created successfully')
      
      // 创建索引
      const indexSQL = `
        CREATE INDEX IF NOT EXISTS idx_image_storage_filename ON image_storage(filename);
        CREATE INDEX IF NOT EXISTS idx_image_storage_product_id ON image_storage(product_id);
      `
      
      await supabase.rpc('exec_sql', { sql: indexSQL })
      console.log('✅ Indexes created successfully')
      return true
    }
  } catch (error) {
    console.error('❌ Error creating table:', error.message)
    return false
  }
}

createImageTable().then(success => {
  if (success) {
    console.log('🎉 Image storage table is ready!')
    console.log('Now you can run: node production-image-sync.js')
  } else {
    console.log('⚠️  Please create the table manually and try again')
  }
})
