"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "@/hooks/use-translations"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Search, Filter, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CartIcon } from '@/components/cart/cart-icon'
import { CartSidebar } from '@/components/cart/cart-sidebar'
import { useCart } from '@/contexts/cart-context'
import { FavoritesIcon } from '@/components/favorites/favorites-icon'
import { FavoritesSidebar } from '@/components/favorites/favorites-sidebar'
import { FavoriteButton } from '@/components/favorites/favorite-button'
import { useFavorites } from '@/contexts/favorites-context'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { CategoryNavigation } from '@/components/category-navigation'
import { ProductListImage } from '@/components/product/product-image'


interface FrontendProduct {
  id: string
  name: string
  description: string
  price: number
  images: string[] | Array<{
    id: string
    url: string
    alt: string
    isPrimary: boolean
    order: number
  }>
  category_id: string
  variants: Array<{
    id: string
    size: string
    color: string
    price: number
    stock: number
  }>
  is_active: boolean
  created_at: string
  updated_at: string
  category?: {
    id: string
    name: string
    description: string
    image: string
  }
}

// 产品数据现在从API获取


export default function LingerieStore() {
  const { t } = useTranslations()
  const { addToCart } = useCart()
  const { favoriteCount } = useFavorites()

  const [sortBy, setSortBy] = useState("featured")
  const [filterSize, setFilterSize] = useState("all")
  const [filterColor, setFilterColor] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<FrontendProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // 简化过滤逻辑 - 显示所有激活的产品
  const filteredProducts = products.filter((product) => {
    return product && product.is_active === true
  })

  // 获取产品的主图片
  const getProductImage = (product: FrontendProduct): string => {
    if (!product.images || product.images.length === 0) {
      return '/placeholder.svg'
    }

    // 检查是否为字符串数组格式（Supabase格式）
    if (typeof product.images[0] === 'string') {
      let imageUrl = product.images[0] as string

      // 处理损坏的JSON数据
      if (imageUrl.includes('"url":')) {
        try {
          const urlMatch = imageUrl.match(/"url":"([^"]+)"/);
          if (urlMatch) {
            imageUrl = urlMatch[1]
          }
        } catch (e) {
          console.error('Failed to extract URL from corrupted data:', e)
          return '/placeholder.svg'
        }
      }

      // 清理URL - 移除所有异常字符
      imageUrl = imageUrl
        .trim()                                    // 移除首尾空格
        .replace(/['"(){}[\]]/g, '')              // 移除引号和括号
        .replace(/\s+/g, '')                      // 移除所有空格
        .replace(/\0/g, '')                       // 移除null字符

      // 移除文件扩展名后的多余字符（如 .jpeg1 -> .jpeg）
      imageUrl = imageUrl.replace(/(\.(jpg|jpeg|png|gif|webp))[^a-zA-Z]*$/i, '$1')

      // 环境感知的URL格式处理
      if (!imageUrl.startsWith('http')) {
        let filename = ''

        // 提取文件名
        if (imageUrl.startsWith('/uploads/') || imageUrl.startsWith('/product-images/')) {
          filename = imageUrl.split('/').pop() || ''
        } else if (!imageUrl.startsWith('/')) {
          filename = imageUrl
        } else {
          filename = imageUrl.split('/').pop() || ''
        }

        // 确保文件名有效
        if (filename) {
          // 生产环境优化：使用API路由，它会自动处理备用方案
          imageUrl = `/api/image/${filename}`
        } else {
          console.warn('Could not extract filename from image URL:', imageUrl)
          return '/placeholder.svg'
        }
      }

      return imageUrl
    }

    // 检查是否为对象数组格式（文件系统格式）
    const imageObjects = product.images as Array<{
      id: string
      url: string
      alt: string
      isPrimary: boolean
      order: number
    }>

    // 优先返回主图片
    const primaryImage = imageObjects.find(img => img.isPrimary)
    if (primaryImage) {
      return primaryImage.url
    }

    // 如果没有主图片，返回第一张图片
    return imageObjects[0]?.url || '/placeholder.svg'
  }

  // 获取产品价格范围
  const getProductPriceRange = (product: FrontendProduct) => {
    // 如果没有variants，使用产品的基础价格
    if (!product.variants || product.variants.length === 0) {
      return { minPrice: product.price, maxPrice: product.price }
    }

    const prices = product.variants.map(v => v.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    return { minPrice, maxPrice }
  }

  // 获取产品的尺寸和颜色
  const getProductOptions = (product: FrontendProduct) => {
    // 如果没有variants，返回默认选项
    if (!product.variants || product.variants.length === 0) {
      return { sizes: ['One Size'], colors: ['Default'] }
    }

    const sizes = [...new Set(product.variants.map(v => v.size))]
    const colors = [...new Set(product.variants.map(v => v.color))]
    return { sizes, colors }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-50 to-rose-50 py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{t('hero.title')}</h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">{t('hero.subtitle')}</p>
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryNavigation />

      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div>
              <h3 className="font-semibold mb-3">{t('filters.search')}</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">{t('filters.size')}</h3>
              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.allSizes')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allSizes')}</SelectItem>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-semibold mb-3">{t('filters.color')}</h3>
              <Select value={filterColor} onValueChange={setFilterColor}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filters.allColors')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.allColors')}</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3 sm:gap-0">
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-sm text-gray-600">{filteredProducts.length} {t('products.count')}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {t('filters.filters')}
                </Button>
              </div>

              <div className="flex items-center space-x-3 md:space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 md:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">{t('products.featured')}</SelectItem>
                    <SelectItem value="price-low">{t('products.priceLowHigh')}</SelectItem>
                    <SelectItem value="price-high">{t('products.priceHighLow')}</SelectItem>
                    <SelectItem value="newest">{t('products.newest')}</SelectItem>
                    <SelectItem value="rating">{t('products.highestRated')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>





            {/* Product Grid */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">Loading products...</div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">No products found</div>
                  <p className="text-sm text-gray-400 mt-2">
                    Total products: {products.length}, Filtered: {filteredProducts.length}
                  </p>
                </div>
              ) : filteredProducts.map((product) => {
                try {
                  const { minPrice, maxPrice } = getProductPriceRange(product)
                  const { sizes, colors } = getProductOptions(product)
                  const productImage = getProductImage(product)

                  console.log(`🔍 Rendering product: ${product.name}`)
                  console.log(`   Image URL: ${productImage}`)
                  console.log(`   Price range: $${minPrice} - $${maxPrice}`)
                  console.log(`   Variants: ${product.variants?.length || 0}`)

                  return (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                        onLoad={() => {
                          console.log(`✅ Image loaded successfully: ${productImage}`)
                        }}
                        onError={(e) => {
                          console.error(`❌ Image failed to load: ${productImage}`)
                          console.error(`   Product: ${product.name}`)
                          console.error(`   Original images:`, product.images)

                          // 尝试备用URL格式
                          const currentSrc = e.currentTarget.src
                          const filename = productImage.split('/').pop()

                          if (currentSrc.includes('/api/image/') && filename) {
                            // 如果API路由失败，尝试直接文件访问
                            console.log(`🔄 Trying fallback URL: /uploads/${filename}`)
                            e.currentTarget.src = `/uploads/${filename}`
                          } else if (currentSrc.includes('/uploads/') && filename) {
                            // 如果直接访问失败，尝试备用API路由
                            console.log(`🔄 Trying fallback URL: /api/uploads/${filename}`)
                            e.currentTarget.src = `/api/uploads/${filename}`
                          } else {
                            // 所有尝试都失败，使用占位符
                            console.log(`🔄 All attempts failed, using placeholder`)
                            e.currentTarget.src = '/placeholder.svg'
                          }
                        }}
                      />

                      <FavoriteButton
                        product={product}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      />
                    </div>

                    <div className="p-3 md:p-4">
                      <h3 className="font-medium text-gray-900 mb-2 text-sm md:text-base">{product.name}</h3>

                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(4.5) ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">(12)</span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">
                            ${minPrice === maxPrice ? minPrice.toFixed(2) : `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          {colors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className={`w-4 h-4 rounded-full border border-gray-300 ${
                                color.toLowerCase() === "black"
                                  ? "bg-black"
                                  : color.toLowerCase() === "red"
                                    ? "bg-red-500"
                                    : color.toLowerCase() === "white"
                                      ? "bg-white"
                                      : color.toLowerCase() === "pink"
                                        ? "bg-pink-300"
                                        : color.toLowerCase() === "nude"
                                          ? "bg-amber-100"
                                          : color.toLowerCase() === "navy"
                                            ? "bg-blue-900"
                                            : color.toLowerCase() === "purple"
                                              ? "bg-purple-500"
                                              : color.toLowerCase() === "champagne"
                                                ? "bg-yellow-100"
                                                : color.toLowerCase() === "blush"
                                                  ? "bg-pink-200"
                                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                          {colors.length > 3 && (
                            <span className="text-xs text-gray-500">+{colors.length - 3}</span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="bg-pink-600 hover:bg-pink-700"
                          onClick={() => {
                            const firstVariant = product.variants[0]
                            if (firstVariant) {
                              addToCart({
                                productId: product.id,
                                variantId: firstVariant.id,
                                productName: product.name,
                                productImage: product.images[0] || '/placeholder.jpg',
                                size: firstVariant.size,
                                color: firstVariant.color,
                                price: firstVariant.price,
                                sku: firstVariant.sku
                              })
                            }
                          }}
                        >
                          {t('products.addToBag')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                  )
                } catch (error) {
                  console.error(`❌ Error rendering product ${product.name}:`, error)
                  return (
                    <Card key={product.id} className="border-red-200">
                      <CardContent className="p-4">
                        <div className="text-red-600">
                          <p className="font-medium">Error loading product: {product.name}</p>
                          <p className="text-sm">Please check console for details</p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                }
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Favorites Sidebar */}
      <FavoritesSidebar
        isOpen={showFavorites}
        onClose={() => setShowFavorites(false)}
      />
    </div>
  )
}
