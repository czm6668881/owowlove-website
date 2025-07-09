import { createClient } from '@supabase/supabase-js'

// Supabase configuration with fallback values for deployment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zzexacrffmxmqrqamcxo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZXhhY3JmZm14bXFycWFtY3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzAxODEsImV4cCI6MjA2NzU0NjE4MX0.OjvVxog9bRc6zixbJTFp0Jgg-xzpv1ZuDKEba2-dG34'

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Create Supabase client for server-side operations (using anon key for now since RLS is disabled)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseAnonKey, // Using anon key since RLS is disabled
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' &&
         supabaseAnonKey !== 'placeholder-key'
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone?: string
          address?: string
          role: 'user' | 'admin'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string
          address?: string
          role?: 'user' | 'admin'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string
          address?: string
          role?: 'user' | 'admin'
          is_active?: boolean
          updated_at?: string
        }
      }
      products: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          images: string[]
          category_id: string
          variants: ProductVariant[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          images?: string[]
          category_id?: string
          variants?: ProductVariant[]
          is_active?: boolean
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string
          image: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          items: OrderItem[]
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: string
          payment_method: string
          payment_status: 'pending' | 'paid' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          items: OrderItem[]
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: string
          payment_method: string
          payment_status?: 'pending' | 'paid' | 'failed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          items?: OrderItem[]
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address?: string
          payment_method?: string
          payment_status?: 'pending' | 'paid' | 'failed'
          updated_at?: string
        }
      }
    }
  }
}

// Product variant interface
export interface ProductVariant {
  id: string
  color: string
  size: string
  price: number
  stock: number
}

// Order item interface
export interface OrderItem {
  product_id: string
  variant_id: string
  quantity: number
  price: number
}

// Typed Supabase client
export type SupabaseClient = typeof supabase
