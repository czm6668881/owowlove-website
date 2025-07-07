'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { NewProductForm } from '@/components/admin/new-product-form'

export default function NewEditProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string
  const lang = params?.lang as string || 'en'
  
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
      const data = await response.json()
      
      if (data.success) {
        setProduct(data.data)
      } else {
        alert('Error loading product: ' + data.error)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      alert('Error loading product')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">Product not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push(`/${lang}/admin/products`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <h1 className="text-3xl font-bold">Edit Product (New System)</h1>
          <p className="text-gray-600 mt-2">Product: {product.nameEn}</p>
        </div>
      </div>

      <NewProductForm
        product={product}
        isEditing={true}
        lang={lang}
      />
    </div>
  )
}
