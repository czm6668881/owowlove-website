import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'
import { BlogSearchParams } from '@/lib/types/blog'

// GET - 获取博客文章列表
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Blog posts API called at:', new Date().toISOString())
    
    const { searchParams } = new URL(request.url)
    
    const params: BlogSearchParams = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      category: searchParams.get('category') || undefined,
      tag: searchParams.get('tag') || undefined,
      status: (searchParams.get('status') as 'draft' | 'published' | 'archived') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : searchParams.get('featured') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
      sort: (searchParams.get('sort') as 'newest' | 'oldest' | 'popular' | 'title') || 'newest'
    }

    console.log('📝 Blog search params:', params)

    const posts = await BlogService.getPosts(params)
    
    console.log('✅ Blog posts fetched:', posts.length)
    
    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        page: params.page || 1,
        limit: params.limit || 10,
        total: posts.length // 注意：这里应该是总数，但为了简化示例，使用当前页数量
      }
    })
  } catch (error) {
    console.error('❌ Error fetching blog posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - 创建新的博客文章
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creating new blog post at:', new Date().toISOString())
    
    const body = await request.json()
    
    // 验证必填字段
    const requiredFields = ['title', 'excerpt', 'content', 'category_id', 'author']
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

    const newPost = await BlogService.createPost(body)
    
    console.log('✅ Blog post created:', newPost.id)
    
    return NextResponse.json({
      success: true,
      data: newPost
    })
  } catch (error) {
    console.error('❌ Error creating blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create blog post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
