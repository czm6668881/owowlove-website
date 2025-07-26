import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// GET - 获取单个标签
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Getting blog tag:', resolvedParams.id)
    
    const tag = await BlogService.getTagById(resolvedParams.id)
    
    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog tag not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog tag found:', tag.name)
    
    return NextResponse.json({
      success: true,
      data: tag
    })
  } catch (error) {
    console.error('❌ Error fetching blog tag:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog tag',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - 更新标签
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Updating blog tag:', resolvedParams.id)
    
    const body = await request.json()
    
    const updatedTag = await BlogService.updateTag({
      id: resolvedParams.id,
      ...body
    })
    
    if (!updatedTag) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog tag not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog tag updated:', updatedTag.name)
    
    return NextResponse.json({
      success: true,
      data: updatedTag
    })
  } catch (error) {
    console.error('❌ Error updating blog tag:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update blog tag',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - 删除标签
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Deleting blog tag:', resolvedParams.id)
    
    const success = await BlogService.deleteTag(resolvedParams.id)
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog tag not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog tag deleted:', resolvedParams.id)
    
    return NextResponse.json({
      success: true,
      message: 'Blog tag deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting blog tag:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete blog tag',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
