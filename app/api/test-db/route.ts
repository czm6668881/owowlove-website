import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
    
    if (catError) {
      console.error('Categories error:', catError)
      return NextResponse.json({
        success: false,
        error: 'Categories query failed',
        details: catError
      })
    }

    // Test products
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, description, image)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (prodError) {
      console.error('Products error:', prodError)
      return NextResponse.json({
        success: false,
        error: 'Products query failed',
        details: prodError
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        categories: {
          count: categories?.length || 0,
          data: categories
        },
        products: {
          count: products?.length || 0,
          data: products
        }
      },
      message: 'Database connection successful'
    })
    
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
