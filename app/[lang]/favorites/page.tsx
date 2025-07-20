'use client'

import { useFavorites } from '@/contexts/favorites-context'
import { useCart } from '@/contexts/cart-context'
import { useTranslations } from '@/hooks/use-translations'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function FavoritesPage() {
  const { t } = useTranslations()
  const { favorites, removeFromFavorites, clearFavorites, favoriteCount } = useFavorites()
  const { addToCart } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleAddToCart = (favorite: any) => {
    addToCart({
      productId: favorite.productId,
      variantId: `${favorite.productId}-default`,
      productName: favorite.productName,
      productImage: favorite.productImage,
      size: 'One Size',
      color: 'Default',
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/en">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-pink-600" />
                <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>
                <Badge variant="secondary">{favoriteCount}</Badge>
              </div>
            </div>
            
            {favorites.length > 0 && (
              <Button
                variant={showClearConfirm ? "destructive" : "outline"}
                onClick={handleClearFavorites}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {showClearConfirm ? 'Confirm Clear All' : 'Clear All'}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <Heart className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No favorites yet</h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Start adding products to your favorites by clicking the heart icon on any product you love.
            </p>
            <Link href="/en">
              <Button className="bg-pink-600 hover:bg-pink-700">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <Card key={favorite.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <Image
                      src={favorite.productImage}
                      alt={favorite.productName}
                      width={300}
                      height={400}
                      className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => removeFromFavorites(favorite.productId)}
                    >
                      <Heart className="h-4 w-4 fill-pink-600 text-pink-600" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{favorite.productName}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        ${favorite.price.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Added {new Date(favorite.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-pink-600 hover:bg-pink-700"
                        onClick={() => handleAddToCart(favorite)}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFromFavorites(favorite.productId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer Summary */}
      {favorites.length > 0 && (
        <div className="border-t bg-gray-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {favoriteCount} item{favoriteCount !== 1 ? 's' : ''} in your favorites
              </div>
              <Link href="/en">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
