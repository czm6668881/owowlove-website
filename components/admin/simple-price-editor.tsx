'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Save, DollarSign } from 'lucide-react'

interface Variant {
  id: string
  size: string
  color: string
  price: number
  stock: number
  sku: string
}

interface SimplePriceEditorProps {
  productId: string
  variants: Variant[]
  onPriceUpdated: (variantId: string, newPrice: number) => void
}

export function SimplePriceEditor({ productId, variants, onPriceUpdated }: SimplePriceEditorProps) {
  const [editingPrices, setEditingPrices] = useState<{ [key: string]: string }>({})
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({})

  const handlePriceChange = (variantId: string, value: string) => {
    setEditingPrices(prev => ({
      ...prev,
      [variantId]: value
    }))
  }

  const handleSavePrice = async (variant: Variant) => {
    const newPriceStr = editingPrices[variant.id]
    if (!newPriceStr) return

    const newPrice = parseFloat(newPriceStr)
    if (isNaN(newPrice) || newPrice < 0) {
      alert('Please enter a valid price')
      return
    }

    setSaving(prev => ({ ...prev, [variant.id]: true }))

    try {
      const response = await fetch(`/api/admin/products/${productId}/variants/${variant.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: newPrice
        }),
      })

      const data = await response.json()

      if (data.success) {
        onPriceUpdated(variant.id, newPrice)
        setEditingPrices(prev => {
          const updated = { ...prev }
          delete updated[variant.id]
          return updated
        })
        alert('Price updated successfully!')
      } else {
        alert('Error updating price: ' + data.error)
      }
    } catch (error) {
      console.error('Error updating price:', error)
      alert('Error updating price')
    } finally {
      setSaving(prev => ({ ...prev, [variant.id]: false }))
    }
  }

  const getCurrentPrice = (variant: Variant) => {
    return editingPrices[variant.id] !== undefined 
      ? editingPrices[variant.id] 
      : variant.price.toString()
  }

  const isEditing = (variantId: string) => {
    return editingPrices[variantId] !== undefined
  }

  const hasChanges = (variant: Variant) => {
    const editingPrice = editingPrices[variant.id]
    return editingPrice !== undefined && parseFloat(editingPrice) !== variant.price
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <DollarSign className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Price Management</h2>
      </div>

      <div className="grid gap-4">
        {variants.map((variant) => (
          <Card key={variant.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{variant.size}</span>
                  <Badge variant="outline">{variant.color}</Badge>
                  <Badge variant="secondary">SKU: {variant.sku}</Badge>
                </div>
                <div className="text-sm font-normal text-gray-500">
                  Stock: {variant.stock}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Price ($)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={getCurrentPrice(variant)}
                    onChange={(e) => handlePriceChange(variant.id, e.target.value)}
                    placeholder="Enter price"
                    className="w-full"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => handleSavePrice(variant)}
                    disabled={!hasChanges(variant) || saving[variant.id]}
                    className="min-w-[100px]"
                  >
                    {saving[variant.id] ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save
                      </div>
                    )}
                  </Button>
                </div>
              </div>
              {isEditing(variant.id) && (
                <div className="mt-2 text-sm text-gray-600">
                  Current price: ${variant.price.toFixed(2)}
                  {hasChanges(variant) && (
                    <span className="text-blue-600 ml-2">
                      → New price: ${parseFloat(getCurrentPrice(variant)).toFixed(2)}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {variants.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No variants found for this product.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
