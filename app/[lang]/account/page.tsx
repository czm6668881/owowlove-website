'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  CreditCard, 
  MapPin, 
  Bell,
  ShoppingBag,
  Calendar,
  Mail,
  Phone
} from 'lucide-react'
import { useUserAuth } from '@/contexts/user-auth-context'
import { useCart } from '@/contexts/cart-context'
import { useFavorites } from '@/contexts/favorites-context'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AccountPage() {
  const { user, isAuthenticated, isLoading } = useUserAuth()
  const { items } = useCart()
  const { favorites } = useFavorites()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const quickActions = [
    {
      title: 'Profile Settings',
      description: 'Update your personal information',
      icon: Settings,
      href: '/en/profile',
      color: 'bg-blue-500'
    },
    {
      title: 'My Orders',
      description: 'Track your orders and purchase history',
      icon: Package,
      href: '/en/orders',
      color: 'bg-green-500'
    },
    {
      title: 'My Favorites',
      description: 'View your saved products',
      icon: Heart,
      href: '/en/favorites',
      color: 'bg-pink-500',
      badge: favorites.length > 0 ? favorites.length : undefined
    },
    {
      title: 'Shopping Cart',
      description: 'Complete your pending purchases',
      icon: ShoppingBag,
      href: '/en',
      color: 'bg-purple-500',
      badge: items.length > 0 ? items.length : undefined
    }
  ]

  const accountStats = [
    {
      label: 'Total Orders',
      value: '2',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      label: 'Favorite Items',
      value: favorites.length.toString(),
      icon: Heart,
      color: 'text-pink-600'
    },
    {
      label: 'Cart Items',
      value: items.length.toString(),
      icon: ShoppingBag,
      color: 'text-purple-600'
    },
    {
      label: 'Member Since',
      value: new Date(user.createdAt).getFullYear().toString(),
      icon: Calendar,
      color: 'text-green-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your account and track your orders
            </p>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {accountStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Manage your account and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <Link key={index} href={action.href}>
                        <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                              <action.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-medium text-gray-900">{action.title}</h3>
                                {action.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {action.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest account activity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Package className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Order #ORD-002 shipped</p>
                        <p className="text-xs text-gray-600">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Heart className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Added 3 items to favorites</p>
                        <p className="text-xs text-gray-600">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Profile updated</p>
                        <p className="text-xs text-gray-600">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Account Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-gray-600">Full Name</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-gray-600">Email Address</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{user.phone}</p>
                        <p className="text-sm text-gray-600">Phone Number</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">Member Since</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Order updates & promotions</p>
                      </div>
                    </div>
                    <Badge variant={user.preferences.emailNotifications ? "default" : "secondary"}>
                      {user.preferences.emailNotifications ? "On" : "Off"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Currency</p>
                        <p className="text-sm text-gray-600">Preferred currency</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {user.preferences.currency}
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <Link href="/en/profile">
                      <Button variant="outline" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage Preferences
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
