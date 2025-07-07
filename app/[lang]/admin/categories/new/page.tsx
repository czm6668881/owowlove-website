'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const lang = params?.lang as string || 'en'
  
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    isActive: true
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Simple validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Category identifier is required'
    if (!formData.nameEn.trim()) newErrors.nameEn = 'Category name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/${lang}/admin/categories`)
      } else {
        alert('Error creating category: ' + result.error)
      }
    } catch (error) {
      console.error('Error creating category:', error)
      alert('Error creating category')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/${lang}/admin/categories`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600">Create a new product category</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Category Identifier *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g: panties, bodysuit"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                <p className="text-gray-500 text-sm mt-1">Used for URLs and internal identification, letters and underscores only</p>
              </div>

              <div>
                <Label htmlFor="nameEn">Category Name *</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => handleInputChange('nameEn', e.target.value)}
                  placeholder="e.g: Panties"
                  className={errors.nameEn ? 'border-red-500' : ''}
                />
                {errors.nameEn && <p className="text-red-500 text-sm mt-1">{errors.nameEn}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed description of the category..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Enable this category</Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link href={`/${lang}/admin/categories`}>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="bg-pink-600 hover:bg-pink-700">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Category'}
          </Button>
        </div>
      </form>
    </div>
  )
}
