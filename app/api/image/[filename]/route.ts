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

    console.log(`🖼️ Image request for: ${filename}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
    console.log(`📂 Working directory: ${process.cwd()}`)

    // 清理文件名，移除可能的异常字符
    const cleanFilename = filename
      .replace(/['"(){}[\]]/g, '')
      .replace(/\s+/g, '')
      .replace(/\0/g, '')
      .replace(/(\.(jpg|jpeg|png|gif|webp))[^a-zA-Z]*$/i, '$1')

    console.log(`🧹 Cleaned filename: ${cleanFilename}`)

    // 尝试多个可能的路径，按优先级排序
    const possiblePaths = [
      join(process.cwd(), 'public', 'uploads', cleanFilename),
      join(process.cwd(), 'public', 'product-images', cleanFilename),
      join(process.cwd(), 'public', 'uploads', 'products', cleanFilename),
      join(process.cwd(), 'public', cleanFilename),
      // 生产环境可能的额外路径
      join(process.cwd(), 'uploads', cleanFilename),
      join('/var/www/uploads', cleanFilename),
      // Vercel 特殊路径
      join('/tmp', 'uploads', cleanFilename),
      join(process.cwd(), '.next', 'static', 'uploads', cleanFilename),
    ]

    let filePath = ''
    for (const path of possiblePaths) {
      console.log(`🔍 Checking path: ${path}`)
      if (existsSync(path)) {
        filePath = path
        console.log(`✅ Found image at: ${path}`)
        break
      }
    }

    if (!filePath) {
      console.log(`❌ Image not found: ${filename} (cleaned: ${cleanFilename})`)
      console.log(`📁 Checked paths:`, possiblePaths)

      // 在生产环境提供更详细的错误信息
      const errorDetails = {
        originalFilename: filename,
        cleanedFilename: cleanFilename,
        environment: process.env.NODE_ENV,
        workingDirectory: process.cwd(),
        checkedPaths: possiblePaths
      }

      console.log(`🔍 Error details:`, JSON.stringify(errorDetails, null, 2))
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
