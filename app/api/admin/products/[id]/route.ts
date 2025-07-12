import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/products'
import { UpdateProductRequest } from '@/lib/types/product'

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params
    console.log('🔍 Getting product by ID:', resolvedParams.id)

    const product = await ProductService.getProductById(resolvedParams.id)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    console.log('✅ Product found:', product.name)
    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error('❌ Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params
    const body: UpdateProductRequest = await request.json()
    
    const updatedProduct = await ProductService.updateProduct(resolvedParams.id, body)
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: updatedProduct })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params
    console.log('🗑️ Deleting product:', resolvedParams.id)

    await ProductService.deleteProduct(resolvedParams.id)
    console.log('✅ Product deleted successfully')

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('❌ Delete API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
