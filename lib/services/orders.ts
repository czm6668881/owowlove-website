import { supabase, supabaseAdmin } from '@/lib/supabase'

export interface OrderItem {
  product_id: string
  variant_id: string
  quantity: number
  price: number
}

export interface GuestInfo {
  first_name: string
  last_name: string
  email: string
  phone: string
}

export interface Order {
  id: string
  user_id?: string | null
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shipping_address: string
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed'
  guest_info?: GuestInfo | null
  created_at: string
  updated_at: string
}

export interface OrderWithDetails extends Order {
  user?: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
}

export class OrderService {
  // Get user's orders
  static async getUserOrders(): Promise<Order[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user orders:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('OrderService.getUserOrders error:', error)
      throw error
    }
  }

  // Get order by ID
  static async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        console.error('Error fetching order:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('OrderService.getOrderById error:', error)
      throw error
    }
  }

  // Create new order (supports both authenticated users and guests)
  static async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // For guest orders, user_id can be null
      const insertData = {
        ...orderData,
        user_id: user?.id || null
      }

      // Use admin client for guest orders since they don't have authentication
      const client = user ? supabase : supabaseAdmin

      const { data, error } = await client
        .from('orders')
        .insert([insertData])
        .select()
        .single()

      if (error) {
        console.error('Error creating order:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('OrderService.createOrder error:', error)
      throw error
    }
  }

  // Update order status (user can only update certain statuses)
  static async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Users can only cancel their own pending orders
      if (status === 'cancelled') {
        const { data, error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', id)
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .select()
          .single()

        if (error) {
          console.error('Error updating order status:', error)
          throw error
        }

        return data
      } else {
        throw new Error('Users can only cancel pending orders')
      }
    } catch (error) {
      console.error('OrderService.updateOrderStatus error:', error)
      throw error
    }
  }

  // Admin: Get all orders
  static async getAllOrders(): Promise<OrderWithDetails[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          user:users(id, email, first_name, last_name)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all orders:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('OrderService.getAllOrders error:', error)
      throw error
    }
  }

  // Admin: Get order by ID (with user details)
  static async getOrderByIdAdmin(id: string): Promise<OrderWithDetails | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          user:users(id, email, first_name, last_name)
        `)
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        console.error('Error fetching order (admin):', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('OrderService.getOrderByIdAdmin error:', error)
      throw error
    }
  }

  // Admin: Update order
  static async updateOrder(id: string, updates: Partial<Omit<Order, 'id' | 'user_id' | 'created_at' | 'updated_at'>>): Promise<Order> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating order (admin):', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('OrderService.updateOrder error:', error)
      throw error
    }
  }

  // Admin: Delete order
  static async deleteOrder(id: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting order:', error)
        throw error
      }
    } catch (error) {
      console.error('OrderService.deleteOrder error:', error)
      throw error
    }
  }

  // Get orders by status
  static async getOrdersByStatus(status: Order['status']): Promise<OrderWithDetails[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          user:users(id, email, first_name, last_name)
        `)
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders by status:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('OrderService.getOrdersByStatus error:', error)
      throw error
    }
  }
}
