import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/data/products'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updateData = await request.json()

    console.log(`🔄 Updating product: ${id}`)
    console.log(`📝 Update data:`, updateData)

    // Get the original product from Supabase directly
    const { data: originalProduct, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !originalProduct) {
      console.error(`❌ Product not found: ${id}`, fetchError)
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 })
    }

    console.log(`✅ Original product found: ${originalProduct.name}`)



    // Process variants data properly
    const processedVariants = (updateData.variants || []).map((variant: any, index: number) => ({
      id: variant.id || `v${Date.now()}-${index}`,
      size: variant.size,
      color: variant.color,
      price: Number(variant.price) || 0,
      stock: Number(variant.stock) || 0
    }))

    // Prepare update data for Supabase
    const updatePayload = {
      name: updateData.nameEn,
      description: updateData.descriptionEn || '',
      price: processedVariants.length > 0 ? processedVariants[0].price : 0,
      category_id: updateData.category || null,
      is_active: updateData.isActive ?? true,
      variants: processedVariants,
      images: updateData.images || [],
      updated_at: new Date().toISOString()
    }

    console.log(`📝 Supabase update payload:`, updatePayload)

    // Update product in Supabase
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (updateError || !updatedProduct) {
      console.error(`❌ Failed to update product:`, updateError)
      return NextResponse.json({
        success: false,
        error: 'Failed to update product: ' + (updateError?.message || 'Unknown error')
      }, { status: 500 })
    }

    console.log(`✅ Product updated successfully: ${updatedProduct.name}`)

    // Clear ProductService cache to ensure fresh data
    ProductService.clearCache()



    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('❌ Error updating product:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update product: ' + (error as Error).message
    }, { status: 500 })
  }
}
