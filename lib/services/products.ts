import { supabase, supabaseAdmin } from '@/lib/supabase'

export interface ProductVariant {
  id: string
  color: string
  size: string
  price: number
  stock: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category_id: string
  variants: ProductVariant[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ProductWithCategory extends Product {
  category?: {
    id: string
    name: string
    description: string
    image: string
  }
}

export class ProductService {
  // Get all active products
  static async getProducts(): Promise<ProductWithCategory[]> {
    try {
      console.log('🔍 ProductService.getProducts called')
      console.log('🔧 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...')

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, description, image)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      console.log('📊 Raw query result:', { data: data?.length, error })

      if (error) {
        console.error('❌ Error fetching products:', error)
        throw error
      }

      console.log('✅ Active products fetched successfully:', data?.length || 0)
      if (data && data.length > 0) {
        console.log('📋 First product details:', {
          id: data[0].id,
          name: data[0].name,
          is_active: data[0].is_active,
          images_count: data[0].images?.length || 0,
          variants_count: data[0].variants?.length || 0
        })
      }
      return data || []
    } catch (error) {
      console.error('💥 ProductService.getProducts error:', error)
      throw error
    }
  }

  // Get products by category
  static async getProductsByCategory(categoryId: string): Promise<ProductWithCategory[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, description, image)
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products by category:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('ProductService.getProductsByCategory error:', error)
      throw error
    }
  }

  // Get product by ID
  static async getProductById(id: string): Promise<ProductWithCategory | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, description, image)
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        console.error('Error fetching product:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('ProductService.getProductById error:', error)
      throw error
    }
  }

  // Search products
  static async searchProducts(query: string): Promise<ProductWithCategory[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(id, name, description, image)
        `)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('ProductService.searchProducts error:', error)
      throw error
    }
  }

  // Admin: Get all products (including inactive)
  static async getAllProducts(): Promise<ProductWithCategory[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select(`
          *,
          category:categories(id, name, description, image)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all products:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('ProductService.getAllProducts error:', error)
      throw error
    }
  }

  // Admin: Create product
  static async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert([productData])
        .select()
        .single()

      if (error) {
        console.error('Error creating product:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('ProductService.createProduct error:', error)
      throw error
    }
  }

  // Admin: Update product
  static async updateProduct(id: string, updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<Product> {
    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating product:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('ProductService.updateProduct error:', error)
      throw error
    }
  }

  // Admin: Delete product
  static async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        throw error
      }
    } catch (error) {
      console.error('ProductService.deleteProduct error:', error)
      throw error
    }
  }

  // Admin: Toggle product active status
  static async toggleProductStatus(id: string): Promise<Product> {
    try {
      // First get current status
      const { data: currentData, error: fetchError } = await supabaseAdmin
        .from('products')
        .select('is_active')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching product status:', fetchError)
        throw fetchError
      }

      // Toggle the status
      const { data, error } = await supabaseAdmin
        .from('products')
        .update({ is_active: !currentData.is_active })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error toggling product status:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('ProductService.toggleProductStatus error:', error)
      throw error
    }
  }
}
