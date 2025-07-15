'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useAdminAuth } from '@/contexts/admin-auth-context'
import { Button } from '@/components/ui/button'
import {
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Home,
  Image,
  Tags,
  MessageSquare,
  LogOut,
  CreditCard,
  Wallet
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: BarChart3,
    href: '/admin'
  },
  {
    title: 'Products',
    icon: Package,
    href: '/admin/products'
  },
  {
    title: 'Orders',
    icon: ShoppingBag,
    href: '/admin/orders'
  },
  {
    title: 'Payments',
    icon: CreditCard,
    href: '/admin/payments'
  },
  {
    title: 'Payment Methods',
    icon: Wallet,
    href: '/admin/payment-methods'
  },
  {
    title: 'Customers',
    icon: Users,
    href: '/admin/customers'
  },
  {
    title: 'Messages',
    icon: MessageSquare,
    href: '/admin/messages'
  },
  {
    title: 'Media',
    icon: Image,
    href: '/admin/media'
  },
  {
    title: 'Categories',
    icon: Tags,
    href: '/admin/categories'
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings'
  },
  {
    title: 'Test Upload',
    icon: Image,
    href: '/admin/test-upload'
  }
]

export function Sidebar() {
  const params = useParams()
  const pathname = usePathname()
  const lang = params?.lang as string || 'en'
  const { logout } = useAdminAuth()

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">OWOWLOVE</h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="px-4 space-y-1">
        <Link
          href={`/${lang}`}
          className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Back to Website</span>
        </Link>

        <div className="border-t border-gray-200 my-4"></div>

        {menuItems.map((item) => {
          const href = `/${lang}${item.href}`
          const isActive = pathname === href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-pink-100 text-pink-700 font-medium'
                  : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 space-y-3">
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>

        <div className="bg-gray-100 rounded-lg p-3">
          <p className="text-xs text-gray-600">Admin Panel v1.0</p>
          <p className="text-xs text-gray-500">Product Management System</p>
        </div>
      </div>
    </div>
  )
}
