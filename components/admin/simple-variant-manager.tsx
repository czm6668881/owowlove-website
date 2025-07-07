'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2 } from 'lucide-react'
import { ProductVariant } from '@/lib/types/product'

interface SimpleVariantManagerProps {
  variants: ProductVariant[]
  onChange: (variants: ProductVariant[]) => void
}

export function SimpleVariantManager({ variants, onChange }: SimpleVariantManagerProps) {
  const [newVariant, setNewVariant] = useState({
    size: 'S',
    color: 'Black',
    price: '0.00',
    sku: ''
  })

  const updateVariantPrice = (variantId: string, newPrice: string) => {
    const price = parseFloat(newPrice) || 0
    const updatedVariants = variants.map(variant =>
      variant.id === variantId
        ? { ...variant, price }
        : variant
    )
    onChange(updatedVariants)
  }



  const addVariant = () => {
    if (!newVariant.size || !newVariant.color || !newVariant.price) {
      alert('Please fill in size, color, and price')
      return
    }

    const variant: ProductVariant = {
      id: Date.now().toString(),
      size: newVariant.size,
      color: newVariant.color,
      price: parseFloat(newVariant.price) || 0,
      stock: 0,
      sku: newVariant.sku || `${newVariant.size}-${newVariant.color}-${Date.now()}`
    }

    onChange([...variants, variant])
    setNewVariant({
      size: 'S',
      color: 'Black',
      price: '0.00',
      sku: ''
    })
  }

  const removeVariant = (variantId: string) => {
    if (confirm('Are you sure you want to remove this variant?')) {
      onChange(variants.filter(v => v.id !== variantId))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Variants - Simple Editor</CardTitle>
        <p className="text-sm text-gray-600">
          Directly edit prices and stock. Changes are saved automatically.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Variants */}
        {variants.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Current Variants</h3>
            {variants.map((variant) => (
              <div key={variant.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <Label className="text-xs text-gray-500">Size & Color</Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{variant.size}</Badge>
                      <Badge variant="outline">{variant.color}</Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.price}
                      onChange={(e) => updateVariantPrice(variant.id, e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-500">SKU</Label>
                    <div className="mt-1 text-sm font-mono bg-white p-2 rounded border">
                      {variant.sku}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(variant.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Variant */}
        <div className="border-t pt-6">
          <h3 className="font-medium mb-4">Add New Variant</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Size</Label>
              <select
                value={newVariant.size}
                onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="均码">均码</option>
              </select>
            </div>

            <div>
              <Label>Color</Label>
              <select
                value={newVariant.color}
                onChange={(e) => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Pink">Pink</option>
                <option value="Blue">Blue</option>
                <option value="Purple">Purple</option>
              </select>
            </div>

            <div>
              <Label>Price ($)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={newVariant.price}
                onChange={(e) => setNewVariant(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={addVariant} className="w-full bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
