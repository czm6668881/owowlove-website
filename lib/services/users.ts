import { supabase, supabaseAdmin } from '@/lib/supabase'

export interface User {
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

export class UserService {
  // Get current user profile
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return null
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        console.error('Error fetching current user:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('UserService.getCurrentUser error:', error)
      throw error
    }
  }

  // Update user profile
  static async updateProfile(updates: Partial<Omit<User, 'id' | 'email' | 'role' | 'created_at' | 'updated_at'>>): Promise<User> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('UserService.updateProfile error:', error)
      throw error
    }
  }

  // Admin: Get all users
  static async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all users:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('UserService.getAllUsers error:', error)
      throw error
    }
  }

  // Admin: Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        console.error('Error fetching user by ID:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('UserService.getUserById error:', error)
      throw error
    }
  }

  // Admin: Update user
  static async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating user:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('UserService.updateUser error:', error)
      throw error
    }
  }

  // Admin: Delete user
  static async deleteUser(id: string): Promise<void> {
    try {
      // Delete from auth.users (this will cascade to public.users)
      const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)
      
      if (authError) {
        console.error('Error deleting user from auth:', authError)
        throw authError
      }

      // Also delete from public.users table if it still exists
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id)

      if (dbError && dbError.code !== 'PGRST116') {
        console.error('Error deleting user from database:', dbError)
        // Don't throw here as the auth deletion was successful
      }
    } catch (error) {
      console.error('UserService.deleteUser error:', error)
      throw error
    }
  }

  // Admin: Toggle user active status
  static async toggleUserStatus(id: string): Promise<User> {
    try {
      // First get current status
      const { data: currentData, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('is_active')
        .eq('id', id)
        .single()

      if (fetchError) {
        console.error('Error fetching user status:', fetchError)
        throw fetchError
      }

      // Toggle the status
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({ is_active: !currentData.is_active })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error toggling user status:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('UserService.toggleUserStatus error:', error)
      throw error
    }
  }

  // Admin: Change user role
  static async changeUserRole(id: string, role: 'user' | 'admin'): Promise<User> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({ role })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error changing user role:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('UserService.changeUserRole error:', error)
      throw error
    }
  }

  // Check if user is admin
  static async isAdmin(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser()
      return user?.role === 'admin' && user?.is_active === true
    } catch (error) {
      console.error('UserService.isAdmin error:', error)
      return false
    }
  }
}
