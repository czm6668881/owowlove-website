'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface ProductData {
  id: string
  nameEn: string
  images: Array<{
    id: string
    url: string
    alt: string
    isPrimary: boolean
    order: number
  }>
}

export default function DebugImagesPage() {
  const [products, setProducts] = useState<ProductData[]>([])
  const [imageTests, setImageTests] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Load products data
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        console.log('Products data:', data)
        setProducts(data)
      })
      .catch(err => console.error('Error loading products:', err))
  }, [])

  const testImageLoad = (url: string) => {
    const img = new window.Image()
    img.onload = () => {
      setImageTests(prev => ({ ...prev, [url]: true }))
      console.log(`✅ Image loaded successfully: ${url}`)
    }
    img.onerror = () => {
      setImageTests(prev => ({ ...prev, [url]: false }))
      console.error(`❌ Image failed to load: ${url}`)
    }
    img.src = url
  }

  useEffect(() => {
    products.forEach(product => {
      product.images.forEach(image => {
        testImageLoad(image.url)
      })
    })
  }, [products])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Image Debug Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Image Load Test Results</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          {Object.entries(imageTests).map(([url, loaded]) => (
            <div key={url} className={`p-2 ${loaded ? 'text-green-600' : 'text-red-600'}`}>
              {loaded ? '✅' : '❌'} {url}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Direct Image Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Test 1: Direct static path */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium mb-2">Direct Static Path</h3>
            <img
              src="/product-images/product-1751126775583.jpg"
              alt="Direct static test"
              className="w-full h-48 object-cover border rounded"
              onLoad={() => console.log('✅ Direct static image loaded')}
              onError={() => console.error('❌ Direct static image failed')}
            />
            <p className="text-sm text-gray-600 mt-2">/product-images/product-1751126775583.jpg</p>
          </div>

          {/* Test 2: API route */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium mb-2">API Route</h3>
            <img
              src="/api/image/product-1751126775583.jpg"
              alt="API route test"
              className="w-full h-48 object-cover border rounded"
              onLoad={() => console.log('✅ API route image loaded')}
              onError={() => console.error('❌ API route image failed')}
            />
            <p className="text-sm text-gray-600 mt-2">/api/image/product-1751126775583.jpg</p>
          </div>

          {/* Test 3: Next.js Image component */}
          <div className="border p-4 rounded-lg">
            <h3 className="font-medium mb-2">Next.js Image Component</h3>
            <Image
              src="/product-images/product-1751126775583.jpg"
              alt="Next.js Image test"
              width={300}
              height={200}
              className="w-full h-48 object-cover border rounded"
              onLoad={() => console.log('✅ Next.js Image loaded')}
              onError={() => console.error('❌ Next.js Image failed')}
            />
            <p className="text-sm text-gray-600 mt-2">Next.js Image component</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Products Data</h2>
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="border p-4 rounded-lg">
              <h3 className="font-medium mb-2">{product.nameEn}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {product.images.map(image => (
                  <div key={image.id} className="border p-2 rounded">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-32 object-cover border rounded mb-2"
                      onLoad={() => console.log(`✅ Product image loaded: ${image.url}`)}
                      onError={() => console.error(`❌ Product image failed: ${image.url}`)}
                    />
                    <div className="text-xs text-gray-600">
                      <p>URL: {image.url}</p>
                      <p>Primary: {image.isPrimary ? 'Yes' : 'No'}</p>
                      <p>Order: {image.order}</p>
                      <p>Status: {imageTests[image.url] !== undefined ? 
                        (imageTests[image.url] ? '✅ Loaded' : '❌ Failed') : 
                        '⏳ Testing...'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
