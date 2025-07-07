import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/data/products'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updateData = await request.json()



    // Get the original product first
    const originalProduct = await ProductService.getProductById(id)
    if (!originalProduct) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }



    // Process variants data properly
    const processedVariants = (updateData.variants || []).map((variant: any, index: number) => ({
        id: variant.id || `${Date.now()}-${index}`, // Keep existing id or generate new one
        size: variant.size,
        color: variant.color,
        price: Number(variant.price) || 0,
        originalPrice: variant.originalPrice ? Number(variant.originalPrice) : undefined,
        stock: Number(variant.stock) || 0,
        sku: variant.sku || `${variant.size}-${variant.color}-${Date.now()}`
      }))

    // Prepare update data for ProductService
    const updatePayload = {
      nameEn: updateData.nameEn,
      descriptionEn: updateData.descriptionEn || '',
      category: updateData.category || 'general',
      isActive: updateData.isActive ?? true,
      variants: processedVariants,
      tags: updateData.tags || [],
      images: updateData.images || [],
      seoTitle: updateData.seoTitle || '',
      seoDescription: updateData.seoDescription || '',
      seoKeywords: updateData.seoKeywords || []
    }

    // Use ProductService to update (this will handle caching properly)
    const updatedProduct = await ProductService.updateProduct(id, updatePayload)

    if (!updatedProduct) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update product'
      }, { status: 500 })
    }



    return NextResponse.json({
      success: true,
      data: updatedProduct
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update product: ' + (error as Error).message
    }, { status: 500 })
  }
}
