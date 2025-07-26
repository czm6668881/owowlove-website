import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// GET - 获取单个分类
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Getting blog category:', resolvedParams.id)
    
    const category = await BlogService.getCategoryById(resolvedParams.id)
    
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog category not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog category found:', category.name)
    
    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('❌ Error fetching blog category:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - 更新分类
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Updating blog category:', resolvedParams.id)
    
    const body = await request.json()
    
    const updatedCategory = await BlogService.updateCategory({
      id: resolvedParams.id,
      ...body
    })
    
    if (!updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog category not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog category updated:', updatedCategory.name)
    
    return NextResponse.json({
      success: true,
      data: updatedCategory
    })
  } catch (error) {
    console.error('❌ Error updating blog category:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update blog category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - 删除分类
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Deleting blog category:', resolvedParams.id)
    
    const success = await BlogService.deleteCategory(resolvedParams.id)
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog category not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog category deleted:', resolvedParams.id)
    
    return NextResponse.json({
      success: true,
      message: 'Blog category deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting blog category:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete blog category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
