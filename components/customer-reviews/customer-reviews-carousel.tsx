'use client'

import { useState, useEffect } from 'react'
import { CustomerReview } from '@/lib/types/customer-reviews'
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogClose, DialogTitle } from '@/components/ui/dialog'

interface CustomerReviewsCarouselProps {
  className?: string
}

export function CustomerReviewsCarousel({ className = '' }: CustomerReviewsCarouselProps) {
  const [reviews, setReviews] = useState<CustomerReview[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1) // 默认为1，避免水合错误
  const [selectedReview, setSelectedReview] = useState<CustomerReview | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadReviews()
  }, [])

  useEffect(() => {
    if (!mounted) return

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          setItemsPerView(1)
        } else if (window.innerWidth < 1024) {
          setItemsPerView(2)
        } else {
          setItemsPerView(4)
        }
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [mounted])

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/customer-reviews?limit=20')
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

  const nextSlide = () => {
    const maxIndex = Math.max(0, reviews.length - itemsPerView)
    setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1))
  }

  const prevSlide = () => {
    const maxIndex = Math.max(0, reviews.length - itemsPerView)
    setCurrentIndex((prev) => (prev - 1 + (maxIndex + 1)) % (maxIndex + 1))
  }

  const handleImageClick = (review: CustomerReview) => {
    setSelectedReview(review)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedReview(null)
  }

  if (loading || !mounted || reviews.length === 0) {
    return null
  }

  return (
    <section className={`py-8 bg-black ${className}`}>
      <div className="container mx-auto px-4">


        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-black rounded-full w-16 h-16 shadow-lg border-2 border-gray-200"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 text-black rounded-full w-16 h-16 shadow-lg border-2 border-gray-200"
            onClick={nextSlide}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          {/* Reviews Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / itemsPerView}%` }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                    {/* Review Image - 更小的图片比例，可点击放大 */}
                    <div
                      className="aspect-[3/2] overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(review)}
                    >
                      {review.images.length > 0 ? (
                        <img
                          src={review.images[0]}
                          alt={`买家秀 ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400">暂无图片</span>
                        </div>
                      )}
                    </div>

                    {/* Review Content - 更多的文字空间 */}
                    <div className="p-3">
                      {/* Star Rating - Always 5 stars in pink */}
                      <div className="flex items-center space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-3 h-3 fill-pink-400 text-pink-400"
                          />
                        ))}
                      </div>

                      {/* Customer Name */}
                      <div className="mb-2">
                        <span className="font-medium text-gray-900 text-sm">{review.customerName}</span>
                      </div>

                      {/* Review Text - 更多行数和更大字体 */}
                      <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed">
                        {review.reviewText}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 图片放大模态框 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogTitle className="sr-only">买家秀详情</DialogTitle>
          <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary bg-white/80 backdrop-blur-sm">
            <X className="h-6 w-6" />
            <span className="sr-only">关闭</span>
          </DialogClose>

          {selectedReview && (
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              {/* 左侧：放大的图片 */}
              <div className="relative bg-black flex items-center justify-center">
                {selectedReview.images.length > 0 ? (
                  <img
                    src={selectedReview.images[0]}
                    alt="买家秀放大图"
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg'
                    }}
                  />
                ) : (
                  <div className="text-white">暂无图片</div>
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
                        className="w-5 h-5 fill-pink-400 text-pink-400"
                      />
                    ))}
                  </div>

                  {/* 客户姓名 */}
                  <div>
                    <span className="font-semibold text-lg text-gray-900">
                      {selectedReview.customerName}
                    </span>
                  </div>

                  {/* 产品信息 */}
                  <div className="text-sm text-gray-600">
                    <p>产品：{selectedReview.productName}</p>
                    {selectedReview.size && <p>尺寸：{selectedReview.size}</p>}
                    {selectedReview.color && <p>颜色：{selectedReview.color}</p>}
                  </div>

                  {/* 完整评论文字 */}
                  <div className="text-gray-700 leading-relaxed">
                    <p>{selectedReview.reviewText}</p>
                  </div>

                  {/* 评论日期 */}
                  <div className="text-sm text-gray-500 pt-4 border-t">
                    评论时间：{new Date(selectedReview.reviewDate).toLocaleDateString('zh-CN')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
