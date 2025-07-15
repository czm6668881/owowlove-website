'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Heart, Search, User } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'

// 模拟产品数据
const mockProducts = [
  {
    id: '1',
    name: 'Egyptian Queen Cat',
    price: 89.99,
    image: '/api/image/product-1752080189101.jpeg',
    category: 'Cosplay'
  },
  {
    id: '2', 
    name: 'Anime Character Costume',
    price: 129.99,
    image: '/api/image/product-1752068376427.jpg',
    category: 'Cosplay'
  },
  {
    id: '3',
    name: 'Fantasy Warrior Outfit',
    price: 159.99,
    image: '/api/image/product-1752312776393.jpeg',
    category: 'Fantasy'
  },
  {
    id: '4',
    name: 'Magical Girl Costume',
    price: 99.99,
    image: '/api/image/product-1752401587935.jpeg',
    category: 'Anime'
  }
]

export default function FastPage() {
  const [mounted, setMounted] = useState(false)
  const { cart, addToCart, openCart } = useCart()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      variantId: `${product.id}-default`,
      productName: product.name,
      productImage: product.image,
      size: 'One Size',
      color: 'Default',
      price: product.price,
      sku: `${product.id}-default`
    })
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 简化的Header */}
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
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-sm">
                  登录
                </Button>
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white text-sm">
                  注册
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* 标题 */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              Sexy Cosplay
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Premium sexy cosplay costumes for women and girls. Discover our exclusive collection of animal costumes, bunny outfits, and fantasy cosplay designs with worldwide shipping.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">快速发货</Badge>
              <Badge variant="secondary">高品质材料</Badge>
              <Badge variant="secondary">定制服务</Badge>
            </div>
          </div>

          {/* 产品网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-medium text-sm line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-pink-600">
                        ${product.price}
                      </span>
                      <Button
                        size="sm"
                        className="bg-pink-600 hover:bg-pink-700"
                        onClick={() => handleAddToCart(product)}
                      >
                        加入购物车
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 状态信息 */}
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg inline-block">
              <p className="text-green-800 font-medium">✅ 快速加载版本</p>
              <p className="text-green-600 text-sm">
                购物车商品: {cart.itemCount} | 总金额: ${cart.total.toFixed(2)}
              </p>
            </div>
            
            <div className="space-x-4">
              <a href="/en" className="text-blue-600 hover:underline">
                → 完整版主页
              </a>
              <a href="/en/stripe-test" className="text-blue-600 hover:underline">
                → Stripe 测试
              </a>
              <a href="/en/simple" className="text-blue-600 hover:underline">
                → 简单测试页
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* 简化的Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-pink-600">OWOWLOVE</div>
            <p className="text-gray-600">Premium Cosplay Costumes</p>
            <p className="text-sm text-gray-500">
              © 2025 OWOWLOVE. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
