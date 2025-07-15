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

export default function IsolatedTestPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  console.log('🔄 IsolatedTest: Component render, products.length =', products.length)

  useEffect(() => {
    console.log('🚀 IsolatedTest: useEffect triggered')
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      console.log('🔍 IsolatedTest: Starting fetch...')
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/products')
      console.log('📊 IsolatedTest: Response received, status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 IsolatedTest: Data parsed:', data)
      
      if (data.success && data.data) {
        console.log(`✅ IsolatedTest: About to set ${data.data.length} products`)
        setProducts(data.data)
        console.log(`✅ IsolatedTest: Products set successfully`)
      } else {
        throw new Error(data.error || 'No data received')
      }
    } catch (err) {
      console.error('❌ IsolatedTest: Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setProducts([])
    } finally {
      console.log('🏁 IsolatedTest: Setting loading to false')
      setLoading(false)
    }
  }

  const activeProducts = products.filter(p => p.is_active === true)

  console.log('📊 IsolatedTest: Render state:', {
    loading,
    error,
    totalProducts: products.length,
    activeProducts: activeProducts.length
  })

  return (
    <html lang="en">
      <head>
        <title>Isolated Test</title>
        <style>{`
          body { font-family: Arial, sans-serif; margin: 20px; }
          .container { max-width: 1200px; margin: 0 auto; }
          .status { background: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; margin: 20px 0; }
          .product-card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
          .product-image { width: 100%; height: 200px; object-fit: cover; }
          .product-info { padding: 15px; }
          .error { color: red; }
          .success { color: green; }
          button { background: #007cba; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }
          button:hover { background: #005a87; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>🔬 完全独立的测试页面</h1>
          <p>这个页面不使用任何Context或复杂的组件</p>
          
          <div className="status">
            <h2>状态信息</h2>
            <div><strong>Loading:</strong> {loading.toString()}</div>
            <div><strong>Error:</strong> {error || 'None'}</div>
            <div><strong>Total Products:</strong> {products.length}</div>
            <div><strong>Active Products:</strong> {activeProducts.length}</div>
          </div>

          <button onClick={fetchProducts}>重新获取产品</button>

          {loading && (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <div>加载中...</div>
            </div>
          )}

          {error && (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <div className="error">错误: {error}</div>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div style={{textAlign: 'center', padding: '40px'}}>
              <div>没有产品</div>
            </div>
          )}

          {!loading && !error && activeProducts.length > 0 && (
            <div>
              <h2>激活的产品 ({activeProducts.length})</h2>
              <div className="product-grid">
                {activeProducts.map((product) => {
                  const imageUrl = product.images && product.images.length > 0 
                    ? (product.images[0].startsWith('/api/image/') 
                        ? product.images[0] 
                        : `/api/image/${product.images[0].split('/').pop()}`)
                    : '/placeholder.svg'
                  
                  const price = product.price || (product.variants?.[0]?.price) || 29.99
                  
                  return (
                    <div key={product.id} className="product-card">
                      <img 
                        src={imageUrl}
                        alt={product.name}
                        className="product-image"
                        onLoad={() => console.log(`✅ 图片加载成功: ${product.name}`)}
                        onError={(e) => {
                          console.error(`❌ 图片加载失败: ${product.name}`)
                          e.currentTarget.src = '/placeholder.svg'
                        }}
                      />
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p>{product.description || '无描述'}</p>
                        <div><strong>${price.toFixed(2)}</strong></div>
                        <div style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>
                          ID: {product.id}<br/>
                          图片: {product.images?.length || 0} 张<br/>
                          变体: {product.variants?.length || 0} 个
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </body>
    </html>
  )
}
