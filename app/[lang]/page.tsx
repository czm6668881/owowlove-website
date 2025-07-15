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
import Header from '@/components/header'
import Footer from '@/components/footer'
import { CartSidebar } from '@/components/cart/cart-sidebar'
import { FavoritesSidebar } from '@/components/favorites/favorites-sidebar'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  rating?: number
  inStock?: boolean
  description?: string
  images?: string[]
  variants?: Array<{
    id: string
    size: string
    color: string
    price: number
    stock: number
  }>
  is_active?: boolean
}

export default function MainPage() {
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
        

        
        const response = await fetch('/api/products', {
          headers: {
            'Cache-Control': 'no-cache',
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        
        if (result.success && Array.isArray(result.data)) {
          // 转换数据格式
          const formattedProducts: Product[] = result.data.map((item: any) => {
            // 处理图片URL，避免重复路径
            let imageUrl = '/placeholder.jpg'
            if (Array.isArray(item.images) && item.images.length > 0) {
              const firstImage = item.images[0]
              if (typeof firstImage === 'string') {
                // 如果已经包含/api/image/，直接使用
                if (firstImage.startsWith('/api/image/')) {
                  imageUrl = firstImage
                } else {
                  // 否则添加前缀
                  imageUrl = `/api/image/${firstImage}`
                }
              }
            }

            return {
              id: item.id,
              name: item.name || 'Unnamed Product',
              price: item.price || 0,
              image: imageUrl,
              category: item.category?.name || 'Uncategorized',
              rating: 4.5,
              inStock: true,
              description: item.description,
              images: item.images,
              variants: item.variants,
              is_active: item.is_active
            }
          })
          
          // 只显示激活的产品
          const activeProducts = formattedProducts.filter(p => p.is_active)
          setProducts(activeProducts)

        } else {
          setProducts([])
        }
      } catch (error) {
        setError('加载产品失败，请稍后重试')
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
      <Header />

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
                      {product.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      )}
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


        </div>
      </main>

      <Footer />
      <CartSidebar />
      <FavoritesSidebar />
    </div>
  )
}
