'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface AdminAuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if current path is admin-related but not login page
  const isAdminPath = pathname?.includes('/admin') && !pathname?.includes('/admin/login')
  const isLoginPage = pathname?.includes('/admin/login')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token')

      if (!token) {
        setIsAuthenticated(false)
        setIsLoading(false)
        // Don't redirect if already on login page
        if (isAdminPath && !isLoginPage) {
          router.push('/en/admin/login')
        }
        return
      }

      const response = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (data.success && data.valid) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        localStorage.removeItem('admin_token')
        // Don't redirect if already on login page
        if (isAdminPath && !isLoginPage) {
          router.push('/en/admin/login')
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      localStorage.removeItem('admin_token')
      // Don't redirect if already on login page
      if (isAdminPath && !isLoginPage) {
        router.push('/en/admin/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem('admin_token', data.token)
        setIsAuthenticated(true)
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    router.push('/en/admin/login')
  }

  return (
    <AdminAuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
