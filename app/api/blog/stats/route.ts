import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

// GET - 获取博客统计数据
export async function GET() {
  try {
    console.log('🔍 Blog stats API called at:', new Date().toISOString())
    
    const stats = await BlogService.getStats()
    
    console.log('✅ Blog stats fetched:', stats)
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('❌ Error fetching blog stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog stats',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
