'use client'

import { useState } from 'react'

export default function ForceRefreshTestPage() {
  const [timestamp, setTimestamp] = useState(Date.now())
  
  const refreshImages = () => {
    setTimestamp(Date.now())
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">强制刷新图片测试</h1>
      
      <div className="mb-6">
        <button 
          onClick={refreshImages}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          强制刷新图片 (绕过缓存)
        </button>
        <p className="text-sm text-gray-600 mt-2">
          当前时间戳: {timestamp}
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">问题图片: product-1752323073983.jpeg</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">API路由 (强制刷新)</h3>
              <img
                key={`api-${timestamp}`}
                src={`/api/image/product-1752323073983.jpeg?v=${timestamp}`}
                alt="测试图片 - API路由"
                className="w-64 h-80 object-cover border rounded-lg"
                onLoad={() => {
                  console.log(`✅ API路由图片加载成功 (${timestamp})`)
                }}
                onError={(e) => {
                  console.error(`❌ API路由图片加载失败 (${timestamp})`)
                  e.currentTarget.style.border = '2px solid red'
                  e.currentTarget.style.backgroundColor = '#ffebee'
                }}
              />
              <p className="text-sm text-gray-600 mt-2">
                URL: /api/image/product-1752323073983.jpeg?v={timestamp}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">直接路径 (强制刷新)</h3>
              <img
                key={`direct-${timestamp}`}
                src={`/uploads/product-1752323073983.jpeg?v=${timestamp}`}
                alt="测试图片 - 直接路径"
                className="w-64 h-80 object-cover border rounded-lg"
                onLoad={() => {
                  console.log(`✅ 直接路径图片加载成功 (${timestamp})`)
                }}
                onError={(e) => {
                  console.error(`❌ 直接路径图片加载失败 (${timestamp})`)
                  e.currentTarget.style.border = '2px solid red'
                  e.currentTarget.style.backgroundColor = '#ffebee'
                }}
              />
              <p className="text-sm text-gray-600 mt-2">
                URL: /uploads/product-1752323073983.jpeg?v={timestamp}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">对比: 其他图片</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium mb-2">product-1752312776393.jpeg</h3>
              <img
                key={`compare1-${timestamp}`}
                src={`/api/image/product-1752312776393.jpeg?v=${timestamp}`}
                alt="对比图片1"
                className="w-64 h-80 object-cover border rounded-lg"
                onLoad={() => console.log(`✅ 对比图片1加载成功 (${timestamp})`)}
                onError={() => console.error(`❌ 对比图片1加载失败 (${timestamp})`)}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">product-1752080189101.jpeg</h3>
              <img
                key={`compare2-${timestamp}`}
                src={`/api/image/product-1752080189101.jpeg?v=${timestamp}`}
                alt="对比图片2"
                className="w-64 h-80 object-cover border rounded-lg"
                onLoad={() => console.log(`✅ 对比图片2加载成功 (${timestamp})`)}
                onError={() => console.error(`❌ 对比图片2加载失败 (${timestamp})`)}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">product-1752068376427.jpg</h3>
              <img
                key={`compare3-${timestamp}`}
                src={`/api/image/product-1752068376427.jpg?v=${timestamp}`}
                alt="对比图片3"
                className="w-64 h-80 object-cover border rounded-lg"
                onLoad={() => console.log(`✅ 对比图片3加载成功 (${timestamp})`)}
                onError={() => console.error(`❌ 对比图片3加载失败 (${timestamp})`)}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">调试信息</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>服务器状态:</strong> 所有图片API请求都返回200状态码
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>文件大小:</strong> product-1752323073983.jpeg = 177,865 字节
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Content-Type:</strong> image/jpeg
            </p>
            <p className="text-sm text-gray-600">
              如果图片仍然不显示，请检查浏览器控制台的错误信息。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
