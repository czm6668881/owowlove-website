import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

type Props = {
  params: Promise<{ filename: string }>
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const resolvedParams = await params
    const filename = resolvedParams.filename
    
    // 尝试多个可能的路径
    const possiblePaths = [
      join(process.cwd(), 'public', 'product-images', filename),
      join(process.cwd(), 'public', 'uploads', 'products', filename),
      join(process.cwd(), 'public', filename)
    ]
    
    let filePath = ''
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        filePath = path
        break
      }
    }
    
    if (!filePath) {
      return new NextResponse('File not found', { status: 404 })
    }

    // 读取文件
    const fileBuffer = await readFile(filePath)
    
    // 获取文件扩展名来设置正确的Content-Type
    const extension = filename.split('.').pop()?.toLowerCase()
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
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
