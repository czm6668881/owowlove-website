import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/data/products'

type Props = {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params
    const product = await ProductService.toggleProductStatus(resolvedParams.id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: product,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to toggle product status' },
      { status: 500 }
    )
  }
}
