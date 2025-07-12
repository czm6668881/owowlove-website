import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

type Props = {
  params: Promise<{ path: string[] }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params
    const filePath = resolvedParams.path.join('/')

    console.log(`🖼️ Uploads API request for: ${filePath}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`)

    // 清理文件路径
    const cleanPath = filePath
      .replace(/['"(){}[\]]/g, '')
      .replace(/\s+/g, '')
      .replace(/\0/g, '')
      .replace(/(\.(jpg|jpeg|png|gif|webp))[^a-zA-Z]*$/i, '$1')

    console.log(`🧹 Cleaned path: ${cleanPath}`)

    // 尝试多个可能的路径
    const possiblePaths = [
      join(process.cwd(), 'public', 'uploads', cleanPath),
      join(process.cwd(), 'public', cleanPath),
      join(process.cwd(), 'uploads', cleanPath),
      // 生产环境特殊路径
      join('/var/www/uploads', cleanPath),
      join('/tmp/uploads', cleanPath),
    ]

    let fullPath = ''
    for (const path of possiblePaths) {
      console.log(`🔍 Checking uploads path: ${path}`)
      if (existsSync(path)) {
        fullPath = path
        console.log(`✅ Found uploads file at: ${path}`)
        break
      }
    }

    if (!fullPath) {
      console.log(`❌ Uploads file not found: ${filePath} (cleaned: ${cleanPath})`)
      console.log(`📁 Checked paths:`, possiblePaths)
      return new NextResponse('File not found', { status: 404 })
    }

    // 读取文件
    const fileBuffer = await readFile(fullPath)
    
    // 获取文件扩展名来设置正确的Content-Type
    const extension = filePath.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'webp':
        contentType = 'image/webp'
        break
      case 'svg':
        contentType = 'image/svg+xml'
        break
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving uploaded file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
