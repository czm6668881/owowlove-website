'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Edit,
  Trash2,
  Search,
  Tag
} from 'lucide-react'

interface Category {
  id: string
  name: string
  nameEn: string
  description?: string
  productCount: number
  isActive: boolean
  createdAt: string
}

export default function CategoriesPage() {
  const params = useParams()
  const lang = params?.lang as string || 'en'

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')

  // Fetch categories from API
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setCategories(categories.filter(c => c.id !== categoryId))
      } else {
        alert('Error deleting category: ' + data.error)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category')
    }
  }

  const filteredCategories = categories.filter(category => {
    const categoryNameEn = (category.nameEn || '').toLowerCase()
    const categoryName = (category.name || '').toLowerCase()
    const categoryDescription = (category.description || '').toLowerCase()
    const searchLower = searchQuery.toLowerCase()
    return categoryNameEn.includes(searchLower) ||
           categoryName.includes(searchLower) ||
           categoryDescription.includes(searchLower)
  })

  const handleToggleStatus = async (id: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? {
        ...cat,
        isActive: !(cat.isActive || cat.is_active),
        is_active: !(cat.isActive || cat.is_active)
      } : cat
    ))
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories and classifications</p>
        </div>
        <Link href={`/${lang}/admin/categories/new`}>
          <Button className="bg-pink-600 hover:bg-pink-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Categories ({filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500">No categories found</div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{category.nameEn || category.name || 'Unnamed Category'}</h3>
                        <Badge variant={(category.isActive || category.is_active) ? "default" : "secondary"}>
                          {(category.isActive || category.is_active) ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{category.description || ''}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Products: {category.productCount || 0}</span>
                        <span>Created: {new Date(category.createdAt || category.created_at || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(category.id)}
                      >
                        {(category.isActive || category.is_active) ? 'Disable' : 'Enable'}
                      </Button>
                      <Link href={`/${lang}/admin/categories/${category.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
            <div className="text-sm text-gray-600">Total Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">
              {categories.filter(c => c.isActive || c.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Active Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">
              {categories.reduce((sum, c) => sum + (c.productCount || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
