'use client'

import Header from '@/components/header'
import { CartSidebar } from '@/components/cart/cart-sidebar'
import { FavoritesSidebar } from '@/components/favorites/favorites-sidebar'
import { useState } from 'react'

export default function HeaderTestPage() {
  const [showFavorites, setShowFavorites] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Header 组件测试</h1>
            <p className="text-muted-foreground">
              这个页面用于测试 Header 组件是否正确显示所有图标
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h2 className="font-medium mb-2">应该显示的图标:</h2>
              <ul className="text-sm space-y-1">
                <li>✅ 搜索图标 (Search)</li>
                <li>✅ 收藏夹图标 (Heart)</li>
                <li>✅ 购物车图标 (Shopping Bag)</li>
                <li>✅ 用户账户图标 (User) 或 登录/注册按钮</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg">
              <h2 className="font-medium mb-2">功能测试:</h2>
              <div className="space-y-2">
                <button 
                  onClick={() => setShowFavorites(true)}
                  className="block w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  打开收藏夹侧边栏
                </button>
                <p className="text-sm text-muted-foreground">
                  点击右上角的购物车图标应该打开购物车侧边栏
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h2 className="font-medium mb-2">检查清单:</h2>
              <div className="text-sm space-y-1">
                <p>□ Header 组件是否正确显示？</p>
                <p>□ 所有图标是否可见？</p>
                <p>□ 购物车图标是否可点击？</p>
                <p>□ 收藏夹图标是否可点击？</p>
                <p>□ 用户登录/注册按钮是否显示？</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 侧边栏组件 */}
      <CartSidebar />
      <FavoritesSidebar isOpen={showFavorites} onClose={() => setShowFavorites(false)} />
    </div>
  )
}
