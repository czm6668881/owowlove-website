import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting image upload process...')
    console.log('🌍 Environment:', process.env.NODE_ENV)
    console.log('📍 Current working directory:', process.cwd())

    const formData = await request.formData()
    console.log('✅ FormData parsed successfully')

    // 支持两种字段名：'image' 和 'file'
    const file = formData.get('image') as File || formData.get('file') as File
    console.log('📁 File extraction result:', file ? `Found: ${file.name} (${file.size} bytes)` : 'No file found')

    if (!file) {
      console.log('❌ No file provided in request')
      return NextResponse.json({
        success: false,
        error: 'No file provided. Please select an image file.'
      }, {
        status: 400,
        headers: corsHeaders
      })
    }

    // 验证文件类型
    console.log('🔍 Validating file type:', file.type)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.'
      }, { status: 400 })
    }
    console.log('✅ File type validation passed')

    // 验证文件大小 (5MB限制)
    console.log('🔍 Validating file size:', file.size)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 })
    }
    console.log('✅ File size validation passed')

    // 创建产品图片目录 - 环境感知的目录选择
    console.log('📁 Creating upload directory...')

    // 生产环境使用 /tmp 目录，开发环境使用 public/uploads
    const isProduction = process.env.NODE_ENV === 'production'
    const uploadsDir = isProduction
      ? join('/tmp', 'uploads')
      : join(process.cwd(), 'public', 'uploads')

    console.log('📂 Upload directory path:', uploadsDir)
    console.log('🌍 Using production path:', isProduction)

    try {
      if (!existsSync(uploadsDir)) {
        console.log('📁 Directory does not exist, creating...')
        await mkdir(uploadsDir, { recursive: true })
        console.log('✅ Directory created successfully')
      } else {
        console.log('✅ Directory already exists')
      }
    } catch (dirError) {
      console.error('❌ Failed to create directory:', dirError)
      throw new Error(`Failed to create upload directory: ${dirError.message}`)
    }

    // 生成唯一文件名
    console.log('🏷️ Generating filename...')
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `product-${timestamp}.${fileExtension}`
    const filepath = join(uploadsDir, filename)
    console.log('📝 Generated filename:', filename)
    console.log('📍 Full file path:', filepath)

    // 转换文件为buffer并保存
    console.log('💾 Converting file to buffer...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    console.log('✅ Buffer created, size:', buffer.length)

    // 保存到文件系统
    console.log('💾 Writing file to disk...')
    try {
      await writeFile(filepath, buffer)
      console.log('✅ File written successfully to:', filepath)
    } catch (writeError) {
      console.error('❌ Failed to write file:', writeError)
      throw new Error(`Failed to save file: ${writeError.message}`)
    }

    // 同时保存到映射文件（生产环境备用）
    if (isProduction) {
      await saveImageToMapping(filename, buffer, file.type)
    }

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
    }, {
      headers: corsHeaders
    })

  } catch (error) {
    console.error('❌ Error uploading image:', error)
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })

    // 提供更详细的错误信息
    let errorMessage = 'Failed to upload image. Please try again.'
    if (error.code === 'ENOENT') {
      errorMessage = 'Upload directory not found. Please contact administrator.'
    } else if (error.code === 'EACCES') {
      errorMessage = 'Permission denied. Please contact administrator.'
    } else if (error.code === 'ENOSPC') {
      errorMessage = 'Not enough disk space. Please contact administrator.'
    } else if (error.message) {
      errorMessage = `Upload failed: ${error.message}`
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      debug: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        stack: error.stack
      } : undefined
    }, {
      status: 500,
      headers: corsHeaders
    })
  }
}

// 保存图片到映射文件的函数（生产环境备用）
async function saveImageToMapping(filename: string, buffer: Buffer, mimeType: string) {
  try {
    console.log('💾 Saving image to mapping file...')

    // 将buffer转换为base64字符串
    const base64Data = buffer.toString('base64')
    const dataUrl = `data:${mimeType};base64,${base64Data}`

    // 读取现有映射文件
    const mappingPath = join(process.cwd(), 'public', 'image-mapping.json')
    let mapping = {}

    try {
      if (existsSync(mappingPath)) {
        const mappingContent = await readFile(mappingPath, 'utf-8')
        mapping = JSON.parse(mappingContent)
      }
    } catch (readError) {
      console.log('⚠️  Could not read existing mapping file, creating new one')
    }

    // 添加新图片到映射
    mapping[filename] = {
      data: dataUrl,
      size: buffer.length,
      mimeType: mimeType
    }

    // 保存更新的映射文件
    await writeFile(mappingPath, JSON.stringify(mapping, null, 2))
    console.log(`✅ Image added to mapping file: ${filename}`)

  } catch (error) {
    console.error('❌ Failed to save image to mapping file:', error)
    // 不抛出错误，因为文件系统保存已经成功
  }
}

// 保存图片到数据库的函数
async function saveImageToDatabase(filename: string, buffer: Buffer, mimeType: string) {
  try {
    console.log('💾 Saving image to database...')

    // 将buffer转换为base64字符串
    const base64Data = buffer.toString('base64')
    const dataUrl = `data:${mimeType};base64,${base64Data}`

    // 这里可以保存到Supabase或其他数据库
    // 暂时只记录日志，实际实现需要根据数据库结构调整
    console.log(`📊 Image data prepared for database: ${filename}, size: ${buffer.length} bytes`)
    console.log(`🔗 Data URL length: ${dataUrl.length} characters`)

    // TODO: 实际保存到数据库的代码
    // const { error } = await supabase
    //   .from('image_storage')
    //   .insert({
    //     filename: filename,
    //     data: dataUrl,
    //     mime_type: mimeType,
    //     size: buffer.length,
    //     created_at: new Date().toISOString()
    //   })

    console.log('✅ Image metadata prepared for database storage')
  } catch (error) {
    console.error('❌ Failed to save image to database:', error)
    // 不抛出错误，因为文件系统保存已经成功
  }
}
