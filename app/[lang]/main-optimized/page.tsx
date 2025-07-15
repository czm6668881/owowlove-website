'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Star,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useFavorites } from '@/contexts/favorites-context'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  rating?: number
  inStock?: boolean
}

export default function OptimizedMainPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  const { cart, addToCart, openCart } = useCart()
  const { addToFavorites, isFavorite } = useFavorites()

  // 客户端挂载检查
  useEffect(() => {
    setMounted(true)
  }, [])

  // 获取产品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 添加超时控制
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // 8秒超时
        

        
        const response = await fetch('/api/products', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
          }
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        
        if (result.success && Array.isArray(result.data)) {
          // 转换数据格式
          const formattedProducts: Product[] = result.data.map((item: any) => ({
            id: item.id,
            name: item.name || 'Unnamed Product',
            price: item.price || 0,
            image: Array.isArray(item.images) && item.images.length > 0 
              ? `/api/image/${item.images[0]}` 
              : '/placeholder.jpg',
            category: item.category?.name || 'Uncategorized',
            rating: 4.5,
            inStock: true
          }))
          
          setProducts(formattedProducts)
        } else {
          setProducts([])
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          setError('请求超时，请刷新页面重试')
        } else {
          setError('加载产品失败，请稍后重试')
        }
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchProducts()
    }
  }, [mounted])

  const handleAddToCart = (product: Product) => {
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

  const handleAddToFavorites = (product: Product) => {
    addToFavorites({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.price
    })
  }

  const handleRetry = () => {
    window.location.reload()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-pink-600" />
          <p className="text-gray-600">正在初始化...</p>
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
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                <Search className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-10 md:w-10">
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={openCart} className="relative h-8 w-8 md:h-10 md:w-10">
                <ShoppingBag className="h-4 w-4 md:h-5 md:w-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                    {cart.itemCount > 99 ? '99+' : cart.itemCount}
                  </span>
                )}
              </Button>

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

          {/* 状态显示 */}
          <div className="text-center">
            {loading && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-pink-600" />
                <span className="text-gray-600">正在加载产品...</span>
              </div>
            )}

            {error && (
              <Alert className="max-w-md mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button size="sm" onClick={handleRetry} className="ml-2">
                    重试
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {!loading && !error && products.length === 0 && (
              <Alert className="max-w-md mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  暂无产品数据
                </AlertDescription>
              </Alert>
            )}

            {!loading && !error && products.length > 0 && (
              <Alert className="max-w-md mx-auto">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  已加载 {products.length} 个产品
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* 产品网格 */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden rounded-t-lg relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => handleAddToFavorites(product)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                      <h3 className="font-medium text-sm line-clamp-2">
                        {product.name}
                      </h3>
                      {product.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{product.rating}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-pink-600">
                          ${product.price}
                        </span>
                        <Button
                          size="sm"
                          className="bg-pink-600 hover:bg-pink-700"
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? '加入购物车' : '缺货'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 导航链接 */}
          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg inline-block">
              <p className="text-blue-800 font-medium">🚀 优化版主页</p>
              <p className="text-blue-600 text-sm">
                购物车商品: {cart.itemCount} | 总金额: ${cart.total.toFixed(2)}
              </p>
            </div>
            
            <div className="space-x-4">
              <a href="/en/fast" className="text-blue-600 hover:underline">
                → 快速版主页
              </a>
              <a href="/en/simple" className="text-blue-600 hover:underline">
                → 简单测试页
              </a>
              <a href="/en/performance" className="text-blue-600 hover:underline">
                → 性能监控
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
