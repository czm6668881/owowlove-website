import { NextRequest, NextResponse } from 'next/server'
import { CategoryService } from '@/lib/services/categories'

// GET - Get all categories (including inactive ones for admin)
export async function GET() {
  try {
    const categories = await CategoryService.getAllCategories()
    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch categories'
    }, { status: 500 })
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({
        success: false,
        error: 'Name is required'
      }, { status: 400 })
    }

    const categoryData = {
      name: body.name,
      description: body.description || '',
      image: body.image || '/placeholder.jpg',
      is_active: body.is_active ?? true
    }

    const newCategory = await CategoryService.createCategory(categoryData)

    return NextResponse.json({
      success: true,
      data: newCategory
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create category'
    }, { status: 500 })
  }
}
