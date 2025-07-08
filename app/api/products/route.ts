import { NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/products'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    const search = searchParams.get('search')

    let products

    if (search) {
      products = await ProductService.searchProducts(search)
    } else if (categoryId) {
      products = await ProductService.getProductsByCategory(categoryId)
    } else {
      products = await ProductService.getProducts()
    }

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
