import Image from 'next/image'

export default function TestImagePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">Image Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Direct static path */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Direct Static Path</h2>
          <Image
            src="/product-images/product-1751126775583.jpg"
            alt="Test Image - Direct Path"
            width={300}
            height={400}
            className="border rounded-lg"
          />
        </div>

        {/* API route path */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">API Route Path</h2>
          <Image
            src="/api/image/product-1751126775583.jpg"
            alt="Test Image - API Route"
            width={300}
            height={400}
            className="border rounded-lg"
          />
        </div>

        {/* Regular img tag */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Regular img tag - Direct</h2>
          <img
            src="/product-images/product-1751126775583.jpg"
            alt="Test Image - Regular img"
            className="w-[300px] h-[400px] object-cover border rounded-lg"
          />
        </div>

        {/* Regular img tag API */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Regular img tag - API</h2>
          <img
            src="/api/image/product-1751126775583.jpg"
            alt="Test Image - Regular img API"
            className="w-[300px] h-[400px] object-cover border rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}
