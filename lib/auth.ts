import { supabase, isSupabaseConfigured } from './supabase'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, userData: {
    firstName: string
    lastName: string
    phone?: string
    address?: string
  }): Promise<AuthResponse> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Database not configured' }
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            address: userData.address
          }
        }
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user' }
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          address: userData.address,
          role: 'user',
          is_active: true
        })

      if (profileError) {
        return { success: false, error: profileError.message }
      }

      const user: User = {
        id: authData.user.id,
        email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: userData.address,
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      return { success: true, user }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    }
  }

  // Sign in user
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Database not configured' }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'Login failed' }
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        return { success: false, error: 'Failed to load user profile' }
      }

      const user: User = {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        address: profile.address,
        role: profile.role,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }

      return { success: true, user }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  // Sign out user
  static async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: true } // Allow logout even if not configured
      }

      const { error } = await supabase.auth.signOut()
      
      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'Logout failed' }
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      if (!isSupabaseConfigured()) {
        return null
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return null
      }

      // Get user profile
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error || !profile) {
        return null
      }

      return {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        phone: profile.phone,
        address: profile.address,
        role: profile.role,
        isActive: profile.is_active,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      }
    } catch (error) {
      return null
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updates: Partial<{
    firstName: string
    lastName: string
    phone: string
    address: string
  }>): Promise<AuthResponse> {
    try {
      if (!isSupabaseConfigured()) {
        return { success: false, error: 'Database not configured' }
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          first_name: updates.firstName,
          last_name: updates.lastName,
          phone: updates.phone,
          address: updates.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      const user: User = {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone,
        address: data.address,
        role: data.role,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }

      return { success: true, user }
    } catch (error) {
      return { success: false, error: 'Profile update failed' }
    }
  }
}
