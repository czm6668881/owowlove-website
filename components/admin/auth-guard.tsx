'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminAuth } from '@/contexts/admin-auth-context'
import { Shield, Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAdminAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Don't protect the login page itself
  const isLoginPage = pathname?.includes('/admin/login')

  useEffect(() => {
    // If not loading, not authenticated, and not on login page, redirect to login
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/en/admin/login')
    }
  }, [isAuthenticated, isLoading, router, isLoginPage])

  // If on login page, always render children (no protection needed)
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-pink-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-pink-600" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null
  }

  // If authenticated, render the protected content
  return <>{children}</>
}
