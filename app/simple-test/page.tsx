'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  is_active: boolean
  images: any[]
}

export default function SimpleTestPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🚀 SimpleTest: Component mounted')
    fetchProducts()
  }, [])

  useEffect(() => {
    console.log('🔄 SimpleTest: Products state changed:', {
      length: products.length,
      loading: loading,
      error: error
    })
  }, [products, loading, error])

  const fetchProducts = async () => {
    try {
      console.log('🔍 SimpleTest: Fetching products...')
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/products')
      console.log('📊 SimpleTest: Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 SimpleTest: API Response:', data)
      
      if (data.success && data.data) {
        console.log(`✅ SimpleTest: Setting ${data.data.length} products`)
        setProducts(data.data)
      } else {
        throw new Error(data.error || 'No data received')
      }
    } catch (err) {
      console.error('❌ SimpleTest: Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setProducts([])
    } finally {
      console.log('🏁 SimpleTest: Setting loading to false')
      setLoading(false)
    }
  }

  const activeProducts = products.filter(p => p.is_active === true)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">简单产品测试页面</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">状态信息</h2>
        <div className="space-y-1 text-sm">
          <div><strong>Loading:</strong> {loading.toString()}</div>
          <div><strong>Error:</strong> {error || 'None'}</div>
          <div><strong>Total Products:</strong> {products.length}</div>
          <div><strong>Active Products:</strong> {activeProducts.length}</div>
        </div>
      </div>

      <div className="mb-4">
        <button 
          onClick={fetchProducts}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          重新获取产品
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-500">加载中...</div>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <div className="text-red-500">错误: {error}</div>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">没有产品</div>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">所有产品 ({products.length})</h2>
          {products.map((product, index) => (
            <div key={product.id} className="border p-4 rounded">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-600">ID: {product.id}</p>
                  <p className="text-sm">
                    状态: {product.is_active ? 
                      <span className="text-green-600">✅ 激活</span> : 
                      <span className="text-red-600">❌ 未激活</span>
                    }
                  </p>
                  <p className="text-sm">图片: {product.images?.length || 0} 张</p>
                </div>
                {product.images && product.images.length > 0 && (
                  <div>
                    <img 
                      src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                      alt={product.name}
                      className="w-20 h-20 object-cover border rounded"
                      onLoad={() => console.log(`✅ 图片加载成功: ${product.name}`)}
                      onError={() => console.error(`❌ 图片加载失败: ${product.name}`)}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {activeProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-green-600">激活的产品 ({activeProducts.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {activeProducts.map((product) => (
                  <div key={product.id} className="border p-4 rounded bg-green-50">
                    <h3 className="font-medium">{product.name}</h3>
                    {product.images && product.images.length > 0 && (
                      <img 
                        src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                        alt={product.name}
                        className="w-full h-32 object-cover border rounded mt-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
