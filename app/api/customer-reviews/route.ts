import { NextRequest, NextResponse } from 'next/server'
import { CustomerReview, CustomerReviewsResponse } from '@/lib/types/customer-reviews'
import customerReviewsData from '@/data/customer-reviews.json'
import fs from 'fs'
import path from 'path'

const REVIEWS_FILE_PATH = path.join(process.cwd(), 'data', 'customer-reviews.json')

// Helper function to read reviews from file
function readReviewsFromFile(): CustomerReview[] {
  try {
    if (!fs.existsSync(REVIEWS_FILE_PATH)) {
      return customerReviewsData as CustomerReview[]
    }
    const fileContent = fs.readFileSync(REVIEWS_FILE_PATH, 'utf-8')
    return JSON.parse(fileContent) as CustomerReview[]
  } catch (error) {
    console.error('Error reading reviews file:', error)
    return customerReviewsData as CustomerReview[]
  }
}

// Helper function to write reviews to file
function writeReviewsToFile(reviews: CustomerReview[]): boolean {
  try {
    const dir = path.dirname(REVIEWS_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2))
    return true
  } catch (error) {
    console.error('Error writing reviews file:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Customer Reviews API called at:', new Date().toISOString())

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = searchParams.get('limit')
    const verified = searchParams.get('verified')
    const withPhotos = searchParams.get('withPhotos')

    let reviews: CustomerReview[] = readReviewsFromFile()

    // Filter by product ID if specified
    if (productId) {
      reviews = reviews.filter(review => review.productId === productId)
    }

    // Filter by verified purchases if specified
    if (verified === 'true') {
      reviews = reviews.filter(review => review.verified)
    }

    // Filter by reviews with photos if specified
    if (withPhotos === 'true') {
      reviews = reviews.filter(review => review.images.length > 0)
    }

    // Sort by review date (newest first)
    reviews.sort((a, b) => new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime())

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        reviews = reviews.slice(0, limitNum)
      }
    }

    console.log(`✅ Returning ${reviews.length} customer reviews`)

    const response: CustomerReviewsResponse = {
      success: true,
      data: reviews
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ Error fetching customer reviews:', error)
    
    const response: CustomerReviewsResponse = {
      success: false,
      data: [],
      error: 'Failed to fetch customer reviews'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

// POST endpoint for adding new reviews (for future use)
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Adding new customer review at:', new Date().toISOString())
    
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['customerName', 'productId', 'productName', 'rating', 'reviewText']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`
          },
          { status: 400 }
        )
      }
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rating must be between 1 and 5'
        },
        { status: 400 }
      )
    }

    // Create new review object
    const newReview: CustomerReview = {
      id: `review-${Date.now()}`,
      customerName: body.customerName,
      customerAvatar: body.customerAvatar || '/placeholder-user.jpg',
      productId: body.productId,
      productName: body.productName,
      rating: body.rating,
      reviewText: body.reviewText,
      images: body.images || [],
      purchaseDate: body.purchaseDate || new Date().toISOString().split('T')[0],
      reviewDate: new Date().toISOString().split('T')[0],
      verified: body.verified || false,
      helpful: 0,
      size: body.size,
      color: body.color,
      fit: body.fit,
      quality: body.quality,
      comfort: body.comfort,
      style: body.style
    }

    // Read existing reviews and add the new one
    const existingReviews = readReviewsFromFile()
    existingReviews.unshift(newReview) // Add to beginning of array

    // Write updated reviews back to file
    const writeSuccess = writeReviewsToFile(existingReviews)

    if (!writeSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save review'
        },
        { status: 500 }
      )
    }

    console.log('✅ New review created and saved:', newReview.id)

    return NextResponse.json({
      success: true,
      data: newReview
    })
  } catch (error) {
    console.error('❌ Error adding customer review:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to add customer review'
      },
      { status: 500 }
    )
  }
}
