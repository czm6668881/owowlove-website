import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// GET - 获取所有评论（管理员用）
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Blog comments API called at:', new Date().toISOString())
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const comments = await BlogService.getAllComments()
    
    let filteredComments = comments
    
    // 状态筛选
    if (status && status !== 'all') {
      filteredComments = filteredComments.filter(comment => comment.status === status)
    }
    
    // 搜索筛选
    if (search) {
      const searchLower = search.toLowerCase()
      filteredComments = filteredComments.filter(comment => 
        comment.author_name.toLowerCase().includes(searchLower) ||
        comment.content.toLowerCase().includes(searchLower) ||
        comment.author_email.toLowerCase().includes(searchLower)
      )
    }
    
    console.log('✅ Blog comments fetched:', filteredComments.length)
    
    return NextResponse.json({
      success: true,
      data: filteredComments
    })
  } catch (error) {
    console.error('❌ Error fetching blog comments:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog comments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
