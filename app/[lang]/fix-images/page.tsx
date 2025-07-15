'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Product {
  id: string
  name: string
  images: string[]
  is_active: boolean
}

interface ImageStatus {
  filename: string
  exists: boolean
  products: string[]
}

export default function FixImagesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [imageStatuses, setImageStatuses] = useState<ImageStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [fixing, setFixing] = useState(false)

  useEffect(() => {
    fetchProductsAndCheckImages()
  }, [])

  const fetchProductsAndCheckImages = async () => {
    try {
      // 获取所有产品
      const response = await fetch('/api/products')
      const data = await response.json()
      
      if (data.success) {
        const allProducts = data.data
        setProducts(allProducts)
        
        // 收集所有图片文件名
        const imageMap = new Map<string, string[]>()
        
        allProducts.forEach((product: Product) => {
          if (product.images && product.images.length > 0) {
            product.images.forEach((imageUrl: string) => {
              // 提取文件名
              let filename = ''
              if (imageUrl.includes('/uploads/')) {
                filename = imageUrl.split('/uploads/')[1]
              } else if (imageUrl.includes('/api/image/')) {
                filename = imageUrl.split('/api/image/')[1]
              } else if (!imageUrl.startsWith('http')) {
                filename = imageUrl.replace(/^\/+/, '')
              }
              
              if (filename && filename !== 'placeholder.svg') {
                if (!imageMap.has(filename)) {
                  imageMap.set(filename, [])
                }
                imageMap.get(filename)?.push(product.name)
              }
            })
          }
        })
        
        // 检查每个图片文件是否存在
        const statuses: ImageStatus[] = []
        for (const [filename, productNames] of imageMap.entries()) {
          try {
            const imageResponse = await fetch(`/api/image/${filename}`)
            statuses.push({
              filename,
              exists: imageResponse.ok,
              products: productNames
            })
          } catch (error) {
            statuses.push({
              filename,
              exists: false,
              products: productNames
            })
          }
        }
        
        setImageStatuses(statuses)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fixMissingImages = async () => {
    setFixing(true)
    
    const missingImages = imageStatuses.filter(status => !status.exists)
    
    for (const missingImage of missingImages) {
      console.log(`🔧 Fixing missing image: ${missingImage.filename}`)
      console.log(`   Used by products: ${missingImage.products.join(', ')}`)
      
      // 这里可以添加修复逻辑，比如：
      // 1. 将产品图片设置为占位符
      // 2. 从备份位置恢复图片
      // 3. 删除引用不存在图片的产品
      
      // 暂时只在控制台记录
    }
    
    alert(`发现 ${missingImages.length} 个缺失的图片文件。请检查控制台了解详情。`)
    setFixing(false)
  }

  const missingCount = imageStatuses.filter(status => !status.exists).length
  const totalCount = imageStatuses.length

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">检查图片状态中...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">图片诊断工具</h1>
        <div className="flex gap-4 mb-4">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
            正常图片: {totalCount - missingCount}
          </div>
          <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
            缺失图片: {missingCount}
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded">
            总计: {totalCount}
          </div>
        </div>
        
        {missingCount > 0 && (
          <Button 
            onClick={fixMissingImages}
            disabled={fixing}
            className="bg-red-600 hover:bg-red-700"
          >
            {fixing ? '修复中...' : `修复 ${missingCount} 个缺失图片`}
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {imageStatuses.map((status, index) => (
          <Card key={index} className={status.exists ? 'border-green-200' : 'border-red-200'}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="font-mono text-sm">{status.filename}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  status.exists 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {status.exists ? '✅ 存在' : '❌ 缺失'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-gray-600 mb-2">使用此图片的产品:</p>
                <ul className="list-disc list-inside text-sm">
                  {status.products.map((productName, idx) => (
                    <li key={idx}>{productName}</li>
                  ))}
                </ul>
              </div>
              
              {status.exists && (
                <div className="mt-4">
                  <img 
                    src={`/api/image/${status.filename}`}
                    alt={status.filename}
                    className="w-32 h-32 object-cover border rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
