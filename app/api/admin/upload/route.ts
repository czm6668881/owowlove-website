import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    // 支持两种字段名：'file' 和 'image'
    const file = formData.get('file') as File || formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded. Please select an image file.' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 创建产品图片目录
    const uploadDir = join(process.cwd(), 'public', 'product-images')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `product-${timestamp}.${extension}`
    const filepath = join(uploadDir, filename)

    // 保存文件
    await writeFile(filepath, buffer)

    // 返回统一的API路径
    const fileUrl = `/api/image/${filename}`

    console.log(`✅ Image uploaded successfully: ${filename} (${file.size} bytes)`)
    console.log(`📁 Saved to: ${filepath}`)
    console.log(`🔗 URL: ${fileUrl}`)

    return NextResponse.json({
      success: true,
      url: fileUrl, // 为了兼容性，同时提供 url 和 data.url
      filename: filename,
      data: {
        url: fileUrl,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      }
    })
  } catch (error) {
    console.error('❌ Error uploading file:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload file. Please try again.' },
      { status: 500 }
    )
  }
}
