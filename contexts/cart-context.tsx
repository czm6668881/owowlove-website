'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { CartItem, Cart, CartContextType } from '@/lib/types/cart'

// Cart actions
type CartAction =
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'id' | 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }

// Initial state
const initialState = {
  cart: {
    items: [],
    total: 0,
    itemCount: 0
  },
  isOpen: false
}

// Cart reducer
function cartReducer(state: any, action: CartAction) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const newItem = action.payload
      const existingItemIndex = state.cart.items.findIndex(
        (item: CartItem) => 
          item.productId === newItem.productId && 
          item.variantId === newItem.variantId
      )

      let updatedItems
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        updatedItems = state.cart.items.map((item: CartItem, index: number) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // Add new item
        const cartItem: CartItem = {
          ...newItem,
          id: Date.now().toString(),
          quantity: 1
        }
        updatedItems = [...state.cart.items, cartItem]
      }

      const total = updatedItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)

      return {
        ...state,
        cart: {
          items: updatedItems,
          total,
          itemCount
        },
        isOpen: true
      }
    }

    case 'REMOVE_FROM_CART': {
      const updatedItems = state.cart.items.filter((item: CartItem) => item.id !== action.payload)
      const total = updatedItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)

      return {
        ...state,
        cart: {
          items: updatedItems,
          total,
          itemCount
        }
      }
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', payload: id })
      }

      const updatedItems = state.cart.items.map((item: CartItem) =>
        item.id === id ? { ...item, quantity } : item
      )
      const total = updatedItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
      const itemCount = updatedItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)

      return {
        ...state,
        cart: {
          items: updatedItems,
          total,
          itemCount
        }
      }
    }

    case 'CLEAR_CART':
      return {
        ...state,
        cart: {
          items: [],
          total: 0,
          itemCount: 0
        }
      }

    case 'LOAD_CART': {
      const items = action.payload
      const total = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
      const itemCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)

      return {
        ...state,
        cart: {
          items,
          total,
          itemCount
        }
      }
    }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    default:
      return state
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Cart provider
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', payload: cartItems })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.cart.items))
  }, [state.cart.items])

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>) => {
    dispatch({ type: 'ADD_TO_CART', payload: item })
  }

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' })
  }

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' })
  }

  const value: CartContextType = {
    cart: state.cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isOpen: state.isOpen,
    openCart,
    closeCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
