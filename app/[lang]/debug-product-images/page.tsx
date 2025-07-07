'use client'

import { useEffect, useState } from 'react'

interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
}

interface Product {
  id: string
  nameEn: string
  images: ProductImage[]
}

export default function DebugProductImagesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        if (data.success) {
          setProducts(data.data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getProductImage = (product: Product): string => {
    const primaryImage = product.images.find(img => img.isPrimary)
    return primaryImage?.url || product.images[0]?.url || '/placeholder.svg'
  }

  if (loading) {
    return <div className="container mx-auto p-8">Loading...</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">产品图片调试页面</h1>
      
      <div className="space-y-8">
        {products.map((product) => {
          const productImage = getProductImage(product)
          
          return (
            <div key={product.id} className="border rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4">{product.nameEn}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 产品信息 */}
                <div>
                  <h3 className="font-medium mb-2">产品信息</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>图片数量:</strong> {product.images.length}</p>
                    <p><strong>选择的图片URL:</strong> {productImage}</p>
                  </div>
                  
                  {product.images.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">所有图片:</h4>
                      <div className="space-y-1 text-xs">
                        {product.images.map((img, index) => (
                          <div key={img.id} className="p-2 bg-gray-50 rounded">
                            <p><strong>#{index + 1}:</strong> {img.url}</p>
                            <p><strong>Primary:</strong> {img.isPrimary ? 'Yes' : 'No'}</p>
                            <p><strong>Alt:</strong> {img.alt}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 图片显示测试 */}
                <div>
                  <h3 className="font-medium mb-2">图片显示测试</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">主页使用的图片:</p>
                      <img
                        src={productImage}
                        alt={product.nameEn}
                        className="w-full h-64 object-cover border rounded-lg"
                        onLoad={() => console.log(`✅ 图片加载成功: ${productImage}`)}
                        onError={(e) => {
                          console.error(`❌ 图片加载失败: ${productImage}`)
                          e.currentTarget.style.border = '2px solid red'
                        }}
                      />
                    </div>
                    
                    {/* 测试 placeholder */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Placeholder 测试:</p>
                      <img
                        src="/placeholder.svg"
                        alt="Placeholder"
                        className="w-32 h-32 object-cover border rounded-lg"
                        onLoad={() => console.log('✅ Placeholder 加载成功')}
                        onError={() => console.error('❌ Placeholder 加载失败')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium mb-2">调试说明:</h3>
        <ul className="text-sm space-y-1">
          <li>• 检查浏览器控制台查看图片加载日志</li>
          <li>• 红色边框表示图片加载失败</li>
          <li>• 如果产品没有图片，应该显示 placeholder.svg</li>
          <li>• 检查图片URL路径是否正确</li>
        </ul>
      </div>
    </div>
  )
}
