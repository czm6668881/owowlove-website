'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Search, Heart, ShoppingBag, User, LogOut, Settings, Package } from 'lucide-react'
import { useUserAuth } from '@/contexts/user-auth-context'
import { CartIcon } from '@/components/cart/cart-icon'
import { FavoritesIcon } from '@/components/favorites/favorites-icon'

interface HeaderProps {
  onOpenFavorites?: () => void
}

export default function Header({ onOpenFavorites }: HeaderProps) {
  const { user, isAuthenticated, logout } = useUserAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link href="/en" className="text-xl md:text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors">
              OWOWLOVE
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/en" className="text-gray-700 hover:text-pink-600 transition-colors">
                Cosplay
              </Link>
              <Link href="/en/track-order" className="text-gray-700 hover:text-pink-600 transition-colors">
                Track Order
              </Link>
              <Link href="/en/contact" className="text-gray-700 hover:text-pink-600 transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Button */}
            <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
              <Search className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            {/* Favorites */}
            <FavoritesIcon onClick={onOpenFavorites} />

            {/* Shopping Cart */}
            <CartIcon />

            {/* User Account */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                    <User className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/en/profile" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/en/orders" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/en/favorites" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      My Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/en/login">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/en/register">
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
