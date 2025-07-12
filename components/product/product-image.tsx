'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  onError?: () => void
  onLoad?: () => void
}

export function ProductImage({ 
  src, 
  alt, 
  className = '', 
  width = 400, 
  height = 400, 
  priority = false,
  onError,
  onLoad 
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 标准化图片URL
  const normalizeImageUrl = (url: string): string => {
    if (!url) return '/placeholder.svg'

    // 处理损坏的JSON数据
    if (url.includes('"url":')) {
      try {
        const urlMatch = url.match(/"url":"([^"]+)"/);
        if (urlMatch) {
          url = urlMatch[1]
          console.log(`🔧 Extracted URL from corrupted data: ${url}`)
        }
      } catch (e) {
        console.error('Failed to extract URL from corrupted data:', e)
        return '/placeholder.svg'
      }
    }

    // 如果已经是完整的URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }

    // 如果是API路径，直接返回
    if (url.startsWith('/api/image/')) {
      return url
    }

    // 如果是相对路径，转换为API路径
    if (url.startsWith('/uploads/') || url.startsWith('/product-images/')) {
      const filename = url.split('/').pop()
      return `/api/image/${filename}`
    }

    // 如果只是文件名，添加API前缀
    if (!url.startsWith('/')) {
      return `/api/image/${url}`
    }

    return url
  }

  const handleError = () => {
    console.error(`❌ Failed to load image: ${src}`)
    setImageError(true)
    setIsLoading(false)
    onError?.()
  }

  const handleLoad = () => {
    console.log(`✅ Image loaded successfully: ${src}`)
    setIsLoading(false)
    onLoad?.()
  }

  const normalizedSrc = normalizeImageUrl(src)

  // 如果图片加载失败，显示占位符
  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <svg 
            className="w-12 h-12 mx-auto mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-sm">图片加载失败</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-500">加载中...</div>
        </div>
      )}
      
      <img
        src={normalizedSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  )
}

// 专门用于产品列表的图片组件
export function ProductListImage({ 
  product, 
  className = "w-full h-64 md:h-80 object-cover" 
}: { 
  product: any
  className?: string 
}) {
  // 获取产品的主图片
  const getProductImage = (): string => {
    if (!product.images || product.images.length === 0) {
      return '/placeholder.svg'
    }

    // 检查是否为字符串数组格式（Supabase格式）
    if (typeof product.images[0] === 'string') {
      return product.images[0]
    }

    // 检查是否为对象数组格式（文件系统格式）
    const imageObjects = product.images as Array<{
      id: string
      url: string
      alt: string
      isPrimary: boolean
      order: number
    }>

    // 优先返回主图片
    const primaryImage = imageObjects.find(img => img.isPrimary)
    if (primaryImage) {
      return primaryImage.url
    }

    // 如果没有主图片，返回第一张图片
    return imageObjects[0]?.url || '/placeholder.svg'
  }

  const imageUrl = getProductImage()
  const productName = product.name || product.nameEn || 'Product'

  return (
    <ProductImage
      src={imageUrl}
      alt={productName}
      className={className}
      onError={() => {
        console.error(`❌ Product image failed to load for: ${productName}`)
        console.error(`   Image URL: ${imageUrl}`)
        console.error(`   Product ID: ${product.id}`)
      }}
    />
  )
}
