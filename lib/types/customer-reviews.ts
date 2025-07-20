export interface CustomerReview {
  id: string
  customerName: string
  customerAvatar?: string
  productId: string
  productName: string
  rating: number
  reviewText: string
  images: string[]
  purchaseDate: string
  reviewDate: string
  verified: boolean
  helpful: number
  size?: string
  color?: string
  fit?: 'small' | 'true_to_size' | 'large'
  quality?: number // 1-5 rating for quality
  comfort?: number // 1-5 rating for comfort
  style?: number // 1-5 rating for style
}

export interface CustomerReviewsResponse {
  success: boolean
  data: CustomerReview[]
  error?: string
}

export interface CustomerReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  verifiedPurchases: number
  withPhotos: number
}
