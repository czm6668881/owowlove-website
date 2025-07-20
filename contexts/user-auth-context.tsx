'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { PublicUser, UserContextType, RegisterRequest, UpdateUserRequest, ChangePasswordRequest } from '@/lib/types/user'

const UserAuthContext = createContext<UserContextType | undefined>(undefined)

interface UserAuthProviderProps {
  children: React.ReactNode
}

export function UserAuthProvider({ children }: UserAuthProviderProps) {
  const [user, setUser] = useState<PublicUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // 检查当前路径是否需要认证
  const isProtectedRoute = (path: string) => {
    const protectedPaths = ['/en/profile', '/en/orders', '/en/account']
    return protectedPaths.some(protectedPath => path.startsWith(protectedPath))
  }

  // 检查认证状态
  const checkAuth = async () => {
    try {
      // 确保只在客户端执行
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      const token = localStorage.getItem('user_token')

      if (!token) {
        setIsAuthenticated(false)
        setUser(null)
        setIsLoading(false)

        // 如果是受保护的路由，重定向到登录页
        if (isProtectedRoute(pathname)) {
          router.push('/en/login')
        }
        return
      }

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (data.success && data.valid && data.user) {
        setIsAuthenticated(true)
        setUser(data.user)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        localStorage.removeItem('user_token')
        
        // 如果是受保护的路由，重定向到登录页
        if (isProtectedRoute(pathname)) {
          router.push('/en/login')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      setUser(null)

      // 确保只在客户端执行
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_token')
      }

      // 如果是受保护的路由，重定向到登录页
      if (isProtectedRoute(pathname)) {
        router.push('/en/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 登录
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.token && data.user) {
        // 确保只在客户端执行
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_token', data.token)
        }
        setIsAuthenticated(true)
        setUser(data.user)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  // 注册
  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (data.success && data.token && data.user) {
        // 确保只在客户端执行
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_token', data.token)
        }
        setIsAuthenticated(true)
        setUser(data.user)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  // 登出
  const logout = () => {
    // 确保只在客户端执行
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_token')
    }
    setIsAuthenticated(false)
    setUser(null)
    router.push('/')
  }

  // 更新用户信息
  const updateUser = async (updateData: UpdateUserRequest): Promise<boolean> => {
    try {
      // 确保只在客户端执行
      if (typeof window === 'undefined') return false

      const token = localStorage.getItem('user_token')
      if (!token) return false

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Update user failed:', error)
      return false
    }
  }

  // 修改密码
  const changePassword = async (passwordData: ChangePasswordRequest): Promise<boolean> => {
    try {
      // 确保只在客户端执行
      if (typeof window === 'undefined') return false

      const token = localStorage.getItem('user_token')
      if (!token) return false

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(passwordData),
      })

      const data = await response.json()
      return data.success
    } catch (error) {
      console.error('Change password failed:', error)
      return false
    }
  }

  // 初始化时检查认证状态
  useEffect(() => {
    checkAuth()
  }, [])

  // 路径变化时检查认证状态
  useEffect(() => {
    if (!isLoading && isProtectedRoute(pathname) && !isAuthenticated) {
      router.push('/en/login')
    }
  }, [pathname, isAuthenticated, isLoading])

  const value: UserContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    changePassword,
  }

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  )
}

// 自定义hook
export function useUserAuth() {
  const context = useContext(UserAuthContext)
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider')
  }
  return context
}
