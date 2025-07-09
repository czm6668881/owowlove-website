import { NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/products'

export async function GET(request: Request) {
  try {
    console.log('🔍 Products API called at:', new Date().toISOString())
    console.log('🔧 Environment check:', {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      SUPABASE_KEY_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    const search = searchParams.get('search')

    console.log('📝 Query params:', { categoryId, search })

    let products

    if (search) {
      console.log('🔍 Searching products with query:', search)
      products = await ProductService.searchProducts(search)
    } else if (categoryId) {
      console.log('📂 Getting products by category:', categoryId)
      products = await ProductService.getProductsByCategory(categoryId)
    } else {
      console.log('📦 Getting all products')
      products = await ProductService.getProducts()
    }

    console.log('✅ Products fetched:', products?.length || 0)
    console.log('📊 First product sample:', products?.[0] ? {
      id: products[0].id,
      name: products[0].name,
      is_active: products[0].is_active
    } : 'No products')

    return NextResponse.json({
      success: true,
      data: products,
      debug: {
        count: products?.length || 0,
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('❌ Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
