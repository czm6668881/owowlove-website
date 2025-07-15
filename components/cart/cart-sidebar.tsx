'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/cart-context'
import { useUserAuth } from '@/contexts/user-auth-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { X, Plus, Minus, ShoppingBag, CreditCard, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export function CartSidebar() {
  const router = useRouter()
  const { cart, isOpen, closeCart, updateQuantity, removeFromCart } = useCart()
  const { user } = useUserAuth()
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [error, setError] = useState<string>('')

  if (!isOpen) return null

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      setError('购物车为空')
      return
    }

    try {
      setIsCreatingOrder(true)
      setError('')

      // Close cart and navigate to checkout page
      closeCart()
      router.push('/checkout')
    } catch (error) {
      console.error('Checkout error:', error)
      setError('结账过程中发生错误，请重试')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b">
          <h2 className="text-lg md:text-xl font-semibold">Shopping Bag</h2>
          <Button variant="ghost" size="icon" onClick={closeCart}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Your bag is empty</p>
              <Button onClick={closeCart} className="bg-pink-600 hover:bg-pink-700">
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {item.productName}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.size}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.color}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-semibold text-gray-900">
                        ${item.price.toFixed(2)}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 p-0 h-auto mt-1"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>¥{cart.total.toFixed(2)}</span>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}



            <div className="space-y-2">
              <Button
                className="w-full bg-pink-600 hover:bg-pink-700"
                onClick={handleCheckout}
                disabled={isCreatingOrder}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isCreatingOrder ? '前往结账...' : `结账 (${cart.itemCount} 件商品)`}
              </Button>
              <Button variant="outline" className="w-full" onClick={closeCart}>
                继续购物
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
