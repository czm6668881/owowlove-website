'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ShoppingBag,
  Heart,
  Star,
  ArrowLeft,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle,
  Loader2,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Verified,
  X
} from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useFavorites } from '@/contexts/favorites-context'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { CartSidebar } from '@/components/cart/cart-sidebar'
import { FavoritesSidebar } from '@/components/favorites/favorites-sidebar'
import { CustomerReview } from '@/lib/types/customer-reviews'
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog'

interface ProductVariant {
  id: string
  color: string
  size: string
  price: number
  stock: number
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category_id: string
  variants: ProductVariant[]
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

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showFavorites, setShowFavorites] = useState(false)
  const [addToCartLoading, setAddToCartLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [reviews, setReviews] = useState<CustomerReview[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [selectedReviewImage, setSelectedReviewImage] = useState<{
    review: CustomerReview;
    imageIndex: number;
  } | null>(null)
  const [isReviewImageModalOpen, setIsReviewImageModalOpen] = useState(false)



  // 获取产品评论
  const fetchProductReviews = async (productId: string) => {
    try {
      setReviewsLoading(true)
      const response = await fetch('/api/customer-reviews')
      const result = await response.json()

      if (result.success && result.data) {
        // 筛选出该产品的评论
        const productReviews = result.data.filter((review: CustomerReview) =>
          review.productId === productId
        )
        setReviews(productReviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  // 处理评论图片点击
  const handleReviewImageClick = (review: CustomerReview, imageIndex: number) => {
    setSelectedReviewImage({ review, imageIndex })
    setIsReviewImageModalOpen(true)
  }

  // 关闭评论图片模态框
  const closeReviewImageModal = () => {
    setIsReviewImageModalOpen(false)
    setSelectedReviewImage(null)
  }

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
      fetchProductReviews(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/products/${productId}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setProduct(result.data)
        // 设置默认选中的变体
        if (result.data.variants && result.data.variants.length > 0) {
          setSelectedVariant(result.data.variants[0])
        }
      } else {
        setError(result.error || 'Product not found')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    setAddToCartLoading(true)
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: selectedVariant?.price || product.price,
        image: product.images.length > 0 ? `/api/image/${product.images[0]}` : '/placeholder.jpg',
        quantity: quantity,
        variant: selectedVariant ? {
          size: selectedVariant.size,
          color: selectedVariant.color
        } : undefined
      }
      
      addToCart(cartItem)
      setMessage({ type: 'success', text: 'Product added to cart!' })
      
      // 清除消息
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add to cart' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setAddToCartLoading(false)
    }
  }

  const handleToggleFavorite = () => {
    if (!product) return
    
    const favoriteItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images.length > 0 ? `/api/image/${product.images[0]}` : '/placeholder.jpg'
    }
    
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id)
      setMessage({ type: 'success', text: 'Removed from favorites' })
    } else {
      addToFavorites(favoriteItem)
      setMessage({ type: 'success', text: 'Added to favorites!' })
    }
    
    setTimeout(() => setMessage(null), 3000)
  }

  const getCurrentPrice = () => {
    return selectedVariant?.price || product?.price || 0
  }

  const getAvailableStock = () => {
    return selectedVariant?.stock || 0
  }

  const isInStock = () => {
    return getAvailableStock() > 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onShowFavorites={() => setShowFavorites(true)} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="animate-spin h-8 w-8 text-pink-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onShowFavorites={() => setShowFavorites(true)} />
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Product not found'}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowFavorites={() => setShowFavorites(true)} />
      
      {/* Message Alert */}
      {message && (
        <div className="fixed top-20 right-4 z-50">
          <Alert className={`${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} shadow-lg`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          onClick={() => router.back()} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-lg bg-white shadow-sm">
              {product.images.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-pink-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              {product.category && (
                <Badge variant="outline" className="mb-2">
                  {product.category.name}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.8) • 127 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-pink-600">
              ${getCurrentPrice()}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Options</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">
                        {variant.size} - {variant.color}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${variant.price} • Stock: {variant.stock}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2">
              <h3 className="font-semibold">Quantity</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(getAvailableStock(), quantity + 1))}
                  disabled={quantity >= getAvailableStock()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 ml-4">
                  {getAvailableStock()} available
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={!isInStock() || addToCartLoading}
                className="w-full bg-pink-600 hover:bg-pink-700"
                size="lg"
              >
                {addToCartLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4 mr-2" />
                )}
                {isInStock() ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  onClick={handleToggleFavorite}
                  variant="outline"
                  className="flex-1"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite(product.id) ? 'Favorited' : 'Add to Favorites'}
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-sm text-gray-600">On orders over $50</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-sm text-gray-600">30-day return policy</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-sm text-gray-600">SSL encrypted checkout</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 产品评论区域 */}
        <div className="mt-16 border-t pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg font-medium">
                  {reviews.length > 0
                    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                    : '0.0'
                  }
                </span>
                <span className="text-gray-600">
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">Be the first to review this product!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    {/* 评论头部 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Verified className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    {/* 评论内容 */}
                    <p className="text-gray-700 text-sm line-clamp-4 leading-relaxed mb-4">
                      {review.reviewText}
                    </p>

                    {/* 评论图片 - 可点击放大 */}
                    {review.images.length > 0 && (
                      <div className="flex space-x-2 mb-4">
                        {review.images.slice(0, 3).map((image, index) => (
                          <div
                            key={index}
                            className="w-12 h-12 overflow-hidden rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleReviewImageClick(review, index)}
                          >
                            <img
                              src={image}
                              alt={`Review photo ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg'
                              }}
                            />
                          </div>
                        ))}
                        {review.images.length > 3 && (
                          <div
                            className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors"
                            onClick={() => handleReviewImageClick(review, 3)}
                          >
                            +{review.images.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 评论者信息 */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900">{review.customerName}</span>
                        <span className="text-gray-500">
                          {new Date(review.reviewDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      {(review.size || review.color) && (
                        <div className="mt-1 text-xs text-gray-600">
                          {review.size && `Size: ${review.size}`}
                          {review.size && review.color && ' • '}
                          {review.color && `Color: ${review.color}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <CartSidebar />
      <FavoritesSidebar isOpen={showFavorites} onClose={() => setShowFavorites(false)} />

      {/* 评论图片放大模态框 */}
      <Dialog open={isReviewImageModalOpen} onOpenChange={setIsReviewImageModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
          <DialogTitle className="sr-only">评论图片详情</DialogTitle>
          <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary bg-white/80 backdrop-blur-sm">
            <X className="h-6 w-6" />
            <span className="sr-only">关闭</span>
          </DialogClose>

          {selectedReviewImage && (
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* 左侧：放大的图片 */}
              <div className="relative bg-black flex items-center justify-center min-h-[400px]">
                {selectedReviewImage.review.images.length > 0 ? (
                  <img
                    src={selectedReviewImage.review.images[selectedReviewImage.imageIndex]}
                    alt="评论图片放大"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                  />
                ) : (
                  <div className="text-white">暂无图片</div>
                )}

                {/* 图片导航 */}
                {selectedReviewImage.review.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {selectedReviewImage.review.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedReviewImage({
                          review: selectedReviewImage.review,
                          imageIndex: index
                        })}
                        className={`w-3 h-3 rounded-full ${
                          index === selectedReviewImage.imageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* 右侧：完整的评论内容 */}
              <div className="p-6 bg-white overflow-y-auto">
                <div className="space-y-4">
                  {/* 星级评分 */}
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= selectedReviewImage.review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {selectedReviewImage.review.rating}/5 stars
                    </span>
                  </div>

                  {/* 客户姓名和验证标识 */}
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-lg text-gray-900">
                      {selectedReviewImage.review.customerName}
                    </span>
                    {selectedReviewImage.review.verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Verified className="w-3 h-3 mr-1" />
                        Verified Purchase
                      </Badge>
                    )}
                  </div>

                  {/* 产品信息 */}
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>产品：</strong>{selectedReviewImage.review.productName}</p>
                    {selectedReviewImage.review.size && <p><strong>尺寸：</strong>{selectedReviewImage.review.size}</p>}
                    {selectedReviewImage.review.color && <p><strong>颜色：</strong>{selectedReviewImage.review.color}</p>}
                  </div>

                  {/* 完整评论文字 */}
                  <div className="text-gray-700 leading-relaxed">
                    <h4 className="font-medium mb-2">评论内容：</h4>
                    <p>{selectedReviewImage.review.reviewText}</p>
                  </div>

                  {/* 评论日期 */}
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      评论时间：{new Date(selectedReviewImage.review.reviewDate).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
