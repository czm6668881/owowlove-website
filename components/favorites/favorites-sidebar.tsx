'use client'

import { useFavorites } from '@/contexts/favorites-context'
import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Heart, ShoppingBag, Trash2, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface FavoritesSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function FavoritesSidebar({ isOpen, onClose }: FavoritesSidebarProps) {
  const { favorites, removeFromFavorites, clearFavorites, favoriteCount } = useFavorites()
  const { addToCart } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  if (!isOpen) return null

  const handleAddToCart = (favorite: any) => {
    // For favorites, we'll add the first available variant
    // In a real app, you might want to show a variant selector
    addToCart({
      productId: favorite.productId,
      variantId: `${favorite.productId}-default`, // This would need to be a real variant ID
      productName: favorite.productName,
      productImage: favorite.productImage,
      size: 'One Size', // Default size
      color: 'Default', // Default color
      price: favorite.price,
      sku: `${favorite.productId}-default`
    })
  }

  const handleClearFavorites = () => {
    if (showClearConfirm) {
      clearFavorites()
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
      setTimeout(() => setShowClearConfirm(false), 3000)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-pink-600" />
            <h2 className="text-lg md:text-xl font-semibold">Favorites</h2>
            <Badge variant="secondary">{favoriteCount}</Badge>
          </div>
          <div className="flex items-center space-x-1 md:space-x-2">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Heart className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
              <p className="text-gray-500 mb-4">
                Start adding products to your favorites by clicking the heart icon
              </p>
              <Button onClick={onClose} variant="outline">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* Clear all button */}
              <div className="flex justify-end">
                <Button
                  variant={showClearConfirm ? "destructive" : "outline"}
                  size="sm"
                  onClick={handleClearFavorites}
                  className="text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  {showClearConfirm ? 'Confirm Clear All' : 'Clear All'}
                </Button>
              </div>

              {/* Favorites list */}
              {favorites.map((favorite) => (
                <div key={favorite.id} className="flex space-x-3 p-3 border rounded-lg">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={favorite.productImage}
                      alt={favorite.productName}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {favorite.productName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      ${favorite.price.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Added {new Date(favorite.addedAt).toLocaleDateString()}
                    </p>
                    
                    <div className="flex space-x-2 mt-2">
                      <Button
                        size="sm"
                        className="bg-pink-600 hover:bg-pink-700 text-xs px-2 py-1 h-6"
                        onClick={() => handleAddToCart(favorite)}
                      >
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs px-2 py-1 h-6"
                        onClick={() => removeFromFavorites(favorite.productId)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="border-t p-4">
            <div className="text-center text-sm text-gray-500 mb-3">
              {favoriteCount} item{favoriteCount !== 1 ? 's' : ''} in favorites
            </div>
            <Button 
              onClick={onClose}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
