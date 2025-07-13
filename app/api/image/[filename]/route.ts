import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

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

    // 生产环境优化：优先检查最可能的路径
    const isProduction = process.env.NODE_ENV === 'production'
    const isVercel = process.env.VERCEL === '1'

    console.log(`🌍 Environment: ${process.env.NODE_ENV}, Vercel: ${isVercel}`)

    let possiblePaths = []

    if (isVercel) {
      // Vercel环境特殊路径
      possiblePaths = [
        join(process.cwd(), 'public', 'uploads', cleanFilename),
        join('/tmp', 'uploads', cleanFilename),
        join(process.cwd(), '.next', 'static', 'uploads', cleanFilename),
        join(process.cwd(), 'public', 'product-images', cleanFilename),
        join(process.cwd(), 'public', cleanFilename),
      ]
    } else if (isProduction) {
      // 其他生产环境路径
      possiblePaths = [
        join(process.cwd(), 'public', 'uploads', cleanFilename),
        join(process.cwd(), 'public', 'product-images', cleanFilename),
        join('/var/www/uploads', cleanFilename),
        join(process.cwd(), 'uploads', cleanFilename),
        join(process.cwd(), 'public', 'uploads', 'products', cleanFilename),
        join(process.cwd(), 'public', cleanFilename),
      ]
    } else {
      // 开发环境路径
      possiblePaths = [
        join(process.cwd(), 'public', 'uploads', cleanFilename),
        join(process.cwd(), 'public', 'product-images', cleanFilename),
        join(process.cwd(), 'public', 'uploads', 'products', cleanFilename),
        join(process.cwd(), 'public', cleanFilename),
      ]
    }

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

      // 生产环境：尝试从映射文件获取图片，如果失败则返回占位符
      if (isProduction) {
        console.log(`🔄 Trying to load image from mapping file...`)
        const mappingImage = await loadImageFromMapping(cleanFilename)
        if (mappingImage) {
          console.log(`✅ Found image in mapping file: ${cleanFilename}`)
          return mappingImage
        }

        console.log(`🔄 Trying to load image from database...`)
        const dbImage = await loadImageFromDatabase(cleanFilename)
        if (dbImage) {
          console.log(`✅ Found image in database: ${cleanFilename}`)
          return dbImage
        }

        console.log(`🔄 Returning placeholder image for production`)
        return generatePlaceholderImage(cleanFilename)
      }

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

// 生成占位符图片的函数
function generatePlaceholderImage(filename: string): NextResponse {
  // 创建一个简单的SVG占位符
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="400" fill="#f3f4f6"/>
      <rect x="50" y="50" width="300" height="300" rx="12" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>
      <circle cx="150" cy="150" r="30" fill="#d1d5db"/>
      <path d="M120 200 L180 200 L150 240 Z" fill="#d1d5db"/>
      <text x="200" y="220" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle">
        Image Not Found
      </text>
      <text x="200" y="240" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af" text-anchor="middle">
        ${filename}
      </text>
      <text x="200" y="260" font-family="Arial, sans-serif" font-size="10" fill="#d1d5db" text-anchor="middle">
        OWOWLOVE.COM
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300', // 短缓存时间
      'Access-Control-Allow-Origin': '*',
    },
  })
}

// 从映射文件加载图片的函数
async function loadImageFromMapping(filename: string): Promise<NextResponse | null> {
  try {
    console.log(`🔍 Searching for image in mapping file: ${filename}`)

    const mappingPath = join(process.cwd(), 'public', 'image-mapping.json')

    if (!existsSync(mappingPath)) {
      console.log(`⚠️  Image mapping file not found`)
      return null
    }

    const mappingData = await readFile(mappingPath, 'utf-8')
    const mappingFile = JSON.parse(mappingData)

    // 检查新的映射文件格式
    const imageMapping = mappingFile.images || mappingFile

    if (!imageMapping[filename]) {
      console.log(`❌ Image not found in mapping: ${filename}`)
      return null
    }

    console.log(`✅ Found image in mapping: ${filename}`)

    const imageData = imageMapping[filename]
    const base64Data = imageData.data.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': imageData.mimeType || imageData.mime_type || 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('❌ Error loading image from mapping:', error)
    return null
  }
}

// 从数据库加载图片的函数
async function loadImageFromDatabase(filename: string): Promise<NextResponse | null> {
  try {
    console.log(`🔍 Searching for image in database: ${filename}`)

    // 初始化Supabase客户端
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log(`⚠️  Supabase configuration missing`)
      return null
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase
      .from('image_storage')
      .select('data, mime_type')
      .eq('filename', filename)
      .single()

    if (error || !data) {
      console.log(`❌ Image not found in database: ${filename}`)
      return null
    }

    console.log(`✅ Found image in database: ${filename}`)

    // 解析data URL
    const base64Data = data.data.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': data.mime_type,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('❌ Error loading image from database:', error)
    return null
  }
}
