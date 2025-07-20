'use client'

import { useState, useEffect } from 'react'
import { CustomerReview } from '@/lib/types/customer-reviews'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CustomerReviewsCarouselProps {
  className?: string
}

export function CustomerReviewsCarousel({ className = '' }: CustomerReviewsCarouselProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/customer-reviews?withPhotos=true&limit=12')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // 展开所有图片，每张图片作为一个独立的展示项
          const expandedImages: Array<{
            image: string
            customerName: string
            productName: string
            rating: number
            reviewText: string
          }> = []
          
          data.data.forEach((review: CustomerReview) => {
            review.images.forEach((image: string) => {
              expandedImages.push({
                image,
                customerName: review.customerName,
                productName: review.productName,
                rating: review.rating,
                reviewText: review.reviewText
              })
            })
          })
          
          setReviews(expandedImages as any)
        }
      }
    } catch (error) {
      console.error('Failed to load customer reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  // 自动轮播
  useEffect(() => {
    if (reviews.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(1, reviews.length - 5))
    }, 3000) // 每3秒切换一次

    return () => clearInterval(interval)
  }, [reviews.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, reviews.length - 5))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, reviews.length - 5)) % Math.max(1, reviews.length - 5))
  }

  if (loading || !mounted || reviews.length === 0) {
    return null
  }

  // 显示6张图片
  const visibleImages = reviews.slice(currentIndex, currentIndex + 6)
  if (visibleImages.length < 6) {
    // 如果不够6张，从头开始补充
    const remaining = 6 - visibleImages.length
    visibleImages.push(...reviews.slice(0, remaining))
  }

  return (
    <section className={`py-8 bg-white overflow-hidden ${className}`}>
      <div className="container mx-auto px-4">
        {/* 轮播容器 */}
        <div className="relative">
          {/* 图片网格 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
            {visibleImages.map((item, index) => (
              <div
                key={`${currentIndex}-${index}`}
                className="aspect-square overflow-hidden rounded-lg bg-gray-100 group cursor-pointer relative"
              >
                <img
                  src={item.image}
                  alt={`Customer photo by ${item.customerName}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.jpg'
                  }}
                />
                
                {/* 悬停覆盖层 */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                  <div className="text-white text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-xs font-medium mb-1 truncate">
                      {item.customerName}
                    </div>
                    <div className="text-xs opacity-90 line-clamp-2">
                      {item.productName}
                    </div>
                    <div className="flex justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-xs ${
                            star <= item.rating ? 'text-yellow-400' : 'text-gray-400'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 导航按钮 */}
          {reviews.length > 6 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
                aria-label="Previous images"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors z-10"
                aria-label="Next images"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* 指示器 */}
        {reviews.length > 6 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: Math.max(1, reviews.length - 5) }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-pink-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
