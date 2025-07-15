export default function SimplePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">简单测试页面</h1>
        <p className="text-gray-600 mb-4">
          这是一个简化的页面，用于测试基本的加载功能。
        </p>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="font-medium mb-2">页面状态</h2>
            <p className="text-sm text-green-600">✅ 页面加载成功</p>
            <p className="text-sm text-green-600">✅ 没有复杂的API调用</p>
            <p className="text-sm text-green-600">✅ 没有上下文依赖</p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="font-medium mb-2">导航链接</h2>
            <div className="space-y-2">
              <a href="/en" className="block text-blue-600 hover:underline">
                → 返回主页
              </a>
              <a href="/en/stripe-test" className="block text-blue-600 hover:underline">
                → Stripe 测试页面
              </a>
              <a href="/en/error-monitor" className="block text-blue-600 hover:underline">
                → 错误监控页面
              </a>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h2 className="font-medium mb-2">时间戳</h2>
            <p className="text-sm text-gray-600">
              页面生成时间: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
