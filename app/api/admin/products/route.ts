import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/data/products'
import { CreateProductRequest } from '@/lib/types/product'

export async function GET() {
  try {
    const products = await ProductService.getAllProductsAdmin()
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证必填字段
    if (!body.nameEn) {
      return NextResponse.json(
        { success: false, error: 'Product name (English) is required' },
        { status: 400 }
      )
    }

    // Generate product data
    const productData = {
      nameKey: `product.${body.nameEn.toLowerCase().replace(/\s+/g, '_')}`,
      nameEn: body.nameEn,
      descriptionEn: body.descriptionEn || '',
      category: body.category || 'general',
      tags: body.tags || [],
      variants: (body.variants || []).map((variant, index) => ({
        id: `${Date.now()}-${index}`,
        size: variant.size,
        color: variant.color,
        price: Number(variant.price) || 0,
        originalPrice: variant.originalPrice ? Number(variant.originalPrice) : undefined,
        stock: Number(variant.stock) || 0,
        sku: variant.sku || `${variant.size}-${variant.color}-${Date.now()}`
      })),
      images: (body.images || []).map((image, index) => ({
        ...image,
        id: `${Date.now()}-img-${index}`
      })),
      rating: 0,
      reviews: 0,
      isActive: body.isActive ?? true,
      isNew: false,
      isSale: false,
      seoTitle: body.seoTitle || '',
      seoDescription: body.seoDescription || '',
      seoKeywords: body.seoKeywords || []
    }

    const newProduct = await ProductService.createProduct(productData)
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
