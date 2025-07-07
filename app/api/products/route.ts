import { NextResponse } from 'next/server'
import { ProductService } from '@/lib/data/products'

export async function GET() {
  try {
    const products = await ProductService.getAllProducts()
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
