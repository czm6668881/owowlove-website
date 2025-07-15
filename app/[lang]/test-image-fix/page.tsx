'use client'

export default function TestImageFixPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">图片修复测试</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">测试问题图片: product-1752323073983.jpeg</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">API路由 (带时间戳)</h3>
              <img
                src={`/api/image/product-1752323073983.jpeg?t=${Date.now()}`}
                alt="测试图片 - API路由"
                className="w-64 h-80 object-cover border rounded-lg"
                onLoad={() => console.log('✅ API路由图片加载成功')}
                onError={(e) => {
                  console.error('❌ API路由图片加载失败')
                  e.currentTarget.style.border = '2px solid red'
                }}
              />
              <p className="text-sm text-gray-600 mt-2">
                URL: /api/image/product-1752323073983.jpeg?t={Date.now()}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">直接路径</h3>
              <img
                src="/uploads/product-1752323073983.jpeg"
                alt="测试图片 - 直接路径"
                className="w-64 h-80 object-cover border rounded-lg"
                onLoad={() => console.log('✅ 直接路径图片加载成功')}
                onError={(e) => {
                  console.error('❌ 直接路径图片加载失败')
                  e.currentTarget.style.border = '2px solid red'
                }}
              />
              <p className="text-sm text-gray-600 mt-2">
                URL: /uploads/product-1752323073983.jpeg
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">对比: 已知正常的图片</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">product-1752312776393.jpeg</h3>
              <img
                src="/api/image/product-1752312776393.jpeg"
                alt="对比图片1"
                className="w-64 h-80 object-cover border rounded-lg"
                onLoad={() => console.log('✅ 对比图片1加载成功')}
                onError={() => console.error('❌ 对比图片1加载失败')}
              />
            </div>
            
            <div>
              <h3 className="font-medium mb-2">product-1752068376427.jpg</h3>
              <img
                src="/api/image/product-1752068376427.jpg"
                alt="对比图片2"
                className="w-64 h-80 object-cover border rounded-lg"
                onLoad={() => console.log('✅ 对比图片2加载成功')}
                onError={() => console.error('❌ 对比图片2加载失败')}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">测试结果</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              请检查浏览器控制台的日志输出，查看哪些图片加载成功或失败。
            </p>
            <p className="text-sm text-gray-600 mt-2">
              如果API路由图片显示正常，说明修复成功。如果仍然显示"Image Not Found"，
              可能是浏览器缓存问题，请尝试硬刷新 (Ctrl+F5)。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
