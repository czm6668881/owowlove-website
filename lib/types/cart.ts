export interface CartItem {
  id: string
  productId: string
  variantId: string
  productName: string
  productImage: string
  size: string
  color: string
  price: number
  quantity: number
  sku: string
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface CartContextType {
  cart: Cart
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}
