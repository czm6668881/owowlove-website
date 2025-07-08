/**
 * OWOWLOVE.COM Product Service
 * Supabase-based product data management
 */

import { supabase, supabaseAdmin } from '../supabase'
import { Product } from '../types/product'

// Public product operations (frontend accessible)
export class ProductService {
  
  // Get all active products (public)
  static async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching products:', error)
      return []
    }
    
    return data || []
  }
  
  // Get product by ID (public)
  static async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()
    
    if (error) {
      console.error('Error fetching product:', error)
      return null
    }
    
    return data
  }
  
  // Get products by category (public)
  static async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
    
    return data || []
  }
  
  // Search products (public)
  static async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error searching products:', error)
      return []
    }
    
    return data || []
  }
}

// Admin product operations (backend only)
export class AdminProductService {
  
  // Get all products including inactive (admin only)
  static async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          description
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all products:', error)
      return []
    }
    
    return data || []
  }
  
  // Create new product (admin only)
  static async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating product:', error)
      return null
    }
    
    return data
  }
  
  // Update product (admin only)
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating product:', error)
      return null
    }
    
    return data
  }
  
  // Delete product (admin only)
  static async deleteProduct(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting product:', error)
      return false
    }
    
    return true
  }
  
  // Toggle product active status (admin only)
  static async toggleProductStatus(id: string): Promise<boolean> {
    // First get current status
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('is_active')
      .eq('id', id)
      .single()
    
    if (!product) return false
    
    // Toggle status
    const { error } = await supabaseAdmin
      .from('products')
      .update({ 
        is_active: !product.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      console.error('Error toggling product status:', error)
      return false
    }
    
    return true
  }
}
