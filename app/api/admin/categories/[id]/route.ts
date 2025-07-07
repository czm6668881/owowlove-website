import { NextRequest, NextResponse } from 'next/server'
import { CategoryService } from '@/lib/data/categories'

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

    return NextResponse.json({
      success: true,
      data: category
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
    
    const updateData = {
      name: body.name,
      nameEn: body.nameEn,
      description: body.description,
      isActive: body.isActive
    }

    const updatedCategory = await CategoryService.updateCategory(id, updateData)
    
    if (!updatedCategory) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update category'
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
    const deleted = await CategoryService.deleteCategory(id)
    
    if (!deleted) {
      return NextResponse.json({
        success: false,
        error: 'Category not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete category'
    }, { status: 500 })
  }
}
