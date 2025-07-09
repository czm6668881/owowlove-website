import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // 直接使用硬编码的配置测试
    const supabaseUrl = 'https://zzexacrffmxmqrqamcxo.supabase.co'
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZXhhY3JmZm14bXFycWFtY3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzAxODEsImV4cCI6MjA2NzU0NjE4MX0.OjvVxog9bRc6zixbJTFp0Jgg-xzpv1ZuDKEba2-dG34'
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    console.log('🔧 Debug Connection Test Started')
    
    // 测试1: 环境变量
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL_ENV: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_KEY_ENV: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      HARDCODED_URL: supabaseUrl,
      HARDCODED_KEY: supabaseKey.substring(0, 20) + '...'
    }
    
    // 测试2: 直接查询产品表
    console.log('📦 Testing products table...')
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('*')
      .limit(10)
    
    // 测试3: 查询分类表
    console.log('📂 Testing categories table...')
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(10)
    
    // 测试4: 带JOIN的查询
    console.log('🔗 Testing JOIN query...')
    const { data: joinData, error: joinError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, description, image)
      `)
      .limit(5)
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: envCheck,
      tests: {
        products: {
          count: products?.length || 0,
          error: prodError?.message || null,
          sample: products?.[0] || null
        },
        categories: {
          count: categories?.length || 0,
          error: catError?.message || null,
          sample: categories?.[0] || null
        },
        joinQuery: {
          count: joinData?.length || 0,
          error: joinError?.message || null,
          sample: joinData?.[0] || null
        }
      },
      rawData: {
        products: products || [],
        categories: categories || []
      }
    })
    
  } catch (error) {
    console.error('💥 Debug connection error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
