'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface ProductVariant {
  id: string
  size: string
  color: string
  price: number
  stock: number
  sku: string
}

interface Product {
  id: string
  nameEn: string
  variants: ProductVariant[]
  images: Array<{
    url: string
    alt: string
    isPrimary: boolean
  }>
}

interface ProductSelectorProps {
  product: Product
}

export function ProductSelector({ product }: ProductSelectorProps) {
  const { addToCart } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedColor, setSelectedColor] = useState<string>('')

  // Get unique sizes and colors
  const sizes = [...new Set(product.variants.map(v => v.size))]
  const colors = [...new Set(product.variants.map(v => v.color))]

  // Get available colors for selected size
  const availableColors = selectedSize 
    ? [...new Set(product.variants.filter(v => v.size === selectedSize).map(v => v.color))]
    : colors

  // Get available sizes for selected color
  const availableSizes = selectedColor
    ? [...new Set(product.variants.filter(v => v.color === selectedColor).map(v => v.size))]
    : sizes

  // Find variant based on selected size and color
  const findVariant = (size: string, color: string) => {
    return product.variants.find(v => v.size === size && v.color === color)
  }

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    if (selectedColor) {
      const variant = findVariant(size, selectedColor)
      setSelectedVariant(variant || null)
    }
  }

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    if (selectedSize) {
      const variant = findVariant(selectedSize, color)
      setSelectedVariant(variant || null)
    }
  }

  // Handle add to cart
  const handleAddToCart = () => {
    if (!selectedVariant) return

    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
    
    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.nameEn,
      productImage: primaryImage?.url || '/placeholder.jpg',
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
      sku: selectedVariant.sku
    })
  }

  const isAddToCartDisabled = !selectedVariant || selectedVariant.stock === 0

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Size Selection */}
        <div>
          <h3 className="font-medium mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isAvailable = availableSizes.includes(size)
              const isSelected = selectedSize === size
              
              return (
                <Button
                  key={size}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={!isAvailable}
                  onClick={() => handleSizeSelect(size)}
                  className={isSelected ? "bg-pink-600 hover:bg-pink-700" : ""}
                >
                  {size}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <h3 className="font-medium mb-3">Color</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const isAvailable = availableColors.includes(color)
              const isSelected = selectedColor === color
              
              return (
                <Button
                  key={color}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={!isAvailable}
                  onClick={() => handleColorSelect(color)}
                  className={isSelected ? "bg-pink-600 hover:bg-pink-700" : ""}
                >
                  {color}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Price and Stock */}
        {selectedVariant && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">${selectedVariant.price.toFixed(2)}</span>
              <Badge variant={selectedVariant.stock > 0 ? "default" : "destructive"}>
                {selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">SKU: {selectedVariant.sku}</p>
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={isAddToCartDisabled}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-300"
          size="lg"
        >
          {!selectedSize || !selectedColor 
            ? 'Select Size & Color'
            : selectedVariant?.stock === 0 
            ? 'Out of Stock'
            : 'Add to Bag'
          }
        </Button>

        {/* Selection Summary */}
        {(selectedSize || selectedColor) && (
          <div className="text-sm text-gray-600">
            Selected: {selectedSize && <Badge variant="outline" className="mr-1">{selectedSize}</Badge>}
            {selectedColor && <Badge variant="outline">{selectedColor}</Badge>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
