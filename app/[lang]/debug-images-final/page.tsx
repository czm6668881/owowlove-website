'use client'

import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category_id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function DebugImagesFinal() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [apiResponse, setApiResponse] = useState<any>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log('🔍 Fetching products from API...')
      const response = await fetch('/api/products')
      const data = await response.json()
      
      console.log('📊 API Response:', data)
      setApiResponse(data)
      
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

  const testImageUrl = (url: string) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  const getProductImage = (product: Product): string => {
    if (!product.images || product.images.length === 0) {
      return '/placeholder.svg'
    }

    let imageUrl = product.images[0] as string

    // 清理URL
    imageUrl = imageUrl
      .trim()
      .replace(/['"(){}[\]]/g, '')
      .replace(/\s+/g, '')
      .replace(/\0/g, '')

    // 移除文件扩展名后的多余字符
    imageUrl = imageUrl.replace(/(\.(jpg|jpeg|png|gif|webp))[^a-zA-Z]*$/i, '$1')

    // 确保使用API格式
    if (!imageUrl.startsWith('http')) {
      let filename = ''
      
      if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/product-images/')) {
        filename = imageUrl.split('/').pop() || ''
      } else if (!imageUrl.startsWith('/')) {
        filename = imageUrl
      } else {
        filename = imageUrl.split('/').pop() || ''
      }

      if (filename) {
        imageUrl = `/api/image/${filename}`
      } else {
        return '/placeholder.svg'
      }
    }

    return imageUrl
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🔍 图片显示调试 - 最终版</h1>
          <div className="text-center py-12">
            <div className="text-lg">加载中...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 图片显示调试 - 最终版</h1>
        
        {/* API 响应信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 API 响应信息</h2>
          <div className="space-y-2">
            <p><strong>成功:</strong> {apiResponse?.success ? '✅ 是' : '❌ 否'}</p>
            <p><strong>产品数量:</strong> {apiResponse?.data?.length || 0}</p>
            <p><strong>时间戳:</strong> {apiResponse?.debug?.timestamp}</p>
            {apiResponse?.error && (
              <p className="text-red-600"><strong>错误:</strong> {apiResponse.error}</p>
            )}
          </div>
        </div>

        {/* 产品列表 */}
        <div className="space-y-8">
          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center text-gray-500">
                <p className="text-lg">❌ 没有找到产品</p>
                <p className="text-sm mt-2">请检查数据库连接和产品数据</p>
              </div>
            </div>
          ) : (
            products.map((product) => {
              const imageUrl = getProductImage(product)
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 产品信息 */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">{product.name}</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>ID:</strong> {product.id}</p>
                        <p><strong>价格:</strong> ${product.price}</p>
                        <p><strong>激活:</strong> {product.is_active ? '✅ 是' : '❌ 否'}</p>
                        <p><strong>原始图片数据:</strong></p>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                          {JSON.stringify(product.images, null, 2)}
                        </pre>
                        <p><strong>处理后的图片URL:</strong></p>
                        <code className="bg-gray-100 p-1 rounded text-xs">{imageUrl}</code>
                      </div>
                    </div>

                    {/* 图片显示测试 */}
                    <div>
                      <h4 className="font-medium mb-3">🖼️ 图片显示测试</h4>
                      <div className="space-y-4">
                        {/* 主要图片 */}
                        <div>
                          <p className="text-sm text-gray-600 mb-2">主要图片:</p>
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-64 object-cover border rounded-lg"
                            onLoad={() => {
                              console.log(`✅ 图片加载成功: ${imageUrl}`)
                            }}
                            onError={(e) => {
                              console.error(`❌ 图片加载失败: ${imageUrl}`)
                              e.currentTarget.style.border = '2px solid red'
                              e.currentTarget.style.backgroundColor = '#fee'
                            }}
                          />
                        </div>

                        {/* 直接URL测试 */}
                        <div>
                          <p className="text-sm text-gray-600 mb-2">直接URL测试:</p>
                          <div className="space-y-2">
                            <a 
                              href={imageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm"
                            >
                              🔗 在新窗口中打开图片
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* 刷新按钮 */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchProducts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            🔄 重新加载产品
          </button>
        </div>
      </div>
    </div>
  )
}
