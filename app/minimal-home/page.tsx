'use client'

import { useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  is_active: boolean
  variants: any[]
}

export default function MinimalHomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🚀 MinimalHome: Component mounted')
    fetchProducts()
  }, [])

  useEffect(() => {
    console.log('🔄 MinimalHome: Products state changed:', {
      length: products.length,
      loading: loading
    })
  }, [products, loading])

  const fetchProducts = async () => {
    try {
      console.log('🔍 MinimalHome: Fetching products...')
      const response = await fetch('/api/products')
      const data = await response.json()
      
      console.log('📊 MinimalHome: API Response:', data)
      
      if (data.success && data.data) {
        console.log(`✅ MinimalHome: Setting ${data.data.length} products`)
        setProducts(data.data)
      }
    } catch (error) {
      console.error('❌ MinimalHome: Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProductImage = (product: Product): string => {
    if (!product.images || product.images.length === 0) {
      return '/placeholder.svg'
    }
    
    const imageUrl = product.images[0]
    
    // 如果是完整URL，提取文件名
    if (imageUrl.startsWith('http')) {
      const filename = imageUrl.split('/').pop() || ''
      return `/api/image/${filename}`
    }
    
    // 如果已经是API路径，直接返回
    if (imageUrl.startsWith('/api/image/')) {
      return imageUrl
    }
    
    // 如果是相对路径，转换为API路径
    if (imageUrl.startsWith('/uploads/')) {
      const filename = imageUrl.split('/').pop() || ''
      return `/api/image/${filename}`
    }
    
    // 如果只是文件名，添加API前缀
    return `/api/image/${imageUrl}`
  }

  const activeProducts = products.filter(p => p.is_active === true)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">最简化主页测试</h1>
        
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">状态信息</h2>
          <div className="space-y-1 text-sm">
            <div><strong>Loading:</strong> {loading.toString()}</div>
            <div><strong>Total Products:</strong> {products.length}</div>
            <div><strong>Active Products:</strong> {activeProducts.length}</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading products...</div>
          </div>
        ) : activeProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">No active products found</div>
            <p className="text-sm text-gray-400 mt-2">
              Total products: {products.length}, Active: {activeProducts.length}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeProducts.map((product) => {
              const productImage = getProductImage(product)
              const price = product.price || (product.variants?.[0]?.price) || 29.99
              
              console.log(`🔍 Rendering product: ${product.name}`)
              console.log(`   Image URL: ${productImage}`)
              console.log(`   Price: $${price}`)
              
              return (
                <div key={product.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                      onLoad={() => {
                        console.log(`✅ Image loaded successfully: ${productImage}`)
                      }}
                      onError={(e) => {
                        console.error(`❌ Image failed to load: ${productImage}`)
                        console.error(`   Product: ${product.name}`)
                        
                        // 尝试备用URL
                        const currentSrc = e.currentTarget.src
                        const filename = productImage.split('/').pop()
                        
                        if (currentSrc.includes('/api/image/') && filename) {
                          console.log(`🔄 Trying fallback URL: /uploads/${filename}`)
                          e.currentTarget.src = `/uploads/${filename}`
                        } else {
                          console.log(`🔄 Using placeholder`)
                          e.currentTarget.src = '/placeholder.svg'
                        }
                      }}
                    />
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        ${price.toFixed(2)}
                      </span>
                      
                      <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded text-sm">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
