'use client'

import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { ShoppingBag } from 'lucide-react'

export function CartIcon() {
  const { cart, openCart } = useCart()

  return (
    <Button variant="ghost" size="icon" onClick={openCart} className="relative h-8 w-8 md:h-10 md:w-10">
      <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
      {cart.itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
          {cart.itemCount > 99 ? '99+' : cart.itemCount}
        </span>
      )}
    </Button>
  )
}
