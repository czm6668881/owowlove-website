import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// GET - 获取博客标签列表
export async function GET() {
  try {
    console.log('🔍 Blog tags API called at:', new Date().toISOString())
    
    const tags = await BlogService.getTags()
    
    console.log('✅ Blog tags fetched:', tags.length)
    
    return NextResponse.json({
      success: true,
      data: tags
    })
  } catch (error) {
    console.error('❌ Error fetching blog tags:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog tags',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - 创建新标签
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creating new blog tag at:', new Date().toISOString())

    const body = await request.json()

    // 验证必填字段
    if (!body.name) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: name'
        },
        { status: 400 }
      )
    }

    const newTag = await BlogService.createTag(body)

    console.log('✅ Blog tag created:', newTag.id)

    return NextResponse.json({
      success: true,
      data: newTag
    })
  } catch (error) {
    console.error('❌ Error creating blog tag:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create blog tag',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
