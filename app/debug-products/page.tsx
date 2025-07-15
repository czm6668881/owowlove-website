'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  description?: string
  price?: number
  images: any[]
  variants?: any[]
  is_active: boolean
}

export default function DebugProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log('🔍 Fetching products...')
        const response = await fetch('/api/products')
        const data = await response.json()
        
        console.log('📊 API Response:', data)
        
        if (data.success) {
          setProducts(data.data || [])
        } else {
          setError(data.error || 'Failed to fetch products')
        }
      } catch (err) {
        console.error('❌ Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getProductImage = (product: Product): string => {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">产品调试页面</h1>
        <div className="text-center">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">产品调试页面</h1>
        <div className="text-red-600">错误: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">产品调试页面</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">产品统计</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-sm text-gray-600">总产品数</div>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <div className="text-2xl font-bold">{products.filter(p => p.is_active).length}</div>
            <div className="text-sm text-gray-600">激活产品</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded">
            <div className="text-2xl font-bold">{products.filter(p => p.images && p.images.length > 0).length}</div>
            <div className="text-sm text-gray-600">有图片的产品</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {products.map((product, index) => {
          const productImage = getProductImage(product)
          
          return (
            <div key={product.id} className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">
                产品 {index + 1}: {product.name}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">基本信息</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>ID:</strong> {product.id}</div>
                    <div><strong>名称:</strong> {product.name}</div>
                    <div><strong>描述:</strong> {product.description || '无'}</div>
                    <div><strong>价格:</strong> ${product.price || '未设置'}</div>
                    <div><strong>激活状态:</strong> {product.is_active ? '是' : '否'}</div>
                    <div><strong>Variants数量:</strong> {product.variants?.length || 0}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">图片信息</h4>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>图片数量:</strong> {product.images?.length || 0}
                    </div>
                    <div className="text-sm">
                      <strong>处理后的图片URL:</strong> {productImage}
                    </div>
                    
                    {product.images && product.images.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">原始图片数据:</div>
                        <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(product.images, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <div className="text-sm font-medium mb-2">图片预览:</div>
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-32 h-32 object-cover border rounded"
                        onLoad={() => console.log(`✅ 图片加载成功: ${productImage}`)}
                        onError={(e) => {
                          console.error(`❌ 图片加载失败: ${productImage}`)
                          e.currentTarget.style.border = '2px solid red'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">没有找到产品</div>
        </div>
      )}
    </div>
  )
}
