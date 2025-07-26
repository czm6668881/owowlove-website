import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// GET - 根据slug获取单篇博客文章
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Getting blog post by slug:', resolvedParams.slug)
    
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

    console.log('✅ Blog post found:', post.title)
    
    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('❌ Error fetching blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - 更新博客文章
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Updating blog post:', resolvedParams.slug)
    
    const body = await request.json()
    
    // 首先通过slug找到文章ID
    const existingPost = await BlogService.getPostBySlug(resolvedParams.slug)
    if (!existingPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found'
        },
        { status: 404 }
      )
    }

    const updatedPost = await BlogService.updatePost({
      id: existingPost.id,
      ...body
    })
    
    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update blog post'
        },
        { status: 500 }
      )
    }

    console.log('✅ Blog post updated:', updatedPost.title)

    return NextResponse.json({
      success: true,
      data: updatedPost
    })
  } catch (error) {
    console.error('❌ Error updating blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update blog post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - 删除博客文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params
    console.log('🔍 Deleting blog post:', resolvedParams.slug)

    const success = await BlogService.deletePostBySlug(resolvedParams.slug)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found'
        },
        { status: 404 }
      )
    }

    console.log('✅ Blog post deleted:', resolvedParams.slug)

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully'
    })
  } catch (error) {
    console.error('❌ Error deleting blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete blog post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}