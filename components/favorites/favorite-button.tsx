'use client'

import { useFavorites } from '@/contexts/favorites-context'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

interface ProductForFavorites {
  id: string
  nameEn: string
  variants: Array<{
    price: number
  }>
  images: Array<{
    url: string
    isPrimary: boolean
  }>
}

interface FavoriteButtonProps {
  product: ProductForFavorites
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'ghost' | 'outline' | 'default'
}

export function FavoriteButton({ 
  product, 
  className = '', 
  size = 'default',
  variant = 'ghost'
}: FavoriteButtonProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  
  const isProductFavorite = isFavorite(product.id)
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
  const minPrice = Math.min(...product.variants.map(v => v.price))

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isProductFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites({
        productId: product.id,
        productName: product.nameEn,
        productImage: primaryImage?.url || '/placeholder.jpg',
        price: minPrice
      })
    }
  }

  return (
    <Button 
      variant={variant}
      size="icon" 
      onClick={handleToggleFavorite}
      className={`transition-colors ${className}`}
      title={isProductFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart 
        className={`h-4 w-4 transition-colors ${
          isProductFavorite 
            ? 'fill-pink-600 text-pink-600' 
            : 'text-gray-400 hover:text-pink-600'
        }`} 
      />
    </Button>
  )
}
