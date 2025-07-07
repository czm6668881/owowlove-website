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
    const fullPath = join(process.cwd(), 'public', 'uploads', filePath)
    
    // 检查文件是否存在
    if (!existsSync(fullPath)) {
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
