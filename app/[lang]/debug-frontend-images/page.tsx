'use client'

import { useEffect, useState } from 'react'

interface FrontendProduct {
  id: string
  name: string
  description: string
  price: number
  images: string[] | Array<{
    id: string
    url: string
    alt: string
    isPrimary: boolean
    order: number
  }>
  category_id: string
  variants: Array<{
    id: string
    size: string
    color: string
    price: number
    stock: number
  }>
  is_active: boolean
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
    description: string
    image: string
  }
}

export default function DebugFrontendImagesPage() {
  const [products, setProducts] = useState<FrontendProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Fetching products from /api/products...')
        const response = await fetch('/api/products')
        const data = await response.json()
        console.log('📄 API Response:', data)
        
        if (data.success) {
          setProducts(data.data)
          console.log('✅ Products loaded:', data.data.length)
        } else {
          console.error('❌ API Error:', data.error)
        }
      } catch (error) {
        console.error('❌ Fetch Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // 获取产品的主图片
  const getProductImage = (product: FrontendProduct): string => {
    console.log(`🖼️ Getting image for product: ${product.name}`)
    console.log(`📊 Images data:`, product.images)
    
    if (!product.images || product.images.length === 0) {
      console.log('❌ No images found, using placeholder')
      return '/placeholder.svg'
    }

    // 检查是否为字符串数组格式（Supabase格式）
    if (typeof product.images[0] === 'string') {
      const imageUrl = product.images[0] as string
      console.log(`✅ Using string format image: ${imageUrl}`)
      return imageUrl
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
      console.log(`✅ Using primary image: ${primaryImage.url}`)
      return primaryImage.url
    }

    // 如果没有主图片，返回第一张图片
    const firstImage = imageObjects[0]?.url || '/placeholder.svg'
    console.log(`✅ Using first image: ${firstImage}`)
    return firstImage
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">前端图片显示调试</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">调试信息</h2>
        <p><strong>产品数量:</strong> {products.length}</p>
        <p><strong>页面:</strong> 前端主页图片显示测试</p>
      </div>

      <div className="space-y-8">
        {products.map((product) => {
          const productImage = getProductImage(product)
          
          return (
            <div key={product.id} className="border rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 产品信息 */}
                <div>
                  <h3 className="font-medium mb-2">产品信息</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>价格:</strong> ${product.price}</p>
                    <p><strong>图片数据类型:</strong> {typeof product.images[0]}</p>
                    <p><strong>图片数量:</strong> {product.images.length}</p>
                    <p><strong>选择的图片URL:</strong> {productImage}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">原始图片数据:</h4>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                      {JSON.stringify(product.images, null, 2)}
                    </pre>
                  </div>
                </div>
                
                {/* 图片显示测试 */}
                <div>
                  <h3 className="font-medium mb-2">图片显示测试</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">主页使用的图片:</p>
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-64 object-cover border rounded-lg"
                        onLoad={() => {
                          console.log(`✅ 图片加载成功: ${productImage}`)
                        }}
                        onError={(e) => {
                          console.error(`❌ 图片加载失败: ${productImage}`)
                          e.currentTarget.style.border = '2px solid red'
                          e.currentTarget.style.backgroundColor = '#ffebee'
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">URL: {productImage}</p>
                    </div>
                    
                    {/* 测试所有图片 */}
                    {Array.isArray(product.images) && product.images.length > 1 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">所有图片测试:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {product.images.map((img, index) => {
                            const imgUrl = typeof img === 'string' ? img : img.url
                            return (
                              <div key={index} className="text-center">
                                <img
                                  src={imgUrl}
                                  alt={`${product.name} - ${index + 1}`}
                                  className="w-full h-32 object-cover border rounded"
                                  onLoad={() => console.log(`✅ 图片 ${index + 1} 加载成功: ${imgUrl}`)}
                                  onError={() => console.error(`❌ 图片 ${index + 1} 加载失败: ${imgUrl}`)}
                                />
                                <p className="text-xs text-gray-500 mt-1">#{index + 1}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">没有找到产品数据</p>
        </div>
      )}
    </div>
  )
}
