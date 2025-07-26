'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Plus, 
  Trash2, 
  Edit, 
  Star, 
  Verified, 
  Upload,
  X,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { CustomerReview } from '@/lib/types/customer-reviews'

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    productId: '',
    productName: '',
    rating: 5,
    reviewText: '',
    images: [] as string[],
    verified: false,
    size: '',
    color: ''
  })

  useEffect(() => {
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
      console.error('Failed to load reviews:', error)
      setMessage({ type: 'error', text: 'Failed to load reviews' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const reviewData = {
        ...formData,
        purchaseDate: new Date().toISOString().split('T')[0],
        reviewDate: new Date().toISOString().split('T')[0],
        helpful: 0
      }

      const response = await fetch('/api/customer-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Review added successfully!' })
        setShowAddForm(false)
        resetForm()
        loadReviews()
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Failed to add review' })
      }
    } catch (error) {
      console.error('Error adding review:', error)
      setMessage({ type: 'error', text: 'Failed to add review' })
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const response = await fetch(`/api/customer-reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Review deleted successfully!' })
        loadReviews()
      } else {
        setMessage({ type: 'error', text: 'Failed to delete review' })
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      setMessage({ type: 'error', text: 'Failed to delete review' })
    }
  }

  const resetForm = () => {
    setFormData({
      customerName: '',
      productId: '',
      productName: '',
      rating: 5,
      reviewText: '',
      images: [],
      verified: false,
      size: '',
      color: ''
    })
    setEditingReview(null)
  }

  const startEdit = (review: CustomerReview) => {
    setFormData({
      customerName: review.customerName,
      productId: review.productId,
      productName: review.productName,
      rating: review.rating,
      reviewText: review.reviewText,
      images: review.images,
      verified: review.verified,
      size: review.size || '',
      color: review.color || ''
    })
    setEditingReview(review)
    setShowAddForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-gray-600 mt-2">Manage customer reviews and testimonials</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Review
        </Button>
      </div>

      {/* Message Alert */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingReview ? 'Edit Review' : 'Add New Review'}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddForm(false)
                  resetForm()
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Customer Name *</label>
                  <Input
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="e.g., Sarah M."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <Input
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g., Egyptian Queen Cat"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    required
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Size</label>
                  <Input
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g., M, L, XL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="e.g., Pink, Black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review Text *</label>
                <Textarea
                  value={formData.reviewText}
                  onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                  placeholder="Customer's review text..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URLs (one per line)</label>
                <Textarea
                  value={formData.images.join('\n')}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(url => url.trim()) })}
                  placeholder="/uploads/image1.jpg&#10;/uploads/image2.jpg"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <label htmlFor="verified" className="text-sm font-medium">Verified Purchase</label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" className="bg-pink-600 hover:bg-pink-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingReview ? 'Update Review' : 'Add Review'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    resetForm()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first customer review.</p>
              <Button onClick={() => setShowAddForm(true)} className="bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Add First Review
              </Button>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{review.customerName}</h3>
                        {review.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <Verified className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 mb-1">
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
                        <span className="text-sm text-gray-600 ml-2">({review.rating}/5)</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {review.productName} • {review.reviewDate}
                        {review.size && ` • Size: ${review.size}`}
                        {review.color && ` • Color: ${review.color}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(review)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">{review.reviewText}</p>
                </div>

                {review.images.length > 0 && (
                  <div className="flex space-x-2 mb-4">
                    {review.images.slice(0, 4).map((image, index) => (
                      <div key={index} className="w-16 h-16 overflow-hidden rounded border">
                        <img
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg'
                          }}
                        />
                      </div>
                    ))}
                    {review.images.length > 4 && (
                      <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                        +{review.images.length - 4}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Helpful: {review.helpful}</span>
                  <span>ID: {review.id}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
