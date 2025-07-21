'use client'

import { useState, useEffect } from 'react'
import { CustomerReview } from '@/lib/types/customer-reviews'

interface CustomerReviewsCarouselProps {
  className?: string
}

export function CustomerReviewsCarousel({ className = '' }: CustomerReviewsCarouselProps) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/customer-reviews?withPhotos=true&limit=20')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // 展开所有图片为一个平铺数组
          const allImages: string[] = []
          data.data.forEach((review: CustomerReview) => {
            review.images.forEach((image: string) => {
              allImages.push(image)
            })
          })
          setImages(allImages)
        }
      }
    } catch (error) {
      console.error('Failed to load customer reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !mounted || images.length === 0) {
    return null
  }

  return (
    <section className={`py-0 bg-white ${className}`}>
      <div className="w-full overflow-hidden">
        {/* 无缝滚动的图片流 */}
        <div className="flex animate-scroll hover:pause">
          {/* 第一组图片 */}
          {images.slice(0, 14).map((image, index) => (
            <div
              key={`first-${index}`}
              className="flex-shrink-0 w-[180px] h-[180px] mx-1"
            >
              <img
                src={image}
                alt={`Customer photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                }}
              />
            </div>
          ))}
          {/* 重复第一组图片以实现无缝循环 */}
          {images.slice(0, 14).map((image, index) => (
            <div
              key={`second-${index}`}
              className="flex-shrink-0 w-[180px] h-[180px] mx-1"
            >
              <img
                src={image}
                alt={`Customer photo ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
