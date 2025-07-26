import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// GET - 获取文章评论
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Getting comments for post:', resolvedParams.slug)
    
    const comments = await BlogService.getCommentsByPostSlug(resolvedParams.slug)
    
    console.log('✅ Comments fetched:', comments.length)
    
    return NextResponse.json({
      success: true,
      data: comments
    })
  } catch (error) {
    console.error('❌ Error fetching comments:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch comments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - 创建新评论
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Creating comment for post:', resolvedParams.slug)
    
    const body = await request.json()
    
    // 验证必填字段
    const requiredFields = ['author_name', 'author_email', 'content']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`
          },
          { status: 400 }
        )
      }
    }

    // 首先检查文章是否存在
    const post = await BlogService.getPostBySlug(resolvedParams.slug)
    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found'
        },
        { status: 404 }
      )
    }

    const newComment = await BlogService.createComment({
      post_id: post.id,
      ...body
    })
    
    console.log('✅ Comment created:', newComment.id)
    
    return NextResponse.json({
      success: true,
      data: newComment
    })
  } catch (error) {
    console.error('❌ Error creating comment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create comment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
