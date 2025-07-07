export interface FavoriteItem {
  id: string
  productId: string
  productName: string
  productImage: string
  price: number
  addedAt: string
}

export interface FavoritesContextType {
  favorites: FavoriteItem[]
  addToFavorites: (item: Omit<FavoriteItem, 'id' | 'addedAt'>) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
  favoriteCount: number
}
