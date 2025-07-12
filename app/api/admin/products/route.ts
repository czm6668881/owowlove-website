import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/products'
import { CreateProductRequest } from '@/lib/types/product'

export async function GET() {
  try {
    console.log('🔍 Admin Products API called at:', new Date().toISOString())
    const products = await ProductService.getProducts()
    console.log('✅ Admin products fetched:', products?.length || 0)
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('❌ Error fetching admin products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔄 Creating product:', body)

    // 验证必填字段
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Product name is required' },
        { status: 400 }
      )
    }

    // 如果没有variants，至少需要一个价格
    if (!body.variants || body.variants.length === 0) {
      if (!body.price) {
        return NextResponse.json(
          { success: false, error: 'Product price or variants are required' },
          { status: 400 }
        )
      }
    }

    // 转换数据格式以匹配Supabase schema
    const productData = {
      name: body.name,
      description: body.description || '',
      price: Number(body.price) || 0,
      images: body.images || [],
      category_id: body.category_id || null,
      variants: (body.variants || []).map((variant, index) => ({
        id: `v${Date.now()}-${index}`,
        size: variant.size || 'One Size',
        color: variant.color || 'Default',
        price: Number(variant.price) || Number(body.price) || 0,
        stock: Number(variant.stock) || 0
      })),
      is_active: body.is_active !== false
    }

    console.log('📝 Product data for Supabase:', productData)

    const product = await ProductService.createProduct(productData)
    console.log('✅ Product created successfully:', product)

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
