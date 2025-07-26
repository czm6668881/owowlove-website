import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// GET - 获取单个评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Getting blog comment:', resolvedParams.id)
    
    const comment = await BlogService.getCommentById(resolvedParams.id)
    
    if (!comment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Comment not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog comment found:', comment.id)
    
    return NextResponse.json({
      success: true,
      data: comment
    })
  } catch (error) {
    console.error('❌ Error fetching blog comment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog comment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - 更新评论状态
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Updating blog comment:', resolvedParams.id)
    
    const body = await request.json()
    
    const updatedComment = await BlogService.updateCommentStatus(resolvedParams.id, body.status)
    
    if (!updatedComment) {
      return NextResponse.json(
        {
          success: false,
          error: 'Comment not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog comment updated:', updatedComment.id)
    
    return NextResponse.json({
      success: true,
      data: updatedComment
    })
  } catch (error) {
    console.error('❌ Error updating blog comment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update blog comment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - 删除评论
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Deleting blog comment:', resolvedParams.id)
    
    const success = await BlogService.deleteComment(resolvedParams.id)
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Comment not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog comment deleted:', resolvedParams.id)
    
    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting blog comment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete blog comment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
