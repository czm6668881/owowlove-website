import { NextRequest, NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/categories'

// GET - Get category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await CategoryService.getCategoryById(id)

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 })
    }

    // Map backend fields to frontend fields
    const mappedCategory = {
      id: category.id,
      name: category.name,
      nameEn: category.name, // Map name to nameEn for frontend compatibility
      description: category.description || '',
      isActive: category.is_active,
      createdAt: category.created_at
    }

    return NextResponse.json({
      success: true,
      data: mappedCategory
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch category'
    }, { status: 500 })
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    console.log('🔄 Updating category:', id, body)

    // Map frontend fields to backend fields
    const updateData = {
      name: body.nameEn || body.name, // Use nameEn as the primary name
      description: body.description || '',
      is_active: body.isActive !== undefined ? body.isActive : true
    }

    console.log('📝 Update data:', updateData)

    const updatedCategory = await CategoryService.updateCategory(id, updateData)

    if (!updatedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 })
    }

    console.log('✅ Category updated successfully:', updatedCategory)

    return NextResponse.json({
      success: true,
      data: updatedCategory
    })
  } catch (error) {
    console.error('❌ Error updating category:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update category: ' + (error as Error).message
    }, { status: 500 })
  }
}

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const url = new URL(request.url)
    const force = url.searchParams.get('force') === 'true'

    console.log('🗑️ Deleting category:', id, 'Force:', force)

    const result = await CategoryService.deleteCategory(id, force)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.message,
        productCount: result.productCount
      }, { status: 400 })
    }

    console.log('✅ Category deleted successfully:', result.message)

    return NextResponse.json({
      success: true,
      message: result.message
    })
  } catch (error) {
    console.error('❌ Error deleting category:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category: ' + (error as Error).message
    }, { status: 500 })
  }
}


