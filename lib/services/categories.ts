import { supabase, supabaseAdmin } from '@/lib/supabase'

export interface Category {
  id: string
  name: string
  description: string
  image: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export class CategoryService {
  // Get all active categories
  static async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('CategoryService.getCategories error:', error)
      throw error
    }
  }

  // Get category by ID
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        console.error('Error fetching category:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('CategoryService.getCategoryById error:', error)
      throw error
    }
  }

  // Admin: Get all categories (including inactive)
  static async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all categories:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('CategoryService.getAllCategories error:', error)
      throw error
    }
  }

  // Admin: Create category
  static async createCategory(categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .insert([categoryData])
        .select()
        .single()

      if (error) {
        console.error('Error creating category:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('CategoryService.createCategory error:', error)
      throw error
    }
  }

  // Admin: Update category
  static async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>): Promise<Category> {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating category:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('CategoryService.updateCategory error:', error)
      throw error
    }
  }

  // Admin: Delete category
  static async deleteCategory(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting category:', error)
        throw error
      }
    } catch (error) {
      console.error('CategoryService.deleteCategory error:', error)
      throw error
    }
  }

  // Admin: Toggle category active status
  static async toggleCategoryStatus(id: string): Promise<Category> {
    try {
      // First get current status
      const { data: currentData, error: fetchError } = await supabaseAdmin
        .from('categories')
        .select('is_active')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching category status:', fetchError)
        throw fetchError
      }

      // Toggle the status
      const { data, error } = await supabaseAdmin
        .from('categories')
        .update({ is_active: !currentData.is_active })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error toggling category status:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('CategoryService.toggleCategoryStatus error:', error)
      throw error
    }
  }
}
