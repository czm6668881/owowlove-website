// 直接测试 Supabase 连接和数据
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://zzexacrffmxmqrqamcxo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZXhhY3JmZm14bXFycWFtY3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzAxODEsImV4cCI6MjA2NzU0NjE4MX0.OjvVxog9bRc6zixbJTFp0Jgg-xzpv1ZuDKEba2-dG34'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  
  try {
    // 测试 categories
    console.log('\n=== Testing Categories ===')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
    
    if (catError) {
      console.error('Categories error:', catError)
    } else {
      console.log('Categories found:', categories?.length || 0)
      console.log('Categories data:', categories)
    }

    // 测试 products
    console.log('\n=== Testing Products ===')
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
    
    if (prodError) {
      console.error('Products error:', prodError)
    } else {
      console.log('Products found:', products?.length || 0)
      console.log('Products data:', products)
    }

    // 测试表是否存在
    console.log('\n=== Testing Table Existence ===')
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tableError) {
      console.error('Tables error:', tableError)
    } else {
      console.log('Available tables:', tables?.map(t => t.table_name))
    }

  } catch (error) {
    console.error('Connection test failed:', error)
  }
}

testConnection()
