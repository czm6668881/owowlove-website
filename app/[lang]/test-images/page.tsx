'use client'

import { useState, useEffect } from 'react'

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

export default function TestImagesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔄 Fetching products...')
        const response = await fetch('/api/products')
        const data = await response.json()
        
        console.log('📄 API Response:', data)
        
        if (data.success) {
          setProducts(data.data)
          console.log('✅ Products loaded:', data.data.length)
        } else {
          setError(data.error || 'Failed to fetch products')
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
        <h1 className="text-2xl font-bold mb-8">图片显示测试</h1>
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">图片显示测试</h1>
        <div className="text-red-600">错误: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">图片显示测试</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          找到 {products.length} 个产品。测试图片是否正确显示。
        </p>
      </div>

      <div className="space-y-8">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 产品信息 */}
              <div>
                <h3 className="font-medium mb-2">产品信息</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>ID:</strong> {product.id}</p>
                  <p><strong>价格:</strong> ${product.price}</p>
                  <p><strong>状态:</strong> {product.is_active ? '激活' : '未激活'}</p>
                  <p><strong>创建时间:</strong> {new Date(product.created_at).toLocaleString()}</p>
                </div>
                
                <h4 className="font-medium mt-4 mb-2">图片数据</h4>
                <div className="bg-gray-100 p-3 rounded text-xs">
                  <pre>{JSON.stringify(product.images, null, 2)}</pre>
                </div>
              </div>

              {/* 图片显示 */}
              <div>
                <h3 className="font-medium mb-2">图片显示</h3>
                {product.images && product.images.length > 0 ? (
                  <div className="space-y-4">
                    {product.images.map((imageUrl, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <p className="text-sm text-gray-600 mb-2">
                          图片 {index + 1}: {imageUrl}
                        </p>
                        <img
                          src={imageUrl}
                          alt={`${product.name} - 图片 ${index + 1}`}
                          className="w-full h-64 object-cover border rounded-lg"
                          onLoad={() => {
                            console.log(`✅ 图片加载成功: ${imageUrl}`)
                          }}
                          onError={(e) => {
                            console.error(`❌ 图片加载失败: ${imageUrl}`)
                            e.currentTarget.style.border = '2px solid red'
                            e.currentTarget.style.backgroundColor = '#ffebee'
                          }}
                        />
                        
                        {/* 测试直接访问 */}
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
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">没有图片</div>
                )}
              </div>
            </div>
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
