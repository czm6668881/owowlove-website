import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/products'

interface Props {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params
    console.log('🔍 Getting product by ID for frontend:', resolvedParams.id)

    const product = await ProductService.getProductById(resolvedParams.id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    console.log('✅ Product found for frontend:', product.name)
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('❌ Error fetching product for frontend:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
