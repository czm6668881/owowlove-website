import { supabase } from '@/lib/supabase'

export interface Favorite {
  id: string
  user_id: string
  product_id: string
  created_at: string
}

export interface FavoriteWithProduct extends Favorite {
  product?: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    category_id: string
    variants: any[]
    is_active: boolean
  }
}

export class FavoriteService {
  // Get user's favorites
  static async getUserFavorites(): Promise<FavoriteWithProduct[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          product:products(
            id,
            name,
            description,
            price,
            images,
            category_id,
            variants,
            is_active
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user favorites:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('FavoriteService.getUserFavorites error:', error)
      throw error
    }
  }

  // Check if product is favorited by user
  static async isFavorited(productId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return false
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return false // No rows found
        }
        console.error('Error checking if favorited:', error)
        throw error
      }

      return !!data
    } catch (error) {
      console.error('FavoriteService.isFavorited error:', error)
      return false
    }
  }

  // Add product to favorites
  static async addToFavorites(productId: string): Promise<Favorite> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Check if already favorited
      const isAlreadyFavorited = await this.isFavorited(productId)
      if (isAlreadyFavorited) {
        throw new Error('Product is already in favorites')
      }

      const { data, error } = await supabase
        .from('favorites')
        .insert([{
          user_id: user.id,
          product_id: productId
        }])
        .select()
        .single()

      if (error) {
        console.error('Error adding to favorites:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('FavoriteService.addToFavorites error:', error)
      throw error
    }
  }

  // Remove product from favorites
  static async removeFromFavorites(productId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

      if (error) {
        console.error('Error removing from favorites:', error)
        throw error
      }
    } catch (error) {
      console.error('FavoriteService.removeFromFavorites error:', error)
      throw error
    }
  }

  // Toggle favorite status
  static async toggleFavorite(productId: string): Promise<boolean> {
    try {
      const isCurrentlyFavorited = await this.isFavorited(productId)
      
      if (isCurrentlyFavorited) {
        await this.removeFromFavorites(productId)
        return false
      } else {
        await this.addToFavorites(productId)
        return true
      }
    } catch (error) {
      console.error('FavoriteService.toggleFavorite error:', error)
      throw error
    }
  }

  // Get favorite count for a product
  static async getFavoriteCount(productId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId)

      if (error) {
        console.error('Error getting favorite count:', error)
        throw error
      }

      return count || 0
    } catch (error) {
      console.error('FavoriteService.getFavoriteCount error:', error)
      return 0
    }
  }

  // Clear all favorites for user
  static async clearAllFavorites(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)

      if (error) {
        console.error('Error clearing all favorites:', error)
        throw error
      }
    } catch (error) {
      console.error('FavoriteService.clearAllFavorites error:', error)
      throw error
    }
  }
}
