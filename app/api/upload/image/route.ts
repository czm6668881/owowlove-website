import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Image upload API called at:', new Date().toISOString())
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${timestamp}-${randomString}.${extension}`

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'blog')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = join(uploadDir, filename)
    
    await writeFile(filepath, buffer)
    
    // Return the public URL
    const publicUrl = `/uploads/blog/${filename}`
    
    console.log('✅ Image uploaded successfully:', publicUrl)
    
    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: filename,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('❌ Error uploading image:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET - List uploaded images (for image gallery)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // This is a simplified implementation
    // In a real app, you'd want to store image metadata in a database
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'blog')
    
    if (!existsSync(uploadDir)) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      })
    }

    // For demo purposes, return some sample images
    const sampleImages = [
      {
        id: '1',
        url: '/uploads/blog/sample-1.jpg',
        filename: 'sample-1.jpg',
        size: 1024000,
        type: 'image/jpeg',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        url: '/uploads/blog/sample-2.jpg',
        filename: 'sample-2.jpg',
        size: 2048000,
        type: 'image/jpeg',
        created_at: new Date().toISOString()
      }
    ]

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedImages = sampleImages.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginatedImages,
      pagination: {
        page,
        limit,
        total: sampleImages.length,
        totalPages: Math.ceil(sampleImages.length / limit)
      }
    })
  } catch (error) {
    console.error('❌ Error fetching images:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
