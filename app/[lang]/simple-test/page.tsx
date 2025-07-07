export default function SimpleTestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">简单图片测试</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">测试1: 占位符图片</h2>
          <img
            src="/placeholder.svg"
            alt="占位符"
            className="w-64 h-80 object-cover border rounded-lg"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">测试2: 所有产品图片 (API)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'product-1751125573143.jpg',
              'product-1751125603677.jpg',
              'product-1751125619302.jpg',
              'product-1751125627765.jpg',
              'product-1751126756450.jpg',
              'product-1751126775583.jpg'
            ].map(filename => (
              <div key={filename} className="text-center">
                <img
                  src={`/api/image/${filename}`}
                  alt={filename}
                  className="w-full h-32 object-cover border rounded-lg mb-2"
                />
                <p className="text-xs text-gray-600">{filename}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">测试3: 所有产品图片 (直接)</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'product-1751125573143.jpg',
              'product-1751125603677.jpg',
              'product-1751125619302.jpg',
              'product-1751125627765.jpg',
              'product-1751126756450.jpg',
              'product-1751126775583.jpg'
            ].map(filename => (
              <div key={filename} className="text-center">
                <img
                  src={`/product-images/${filename}`}
                  alt={filename}
                  className="w-full h-32 object-cover border rounded-lg mb-2"
                />
                <p className="text-xs text-gray-600">{filename}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">测试4: 外部图片</h2>
          <img
            src="https://via.placeholder.com/300x400/cccccc/666666?text=Test+Image"
            alt="外部测试图片"
            className="w-64 h-80 object-cover border rounded-lg"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">直接链接测试</h2>
          <div className="space-y-2">
            <p>
              <a href="/api/image/product-1751126775583.jpg" target="_blank" className="text-blue-600 hover:underline">
                点击测试 API 图片链接
              </a>
            </p>
            <p>
              <a href="/product-images/product-1751126775583.jpg" target="_blank" className="text-blue-600 hover:underline">
                点击测试直接图片链接
              </a>
            </p>
            <p>
              <a href="/placeholder.svg" target="_blank" className="text-blue-600 hover:underline">
                点击测试占位符链接
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
