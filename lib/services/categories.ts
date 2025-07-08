/**
 * OWOWLOVE.COM Category Service
 * Supabase-based category data management
 */

import { supabase, supabaseAdmin } from '../supabase'
import { Category } from '../types/category'

// Public category operations (frontend accessible)
export class CategoryService {
  
  // Get all active categories (public)
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }
    
    return data || []
  }
  
  // Get category by ID (public)
  static async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    
    if (error) {
      console.error('Error fetching category:', error)
      return null
    }
    
    return data
  }
  
  // Get category by slug (public)
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    // Convert slug back to name for lookup
    const name = slug.replace(/-/g, ' ')
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .ilike('name', name)
      .eq('is_active', true)
      .single()
    
    if (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }
    
    return data
  }
}

// Admin category operations (backend only)
export class AdminCategoryService {
  
  // Get all categories including inactive (admin only)
  static async getAllCategories(): Promise<Category[]> {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) {
      console.error('Error fetching all categories:', error)
      return []
    }
    
    return data || []
  }
  
  // Create new category (admin only)
  static async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({
        ...category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating category:', error)
      return null
    }
    
    return data
  }
  
  // Update category (admin only)
  static async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating category:', error)
      return null
    }
    
    return data
  }
  
  // Delete category (admin only)
  static async deleteCategory(id: string): Promise<boolean> {
    // Check if category has products
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('category_id', id)
      .limit(1)
    
    if (products && products.length > 0) {
      console.error('Cannot delete category with products')
      return false
    }
    
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting category:', error)
      return false
    }
    
    return true
  }
  
  // Toggle category active status (admin only)
  static async toggleCategoryStatus(id: string): Promise<boolean> {
    // First get current status
    const { data: category } = await supabaseAdmin
      .from('categories')
      .select('is_active')
      .eq('id', id)
      .single()
    
    if (!category) return false
    
    // Toggle status
    const { error } = await supabaseAdmin
      .from('categories')
      .update({ 
        is_active: !category.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      console.error('Error toggling category status:', error)
      return false
    }
    
    return true
  }
  
  // Get category statistics (admin only)
  static async getCategoryStats(id: string): Promise<{
    totalProducts: number
    activeProducts: number
  }> {
    const { data: allProducts } = await supabaseAdmin
      .from('products')
      .select('id, is_active')
      .eq('category_id', id)
    
    if (!allProducts) {
      return { totalProducts: 0, activeProducts: 0 }
    }
    
    return {
      totalProducts: allProducts.length,
      activeProducts: allProducts.filter(p => p.is_active).length
    }
  }
}
