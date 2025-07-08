/**
 * OWOWLOVE.COM User Service
 * Supabase-based user data management
 */

import { supabase, supabaseAdmin } from '../supabase'
import { User, PublicUser, RegisterRequest, UpdateUserRequest } from '../types/user'
import bcrypt from 'bcryptjs'

// Public user operations
export class UserService {
  
  // Register new user
  static async registerUser(userData: RegisterRequest): Promise<{ user: PublicUser | null, error: string | null }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single()
      
      if (existingUser) {
        return { user: null, error: 'User already exists' }
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12)
      
      // Create user
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          password_hash: passwordHash,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || '',
          address: userData.address || '',
          role: 'user',
          is_active: true
        })
        .select('id, email, first_name, last_name, phone, address, role, created_at')
        .single()
      
      if (error) {
        console.error('Error creating user:', error)
        return { user: null, error: 'Failed to create user' }
      }
      
      return { user: data, error: null }
    } catch (error) {
      console.error('Registration error:', error)
      return { user: null, error: 'Registration failed' }
    }
  }
  
  // Login user
  static async loginUser(email: string, password: string): Promise<{ user: PublicUser | null, error: string | null }> {
    try {
      // Get user with password hash
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single()
      
      if (error || !user) {
        return { user: null, error: 'Invalid credentials' }
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      
      if (!isValidPassword) {
        return { user: null, error: 'Invalid credentials' }
      }
      
      // Return user without password hash
      const { password_hash, ...publicUser } = user
      return { user: publicUser, error: null }
    } catch (error) {
      console.error('Login error:', error)
      return { user: null, error: 'Login failed' }
    }
  }
  
  // Get user profile
  static async getUserProfile(userId: string): Promise<PublicUser | null> {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, address, role, created_at, updated_at')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return data
  }
  
  // Update user profile
  static async updateUserProfile(userId: string, updates: UpdateUserRequest): Promise<{ user: PublicUser | null, error: string | null }> {
    try {
      const updateData: any = {
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      // Hash new password if provided
      if (updates.password) {
        updateData.password_hash = await bcrypt.hash(updates.password, 12)
        delete updateData.password
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select('id, email, first_name, last_name, phone, address, role, created_at, updated_at')
        .single()
      
      if (error) {
        console.error('Error updating user profile:', error)
        return { user: null, error: 'Failed to update profile' }
      }
      
      return { user: data, error: null }
    } catch (error) {
      console.error('Profile update error:', error)
      return { user: null, error: 'Profile update failed' }
    }
  }
}

// Admin user operations (backend only)
export class AdminUserService {
  
  // Get all users (admin only)
  static async getAllUsers(): Promise<PublicUser[]> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, first_name, last_name, phone, address, role, is_active, created_at, updated_at')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching all users:', error)
      return []
    }
    
    return data || []
  }
  
  // Create user (admin only)
  static async createUser(userData: RegisterRequest & { role?: string }): Promise<{ user: PublicUser | null, error: string | null }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single()
      
      if (existingUser) {
        return { user: null, error: 'User already exists' }
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12)
      
      // Create user
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          email: userData.email,
          password_hash: passwordHash,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone || '',
          address: userData.address || '',
          role: userData.role || 'user',
          is_active: true
        })
        .select('id, email, first_name, last_name, phone, address, role, created_at')
        .single()
      
      if (error) {
        console.error('Error creating user:', error)
        return { user: null, error: 'Failed to create user' }
      }
      
      return { user: data, error: null }
    } catch (error) {
      console.error('User creation error:', error)
      return { user: null, error: 'User creation failed' }
    }
  }
  
  // Delete user (admin only)
  static async deleteUser(userId: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', userId)
    
    if (error) {
      console.error('Error deleting user:', error)
      return false
    }
    
    return true
  }
  
  // Toggle user active status (admin only)
  static async toggleUserStatus(userId: string): Promise<boolean> {
    // First get current status
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('is_active')
      .eq('id', userId)
      .single()
    
    if (!user) return false
    
    // Toggle status
    const { error } = await supabaseAdmin
      .from('users')
      .update({ 
        is_active: !user.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (error) {
      console.error('Error toggling user status:', error)
      return false
    }
    
    return true
  }
  
  // Get user statistics (admin only)
  static async getUserStats(): Promise<{
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
  }> {
    const { data: allUsers } = await supabaseAdmin
      .from('users')
      .select('id, is_active, created_at')
    
    if (!allUsers) {
      return { totalUsers: 0, activeUsers: 0, newUsersThisMonth: 0 }
    }
    
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    return {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => u.is_active).length,
      newUsersThisMonth: allUsers.filter(u => new Date(u.created_at) >= startOfMonth).length
    }
  }
}
