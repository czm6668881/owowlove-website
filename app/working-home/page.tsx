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

export default function WorkingHomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    
    const fetchProducts = async () => {
      try {
        console.log('🔍 WorkingHome: Fetching products...')
        
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📊 WorkingHome: API Response:', data)
        
        if (data.success && data.data && isMounted) {
          console.log(`✅ WorkingHome: Setting ${data.data.length} products`)
          setProducts(data.data)
          setError(null)
        } else if (isMounted) {
          throw new Error(data.error || 'No data received')
        }
      } catch (err) {
        console.error('❌ WorkingHome: Error:', err)
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error')
          setProducts([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()
    
    return () => {
      isMounted = false
    }
  }, [])

  const getProductImage = (product: Product): string => {
    if (!product.images || product.images.length === 0) {
      return '/placeholder.svg'
    }
    
    let imageUrl = product.images[0]
    
    // 清理URL
    imageUrl = imageUrl.trim()
    
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

  console.log('🔄 WorkingHome: Render state:', {
    loading,
    error,
    totalProducts: products.length,
    activeProducts: activeProducts.length
  })

  return (
    <div className="min-h-screen bg-white">
      {/* 简化的Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-pink-600">OWOWLOVE.COM</h1>
            <div className="text-sm text-gray-600">Premium Cosplay Costumes</div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-rose-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Cosplay Costumes</h1>
          <p className="text-lg text-gray-600 mb-8">Discover our exclusive collection</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Products</h2>
          
          {/* 状态信息 */}
          <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
            <div><strong>Loading:</strong> {loading.toString()}</div>
            <div><strong>Error:</strong> {error || 'None'}</div>
            <div><strong>Total Products:</strong> {products.length}</div>
            <div><strong>Active Products:</strong> {activeProducts.length}</div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Loading products...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 text-lg">Error: {error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700"
            >
              Retry
            </button>
          </div>
        ) : activeProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No active products found</div>
            <p className="text-sm text-gray-400 mt-2">
              Total products: {products.length}, Active: {activeProducts.length}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeProducts.map((product) => {
              const productImage = getProductImage(product)
              const price = product.price || (product.variants?.[0]?.price) || 29.99
              
              return (
                <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                      onLoad={() => {
                        console.log(`✅ Image loaded: ${product.name}`)
                      }}
                      onError={(e) => {
                        console.error(`❌ Image failed: ${product.name}, URL: ${productImage}`)
                        
                        // 尝试备用URL
                        const currentSrc = e.currentTarget.src
                        const filename = productImage.split('/').pop()
                        
                        if (currentSrc.includes('/api/image/') && filename) {
                          console.log(`🔄 Trying fallback: /uploads/${filename}`)
                          e.currentTarget.src = `/uploads/${filename}`
                        } else {
                          console.log(`🔄 Using placeholder`)
                          e.currentTarget.src = '/placeholder.svg'
                        }
                      }}
                    />
                    
                    {/* 简化的收藏按钮 */}
                    <div className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 cursor-pointer">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-3 w-3 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">(12)</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 text-lg">
                        ${price.toFixed(2)}
                      </span>
                      
                      <button 
                        className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded text-sm transition-colors"
                        onClick={() => {
                          console.log('Add to cart:', product.name)
                          alert(`Added ${product.name} to cart!`)
                        }}
                      >
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

      {/* 简化的Footer */}
      <footer className="bg-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2024 OWOWLOVE.COM - Premium Cosplay Costumes</p>
          <p className="text-sm text-gray-500 mt-2">Worldwide Shipping • Premium Quality • Exclusive Designs</p>
        </div>
      </footer>
    </div>
  )
}
