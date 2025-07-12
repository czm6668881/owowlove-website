'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  images: string[]
  price: number
}

export default function DebugProductionPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageTests, setImageTests] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log('🔍 Fetching products from API...')
      const response = await fetch('/api/products')
      const data = await response.json()
      
      console.log('📦 Products API response:', data)
      
      if (data.success) {
        setProducts(data.data)
        console.log(`✅ Loaded ${data.data.length} products`)
        
        // 测试每个图片URL
        for (const product of data.data) {
          if (product.images && product.images.length > 0) {
            testImageUrl(product.images[0])
          }
        }
      } else {
        setError('Failed to load products')
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err)
      setError('Error fetching products: ' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const testImageUrl = async (imageUrl: string) => {
    try {
      console.log(`🖼️  Testing image URL: ${imageUrl}`)
      const response = await fetch(imageUrl)
      const status = response.status
      const contentType = response.headers.get('content-type')
      
      console.log(`📸 Image test result: ${status} - ${contentType}`)
      
      setImageTests(prev => ({
        ...prev,
        [imageUrl]: `${status} - ${contentType}`
      }))
    } catch (err) {
      console.error(`❌ Image test failed for ${imageUrl}:`, err)
      setImageTests(prev => ({
        ...prev,
        [imageUrl]: `ERROR: ${(err as Error).message}`
      }))
    }
  }

  const handleImageError = (imageUrl: string, error: any) => {
    console.error(`❌ Image failed to load: ${imageUrl}`, error)
    setImageTests(prev => ({
      ...prev,
      [imageUrl + '_display']: 'DISPLAY_ERROR'
    }))
  }

  const handleImageLoad = (imageUrl: string) => {
    console.log(`✅ Image loaded successfully: ${imageUrl}`)
    setImageTests(prev => ({
      ...prev,
      [imageUrl + '_display']: 'DISPLAY_SUCCESS'
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🔍 Production Debug - Loading...</h1>
          <div className="animate-pulse">Loading products...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🔍 Production Debug - Error</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Production Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 System Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Environment:</strong> {process.env.NODE_ENV || 'unknown'}
            </div>
            <div>
              <strong>Products loaded:</strong> {products.length}
            </div>
            <div>
              <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'SSR'}
            </div>
            <div>
              <strong>User Agent:</strong> {typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'SSR'}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🖼️  Image Test Results</h2>
          <div className="space-y-2">
            {Object.entries(imageTests).map(([url, result]) => (
              <div key={url} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-mono truncate flex-1">{url}</span>
                <span className={`text-sm px-2 py-1 rounded ${
                  result.includes('200') || result.includes('SUCCESS') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {result}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="aspect-square relative bg-gray-200">
                {product.images && product.images.length > 0 ? (
                  <>
                    {/* Next.js Image 组件测试 */}
                    <div className="absolute inset-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        onError={(e) => handleImageError(product.images[0], e)}
                        onLoad={() => handleImageLoad(product.images[0])}
                        unoptimized={true}
                      />
                    </div>
                    
                    {/* 原生 img 标签测试 */}
                    <div className="absolute top-2 right-2 w-16 h-16 border-2 border-white rounded">
                      <img
                        src={product.images[0]}
                        alt={`${product.name} (native)`}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => handleImageError(product.images[0] + '_native', e)}
                        onLoad={() => handleImageLoad(product.images[0] + '_native')}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">${product.price}</p>
                <div className="text-xs text-gray-500">
                  <div><strong>ID:</strong> {product.id}</div>
                  <div><strong>Image URL:</strong> {product.images?.[0] || 'None'}</div>
                  <div><strong>API Test:</strong> {imageTests[product.images?.[0]] || 'Pending...'}</div>
                  <div><strong>Display Test:</strong> {imageTests[product.images?.[0] + '_display'] || 'Pending...'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🔧 Debug Actions</h2>
          <div className="space-x-4">
            <button
              onClick={fetchProducts}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Products
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Hard Refresh
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.open('/api/products', '_blank')
                }
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test API Directly
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
