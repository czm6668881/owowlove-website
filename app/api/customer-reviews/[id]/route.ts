import { NextRequest, NextResponse } from 'next/server'
import { CustomerReview } from '@/lib/types/customer-reviews'
import fs from 'fs'
import path from 'path'

const REVIEWS_FILE_PATH = path.join(process.cwd(), 'data', 'customer-reviews.json')

// Helper function to read reviews from file
function readReviewsFromFile(): CustomerReview[] {
  try {
    if (!fs.existsSync(REVIEWS_FILE_PATH)) {
      return []
    }
    const fileContent = fs.readFileSync(REVIEWS_FILE_PATH, 'utf-8')
    return JSON.parse(fileContent) as CustomerReview[]
  } catch (error) {
    console.error('Error reading reviews file:', error)
    return []
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

// DELETE endpoint for deleting a specific review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🗑️ Delete review API called for ID:', params.id)
    
    const reviews = readReviewsFromFile()
    const reviewIndex = reviews.findIndex(review => review.id === params.id)
    
    if (reviewIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Review not found'
        },
        { status: 404 }
      )
    }
    
    // Remove the review
    const deletedReview = reviews.splice(reviewIndex, 1)[0]
    
    // Write updated reviews back to file
    const writeSuccess = writeReviewsToFile(reviews)
    
    if (!writeSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save changes'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Review deleted successfully:', deletedReview.customerName)
    
    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
      deletedReview
    })
    
  } catch (error) {
    console.error('❌ Error deleting review:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// PUT endpoint for updating a specific review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('✏️ Update review API called for ID:', params.id)
    
    const body = await request.json()
    const reviews = readReviewsFromFile()
    const reviewIndex = reviews.findIndex(review => review.id === params.id)
    
    if (reviewIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: 'Review not found'
        },
        { status: 404 }
      )
    }
    
    // Validate required fields
    const requiredFields = ['customerName', 'productName', 'rating', 'reviewText']
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
    
    // Update the review
    const updatedReview: CustomerReview = {
      ...reviews[reviewIndex],
      customerName: body.customerName,
      productName: body.productName,
      rating: body.rating,
      reviewText: body.reviewText,
      images: body.images || [],
      verified: body.verified || false,
      size: body.size,
      color: body.color,
      // Keep original dates and other fields
      reviewDate: new Date().toISOString().split('T')[0] // Update review date
    }
    
    reviews[reviewIndex] = updatedReview
    
    // Write updated reviews back to file
    const writeSuccess = writeReviewsToFile(reviews)
    
    if (!writeSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save changes'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Review updated successfully:', updatedReview.customerName)
    
    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    })
    
  } catch (error) {
    console.error('❌ Error updating review:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for getting a specific review
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Get review API called for ID:', params.id)
    
    const reviews = readReviewsFromFile()
    const review = reviews.find(review => review.id === params.id)
    
    if (!review) {
      return NextResponse.json(
        {
          success: false,
          error: 'Review not found'
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: review
    })
    
  } catch (error) {
    console.error('❌ Error getting review:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error'
      },
      { status: 500 }
    )
  }
}
