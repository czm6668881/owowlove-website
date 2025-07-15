'use client'

import { useState, useEffect } from 'react'

export default function TestProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔍 TestPage: Fetching products...')
        
        const response = await fetch('/api/products')
        console.log('📡 TestPage: Response status:', response.status)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('📊 TestPage: API Response:', data)
        
        if (data.success && data.data) {
          console.log(`✅ TestPage: Setting ${data.data.length} products`)
          setProducts(data.data)
        } else {
          throw new Error(data.error || 'No data received')
        }
      } catch (err) {
        console.error('❌ TestPage: Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Product Test Page</h1>
      <p className="mb-4">Found {products.length} products:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-gray-600">${product.price}</p>
            <p className="text-xs">Active: {product.is_active ? 'Yes' : 'No'}</p>
            <p className="text-xs">Images: {product.images?.length || 0}</p>
            
            {product.images && product.images.length > 0 && (
              <div className="mt-2">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded"
                  onLoad={() => console.log(`✅ Image loaded: ${product.images[0]}`)}
                  onError={() => console.error(`❌ Image failed: ${product.images[0]}`)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
