'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save } from 'lucide-react'

interface Category {
  id: string
  name: string
  nameEn: string
  description?: string
  isActive: boolean
}

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const lang = params?.lang as string || 'en'
  const categoryId = params?.id as string
  
  const [formData, setFormData] = useState<Category>({
    id: '',
    name: '',
    nameEn: '',
    description: '',
    isActive: true
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load category data from API
    const loadCategory = async () => {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`)
        const data = await response.json()

        if (data.success) {
          setFormData(data.data)
        } else {
          setError(data.error || 'Category not found')
        }
      } catch (error) {
        console.error('Error loading category:', error)
        setError('Failed to load category')
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      loadCategory()
    }
  }, [categoryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})

    // Simple validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Category identifier is required'
    if (!formData.nameEn.trim()) newErrors.nameEn = 'Category name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/${lang}/admin/categories`)
      } else {
        alert('Error updating category: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating category:', error)
      alert('Error updating category')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/${lang}/admin/categories`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-600">Modify category information</p>
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
                value={formData.description || ''}
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
          <Button type="submit" disabled={saving} className="bg-pink-600 hover:bg-pink-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
