'use client'

export default function TestStaticPage() {
  const testUrls = [
    '/placeholder.svg',
    '/placeholder.jpg', 
    '/uploads/product-1751799844317.jpg',
    '/product-images/product-1751126775583.jpg'
  ]

  const testUrl = async (url: string) => {
    try {
      const response = await fetch(url)
      console.log(`${url}: ${response.status} ${response.statusText}`)
      return response.ok
    } catch (error) {
      console.error(`${url}: Error -`, error)
      return false
    }
  }

  const testAllUrls = async () => {
    console.log('=== 开始测试静态文件访问 ===')
    for (const url of testUrls) {
      await testUrl(url)
    }
    console.log('=== 测试完成 ===')
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">静态文件访问测试</h1>
      
      <button 
        onClick={testAllUrls}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        测试所有URL
      </button>
      
      <div className="space-y-6">
        {testUrls.map((url) => (
          <div key={url} className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">测试: {url}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">直接链接:</p>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {url}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">图片显示测试:</p>
                <img
                  src={url}
                  alt={`Test ${url}`}
                  className="w-32 h-32 object-cover border rounded"
                  onLoad={() => console.log(`✅ 加载成功: ${url}`)}
                  onError={() => console.error(`❌ 加载失败: ${url}`)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-medium mb-2">说明:</h3>
        <ul className="text-sm space-y-1">
          <li>• 点击"测试所有URL"按钮查看控制台日志</li>
          <li>• 点击直接链接测试浏览器访问</li>
          <li>• 查看图片是否能正常显示</li>
          <li>• 检查控制台的加载成功/失败日志</li>
        </ul>
      </div>
    </div>
  )
}
