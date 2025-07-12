'use client'

import { useState, useEffect } from 'react'

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

export default function DebugProductsPage() {
  const [products, setProducts] = useState<FrontendProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Fetching products from /api/products...')
        const response = await fetch('/api/products')
        const data = await response.json()
        
        console.log('📄 Full API Response:', data)
        
        if (data.success) {
          setProducts(data.data)
          console.log('✅ Products loaded:', data.data.length)
          console.log('📊 First product:', data.data[0])
        } else {
          setError(data.error || 'Failed to fetch products')
          console.error('❌ API Error:', data.error)
        }
      } catch (err) {
        console.error('❌ Fetch Error:', err)
        setError('Network error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">产品数据调试</h1>
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">产品数据调试</h1>
        <div className="text-red-600 bg-red-50 p-4 rounded">
          <h2 className="font-semibold mb-2">错误:</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">产品数据调试</h1>
      
      <div className="mb-6 bg-blue-50 p-4 rounded">
        <h2 className="font-semibold mb-2">API 响应摘要:</h2>
        <p>找到 {products.length} 个产品</p>
      </div>

      <div className="space-y-8">
        {products.map((product, index) => (
          <div key={product.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              产品 {index + 1}: {product.name}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 基本信息 */}
              <div>
                <h3 className="font-medium mb-3">基本信息</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>ID:</strong> {product.id}</p>
                  <p><strong>名称:</strong> {product.name}</p>
                  <p><strong>价格:</strong> ${product.price}</p>
                  <p><strong>状态:</strong> {product.is_active ? '激活' : '未激活'}</p>
                  <p><strong>分类ID:</strong> {product.category_id}</p>
                  <p><strong>创建时间:</strong> {new Date(product.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* 图片信息 */}
              <div>
                <h3 className="font-medium mb-3">图片信息</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">图片数据类型:</p>
                    <p className="text-sm text-gray-600">
                      {product.images ? 
                        (Array.isArray(product.images) ? 
                          `数组 (${product.images.length} 项)` : 
                          '非数组') : 
                        '无图片数据'}
                    </p>
                  </div>
                  
                  {product.images && product.images.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">第一张图片:</p>
                      <div className="bg-gray-100 p-3 rounded text-xs">
                        <p><strong>类型:</strong> {typeof product.images[0]}</p>
                        <p><strong>内容:</strong></p>
                        <pre className="mt-1 whitespace-pre-wrap break-all">
                          {JSON.stringify(product.images[0], null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium mb-2">完整图片数据:</p>
                    <div className="bg-gray-100 p-3 rounded text-xs max-h-40 overflow-y-auto">
                      <pre className="whitespace-pre-wrap break-all">
                        {JSON.stringify(product.images, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 图片测试 */}
            {product.images && product.images.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-3">图片显示测试</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.images.map((imageData, imgIndex) => {
                    const imageUrl = typeof imageData === 'string' ? imageData : imageData.url
                    return (
                      <div key={imgIndex} className="border rounded p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          图片 {imgIndex + 1}: {imageUrl}
                        </p>
                        <img
                          src={imageUrl}
                          alt={`${product.name} - 图片 ${imgIndex + 1}`}
                          className="w-full h-48 object-cover border rounded"
                          onLoad={() => {
                            console.log(`✅ 图片加载成功: ${imageUrl}`)
                          }}
                          onError={(e) => {
                            console.error(`❌ 图片加载失败: ${imageUrl}`)
                            e.currentTarget.style.border = '2px solid red'
                            e.currentTarget.style.backgroundColor = '#ffebee'
                          }}
                        />
                        <div className="mt-2">
                          <a 
                            href={imageUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            在新窗口中打开
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          没有找到产品数据
        </div>
      )}
    </div>
  )
}
