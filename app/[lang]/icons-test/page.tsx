'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Heart, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useFavorites } from '@/contexts/favorites-context'
import { useUserAuth } from '@/contexts/user-auth-context'

export default function IconsTestPage() {
  const [mounted, setMounted] = useState(false)
  const { cart, openCart } = useCart()
  const { favoriteCount } = useFavorites()
  const { user, isAuthenticated } = useUserAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 简单的Header测试 */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-xl md:text-2xl font-bold text-pink-600">
              OWOWLOVE
            </div>

            {/* 右侧图标 */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* 搜索 */}
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              {/* 收藏夹 */}
              <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-10 md:w-10">
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                    {favoriteCount > 99 ? '99+' : favoriteCount}
                  </span>
                )}
              </Button>

              {/* 购物车 */}
              <Button variant="ghost" size="icon" onClick={openCart} className="relative h-8 w-8 md:h-10 md:w-10">
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                  </span>
                )}
              </Button>

              {/* 用户 */}
              {isAuthenticated && user ? (
                <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Sign In
                  </Button>
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white text-sm">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">图标测试页面</h1>
            <p className="text-muted-foreground">
              这个页面直接实现了Header图标，用于测试功能
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h2 className="font-medium mb-2">上下文状态:</h2>
              <div className="text-sm space-y-1">
                <p>购物车商品数量: {cart.itemCount}</p>
                <p>收藏夹数量: {favoriteCount}</p>
                <p>用户认证状态: {isAuthenticated ? '已登录' : '未登录'}</p>
                <p>用户信息: {user ? `${user.firstName} ${user.lastName}` : '无'}</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h2 className="font-medium mb-2">测试按钮:</h2>
              <div className="space-y-2">
                <Button onClick={openCart} className="w-full">
                  打开购物车 (当前: {cart.itemCount} 件商品)
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h2 className="font-medium mb-2">说明:</h2>
              <div className="text-sm space-y-1">
                <p>如果您能看到上方Header中的图标，说明组件工作正常</p>
                <p>如果主页面的Header没有图标，可能是组件导入或渲染问题</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
