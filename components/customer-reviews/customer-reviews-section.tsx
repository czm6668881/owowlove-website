'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Heart, ThumbsUp, Verified, ChevronLeft, ChevronRight } from 'lucide-react'
import { CustomerReview } from '@/lib/types/customer-reviews'
import Image from 'next/image'

interface CustomerReviewsSectionProps {
  className?: string
}

export function CustomerReviewsSection({ className = '' }: CustomerReviewsSectionProps) {
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
      const response = await fetch('/api/customer-reviews')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setReviews(data.data)
        }
      }
    } catch (error) {
      console.error('Failed to load customer reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading || !mounted) {
    return (
      <section className={`py-12 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  const currentReview = reviews[currentIndex]
  const visibleReviews = reviews.slice(0, 6) // Show first 6 reviews in grid

  return (
    <section className={`py-12 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about their purchases. Real reviews from verified buyers.
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600">4.8 out of 5 stars</span>
            <span className="text-gray-400">({reviews.length} reviews)</span>
          </div>
        </div>

        {/* Featured Review Carousel */}
        <div className="mb-12">
          <div className="relative max-w-4xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Review Images */}
                  <div className="space-y-4">
                    {currentReview.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {currentReview.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="aspect-square overflow-hidden rounded-lg">
                            <img
                              src={image}
                              alt={`Customer photo ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.jpg'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${
                              star <= currentReview.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      {currentReview.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Verified className="w-3 h-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>

                    <blockquote className="text-lg text-gray-900 italic">
                      "{currentReview.reviewText}"
                    </blockquote>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="font-medium">{currentReview.customerName}</span>
                        <span>•</span>
                        <span>{formatDate(currentReview.reviewDate)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Product: {currentReview.productName}</span>
                        {currentReview.size && (
                          <>
                            <span>•</span>
                            <span>Size: {currentReview.size}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <Button variant="ghost" size="sm" className="text-gray-500">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful ({currentReview.helpful})
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Carousel Controls */}
            {reviews.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg"
                  onClick={prevReview}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg"
                  onClick={nextReview}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Carousel Indicators */}
          {reviews.length > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-pink-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-center justify-between">
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

                  {/* Review Text */}
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {review.reviewText}
                  </p>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex space-x-2">
                      {review.images.slice(0, 3).map((image, index) => (
                        <div key={index} className="w-16 h-16 overflow-hidden rounded">
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
                        <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                          +{review.images.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">{review.customerName}</span>
                    <span>{formatDate(review.reviewDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Reviews Button */}
        {reviews.length > 6 && (
          <div className="text-center mt-8">
            <Button variant="outline" className="px-8">
              View All Reviews ({reviews.length})
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
