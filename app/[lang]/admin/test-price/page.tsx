'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPricePage() {
  const [product, setProduct] = useState<any>(null)
  const [newPrice, setNewPrice] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/admin/products/2')
      const data = await response.json()
      if (data.success) {
        setProduct(data.data)
        setNewPrice(data.data.variants[0]?.price?.toString() || '')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }

  const updatePrice = async () => {
    if (!product || !newPrice) return
    
    setLoading(true)
    try {
      const updatedVariants = [...product.variants]
      updatedVariants[0] = {
        ...updatedVariants[0],
        price: parseFloat(newPrice)
      }

      const response = await fetch(`/api/admin/products/2`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...product,
          variants: updatedVariants
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert('Price updated successfully!')
        fetchProduct() // Refresh data
      } else {
        alert('Error: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating price:', error)
      alert('Error updating price')
    } finally {
      setLoading(false)
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Price Update Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Product:</strong> {product.nameEn}
          </div>
          <div>
            <strong>Current Price:</strong> ${product.variants[0]?.price?.toFixed(2)}
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="New price"
              className="w-32"
            />
            <Button 
              onClick={updatePrice} 
              disabled={loading}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {loading ? 'Updating...' : 'Update Price'}
            </Button>
          </div>
          <Button 
            onClick={fetchProduct}
            variant="outline"
          >
            Refresh Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
