'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { FavoriteItem, FavoritesContextType } from '@/lib/types/favorites'

// Favorites actions
type FavoritesAction =
  | { type: 'ADD_TO_FAVORITES'; payload: Omit<FavoriteItem, 'id' | 'addedAt'> }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'LOAD_FAVORITES'; payload: FavoriteItem[] }

// Initial state
const initialState = {
  favorites: [],
  favoriteCount: 0
}

// Favorites reducer
function favoritesReducer(state: any, action: FavoritesAction) {
  switch (action.type) {
    case 'ADD_TO_FAVORITES': {
      const newItem = action.payload

      // Check if item already exists
      const existingItem = state.favorites.find(
        (item: FavoriteItem) => item.productId === newItem.productId
      )

      if (existingItem) {
        return state // Don't add duplicates
      }
      
      const favoriteItem: FavoriteItem = {
        ...newItem,
        id: `fav-${newItem.productId}`,
        addedAt: new Date().toISOString()
      }
      
      const updatedFavorites = [...state.favorites, favoriteItem]
      
      return {
        ...state,
        favorites: updatedFavorites,
        favoriteCount: updatedFavorites.length
      }
    }

    case 'REMOVE_FROM_FAVORITES': {
      const productId = action.payload
      const updatedFavorites = state.favorites.filter(
        (item: FavoriteItem) => item.productId !== productId
      )
      
      return {
        ...state,
        favorites: updatedFavorites,
        favoriteCount: updatedFavorites.length
      }
    }

    case 'CLEAR_FAVORITES': {
      return {
        ...state,
        favorites: [],
        favoriteCount: 0
      }
    }

    case 'LOAD_FAVORITES': {
      const favorites = action.payload
      return {
        ...state,
        favorites,
        favoriteCount: favorites.length
      }
    }

    default:
      return state
  }
}

// Create context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

// Favorites provider
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(favoritesReducer, initialState)
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (!loaded) {
      setIsHydrated(true)
      setLoaded(true)

      if (typeof window !== 'undefined') {
        const savedFavorites = localStorage.getItem('favorites')
        if (savedFavorites) {
          try {
            const favoriteItems = JSON.parse(savedFavorites)
            dispatch({ type: 'LOAD_FAVORITES', payload: favoriteItems })
          } catch (error) {
            console.error('Error loading favorites from localStorage:', error)
          }
        }
      }
    }
  }, [loaded])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(state.favorites))
    }
  }, [state.favorites, isHydrated])

  const addToFavorites = (item: Omit<FavoriteItem, 'id' | 'addedAt'>) => {
    // Only add if we're on the client side to avoid hydration issues
    if (isHydrated) {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: item })
    }
  }

  const removeFromFavorites = (productId: string) => {
    // Only remove if we're on the client side to avoid hydration issues
    if (isHydrated) {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: productId })
    }
  }

  const isFavorite = (productId: string) => {
    return state.favorites.some((item: FavoriteItem) => item.productId === productId)
  }

  const clearFavorites = () => {
    // Only clear if we're on the client side to avoid hydration issues
    if (isHydrated) {
      dispatch({ type: 'CLEAR_FAVORITES' })
    }
  }

  const value: FavoritesContextType = {
    favorites: state.favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    favoriteCount: state.favoriteCount
  }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

// Custom hook to use favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
