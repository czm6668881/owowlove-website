import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// GET - 获取博客分类列表
export async function GET() {
  try {
    console.log('🔍 Blog categories API called at:', new Date().toISOString())
    
    const categories = await BlogService.getCategories()
    
    console.log('✅ Blog categories fetched:', categories.length)
    
    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('❌ Error fetching blog categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog categories',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - 创建新分类
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creating new blog category at:', new Date().toISOString())

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

    const newCategory = await BlogService.createCategory(body)

    console.log('✅ Blog category created:', newCategory.id)

    return NextResponse.json({
      success: true,
      data: newCategory
    })
  } catch (error) {
    console.error('❌ Error creating blog category:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create blog category',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
