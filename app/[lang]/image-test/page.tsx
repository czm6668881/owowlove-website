'use client'

export default function ImageTestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">图片显示测试</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">测试1: 直接静态路径</h2>
          <img
            src="/product-images/product-1751126775583.jpg"
            alt="产品图片测试"
            className="w-64 h-80 object-cover border rounded-lg"
            onLoad={() => console.log('✅ 图片加载成功')}
            onError={(e) => {
              console.error('❌ 图片加载失败:', e)
              console.error('图片路径:', '/product-images/product-1751126775583.jpg')
            }}
          />
          <p className="text-sm text-gray-600 mt-2">路径: /product-images/product-1751126775583.jpg</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">测试2: API路由</h2>
          <img
            src="/api/image/product-1751126775583.jpg"
            alt="API路由测试"
            className="w-64 h-80 object-cover border rounded-lg"
            onLoad={() => console.log('✅ API路由图片加载成功')}
            onError={(e) => {
              console.error('❌ API路由图片加载失败:', e)
              console.error('API路径:', '/api/image/product-1751126775583.jpg')
            }}
          />
          <p className="text-sm text-gray-600 mt-2">路径: /api/image/product-1751126775583.jpg</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">测试3: 占位符图片</h2>
          <img
            src="/placeholder.svg"
            alt="占位符测试"
            className="w-64 h-80 object-cover border rounded-lg"
            onLoad={() => console.log('✅ 占位符图片加载成功')}
            onError={(e) => console.error('❌ 占位符图片加载失败:', e)}
          />
          <p className="text-sm text-gray-600 mt-2">路径: /placeholder.svg</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">调试信息</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p><strong>当前URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server Side'}</p>
            <p><strong>图片完整URL:</strong> {typeof window !== 'undefined' ? new URL('/product-images/product-1751126775583.jpg', window.location.origin).href : 'Server Side'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
