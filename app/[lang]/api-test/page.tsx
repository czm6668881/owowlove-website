'use client'

import { useEffect, useState } from 'react'

export default function ApiTestPage() {
  const [apiStatus, setApiStatus] = useState<Record<string, string>>({})

  const testApi = async (url: string, name: string) => {
    try {
      const response = await fetch(url)
      if (response.ok) {
        setApiStatus(prev => ({ ...prev, [name]: `✅ ${response.status} - ${response.statusText}` }))
      } else {
        setApiStatus(prev => ({ ...prev, [name]: `❌ ${response.status} - ${response.statusText}` }))
      }
    } catch (error) {
      setApiStatus(prev => ({ ...prev, [name]: `❌ Error: ${error}` }))
    }
  }

  useEffect(() => {
    // 测试各种API端点
    testApi('/api/image/product-1751126775583.jpg', 'Image API')
    testApi('/api/products', 'Products API')
    testApi('/product-images/product-1751126775583.jpg', 'Static File')
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">API 测试页面</h1>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">API 状态测试</h2>
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            {Object.entries(apiStatus).map(([name, status]) => (
              <div key={name} className="flex justify-between">
                <span className="font-medium">{name}:</span>
                <span className={status.startsWith('✅') ? 'text-green-600' : 'text-red-600'}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">图片显示测试</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">API 路由图片</h3>
              <img
                src="/api/image/product-1751126775583.jpg"
                alt="API route test"
                className="w-full h-48 object-cover border rounded"
                onLoad={() => console.log('✅ API图片加载成功')}
                onError={(e) => {
                  console.error('❌ API图片加载失败')
                  console.error('Error details:', e)
                }}
              />
              <p className="text-sm text-gray-600 mt-2">/api/image/product-1751126775583.jpg</p>
            </div>

            <div className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">静态文件图片</h3>
              <img
                src="/product-images/product-1751126775583.jpg"
                alt="Static file test"
                className="w-full h-48 object-cover border rounded"
                onLoad={() => console.log('✅ 静态图片加载成功')}
                onError={(e) => {
                  console.error('❌ 静态图片加载失败')
                  console.error('Error details:', e)
                }}
              />
              <p className="text-sm text-gray-600 mt-2">/product-images/product-1751126775583.jpg</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">手动测试链接</h2>
          <div className="space-y-2">
            <div>
              <a 
                href="/api/image/product-1751126775583.jpg" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                🔗 直接访问 API 图片
              </a>
            </div>
            <div>
              <a 
                href="/product-images/product-1751126775583.jpg" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                🔗 直接访问静态图片
              </a>
            </div>
            <div>
              <a 
                href="/api/products" 
                target="_blank" 
                className="text-blue-600 hover:underline"
              >
                🔗 产品数据 API
              </a>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">文件系统信息</h2>
          <div className="bg-gray-100 p-4 rounded-lg text-sm">
            <p><strong>当前工作目录:</strong> {typeof window !== 'undefined' ? 'Client Side' : process.cwd()}</p>
            <p><strong>预期图片路径:</strong> public/product-images/product-1751126775583.jpg</p>
            <p><strong>API 路径:</strong> /api/image/product-1751126775583.jpg</p>
          </div>
        </div>
      </div>
    </div>
  )
}
