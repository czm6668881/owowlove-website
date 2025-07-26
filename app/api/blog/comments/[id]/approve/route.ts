import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// POST - 审核通过评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Approving blog comment:', resolvedParams.id)
    
    const success = await BlogService.approveComment(resolvedParams.id)
    
    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Comment not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog comment approved:', resolvedParams.id)
    
    return NextResponse.json({
      success: true,
      message: 'Comment approved successfully'
    })
  } catch (error) {
    console.error('❌ Error approving blog comment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to approve blog comment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
