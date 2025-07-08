import { NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/categories'

export async function GET() {
  try {
    const categories = await CategoryService.getCategories()
    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
