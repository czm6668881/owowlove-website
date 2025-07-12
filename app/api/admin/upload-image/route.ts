import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    // 支持两种字段名：'image' 和 'file'
    const file = formData.get('image') as File || formData.get('file') as File

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided. Please select an image file.'
      }, { status: 400 })
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'
      }, { status: 400 })
    }

    // 验证文件大小 (5MB限制)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 })
    }

    // 创建产品图片目录 - 统一使用 uploads 目录
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `product-${timestamp}.${fileExtension}`
    const filepath = join(uploadsDir, filename)

    // 转换文件为buffer并保存
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // 返回统一的API路径
    const imageUrl = `/api/image/${filename}`

    console.log(`✅ Image uploaded successfully: ${filename} (${file.size} bytes)`)
    console.log(`📁 Saved to: ${filepath}`)
    console.log(`🔗 URL: ${imageUrl}`)

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: filename,
      data: {
        url: imageUrl,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    })

  } catch (error) {
    console.error('❌ Error uploading image:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to upload image. Please try again.'
    }, { status: 500 })
  }
}
