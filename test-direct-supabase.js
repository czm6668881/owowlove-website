// 直接测试 Supabase 连接
const { createClient } = require('@supabase/supabase-js')

// 使用生产环境的配置
const supabaseUrl = 'https://zzexacrffmxmqrqamcxo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZXhhY3JmZm14bXFycWFtY3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzAxODEsImV4cCI6MjA2NzU0NjE4MX0.OjvVxog9bRc6zixbJTFp0Jgg-xzpv1ZuDKEba2-dG34'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDirectAccess() {
  console.log('=== 直接测试 Supabase 连接 ===')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseAnonKey.substring(0, 20) + '...')
  
  try {
    // 测试 categories
    console.log('\n--- 测试 Categories ---')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
    
    if (catError) {
      console.error('Categories 错误:', catError)
    } else {
      console.log('Categories 成功:', categories?.length || 0, '条记录')
      if (categories && categories.length > 0) {
        console.log('第一个分类:', categories[0])
      }
    }

    // 测试 products
    console.log('\n--- 测试 Products ---')
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
    
    if (prodError) {
      console.error('Products 错误:', prodError)
    } else {
      console.log('Products 成功:', products?.length || 0, '条记录')
      if (products && products.length > 0) {
        console.log('第一个产品:', products[0])
      }
    }

    // 测试带条件的查询（模拟API）
    console.log('\n--- 测试带条件的 Products 查询 ---')
    const { data: activeProducts, error: activeError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, description, image)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (activeError) {
      console.error('Active Products 错误:', activeError)
    } else {
      console.log('Active Products 成功:', activeProducts?.length || 0, '条记录')
      if (activeProducts && activeProducts.length > 0) {
        console.log('第一个活跃产品:', activeProducts[0])
      }
    }

    // 测试 categories 带条件
    console.log('\n--- 测试带条件的 Categories 查询 ---')
    const { data: activeCategories, error: activeCatError } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')
    
    if (activeCatError) {
      console.error('Active Categories 错误:', activeCatError)
    } else {
      console.log('Active Categories 成功:', activeCategories?.length || 0, '条记录')
      if (activeCategories && activeCategories.length > 0) {
        console.log('第一个活跃分类:', activeCategories[0])
      }
    }

  } catch (error) {
    console.error('测试失败:', error)
  }
}

testDirectAccess()
