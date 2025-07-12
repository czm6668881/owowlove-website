'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Save, Upload, Image as ImageIcon, Star } from 'lucide-react'

interface Variant {
  id: string
  size: string
  color: string
  price: number
  stock: number
  sku: string
}

interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
}

interface NewProductFormProps {
  product?: any
  isEditing?: boolean
  lang: string
}

export function NewProductForm({ product, isEditing = false, lang }: NewProductFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Basic product info
  const [nameEn, setNameEn] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [category, setCategory] = useState('')
  const [isActive, setIsActive] = useState(true)

  // Categories
  const [categories, setCategories] = useState<any[]>([])
  
  // Variants
  const [variants, setVariants] = useState<Variant[]>([])

  // Images
  const [images, setImages] = useState<ProductImage[]>([])
  const [uploading, setUploading] = useState(false)

  // Debug effect
  useEffect(() => {
    console.log('Component mounted, images state:', images)
    console.log('Component mounted, categories state:', categories)
  }, [])

  useEffect(() => {
    console.log('Images state changed:', images)
  }, [images])

  useEffect(() => {
    console.log('Categories state changed:', categories)
  }, [categories])

  // New variant form
  const [newVariant, setNewVariant] = useState({
    size: 'S',
    color: 'Black',
    price: '0.00',
    stock: '0'
  })

  // Load product data in edit mode
  useEffect(() => {
    if (isEditing && product) {
      console.log('🔄 Loading product data for editing:', product)

      // Load basic info
      setNameEn(product.name || '')
      setDescriptionEn(product.description || '')
      setIsActive(product.is_active ?? true)

      // Load category - need to find category name from category_id
      if (product.category_id) {
        // We'll set this after categories are loaded
        console.log('📂 Product category_id:', product.category_id)
      }

      // Load variants
      if (product.variants && Array.isArray(product.variants)) {
        console.log('📦 Loading variants:', product.variants)
        setVariants(product.variants.map((variant: any) => ({
          id: variant.id || Date.now().toString(),
          size: variant.size || '',
          color: variant.color || '',
          price: variant.price || 0,
          stock: variant.stock || 0,
          sku: variant.sku || `${product.name}-${variant.size}-${variant.color}`.replace(/\s+/g, '-').toLowerCase()
        })))
      }

      // Load images
      if (product.images && Array.isArray(product.images)) {
        console.log('🖼️ Loading images:', product.images)
        const productImages = product.images.map((imageUrl: string, index: number) => ({
          id: `existing-${index}`,
          url: imageUrl,
          alt: `${product.name} - Image ${index + 1}`,
          isPrimary: index === 0,
          order: index + 1
        }))
        setImages(productImages)
      }
    }
  }, [isEditing, product])

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Set category after categories are loaded (for edit mode)
  useEffect(() => {
    if (isEditing && product && categories.length > 0 && product.category_id) {
      const productCategory = categories.find(cat => cat.id === product.category_id)
      if (productCategory) {
        console.log('📂 Setting category:', productCategory.name)
        setCategory(productCategory.name)
      }
    }
  }, [isEditing, product, categories])



  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data)
      } else {
        console.error('Categories data is not an array:', data)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const addVariant = () => {
    const variant: Variant = {
      id: Date.now().toString(),
      size: newVariant.size,
      color: newVariant.color,
      price: parseFloat(newVariant.price) || 0,
      stock: parseInt(newVariant.stock) || 0,
      sku: `${newVariant.size}-${newVariant.color}-${Date.now()}`
    }

    setVariants([...variants, variant])
    setNewVariant({ size: 'S', color: 'Black', price: '0.00', stock: '0' })
  }

  const removeVariant = (variantId: string) => {
    setVariants(variants.filter(v => v.id !== variantId))
  }

  const updateVariant = (variantId: string, field: string, value: any) => {
    setVariants(variants.map(variant => {
      if (variant.id === variantId) {
        const updated = { ...variant }
        if (field === 'price') {
          updated.price = parseFloat(value) || 0
        } else if (field === 'stock') {
          updated.stock = parseInt(value) || 0
        } else {
          updated[field as keyof Variant] = value
        }
        return updated
      }
      return variant
    }))
  }

  // Image management functions
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.')
      return
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.')
      return
    }

    setUploading(true)
    try {
      console.log(`🔄 Starting upload process for: ${file.name} (${file.size} bytes, ${file.type})`)

      const formData = new FormData()
      formData.append('image', file)
      console.log('✅ FormData created and file appended')

      console.log(`📤 Sending request to /api/admin/upload-image...`)
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      })
      console.log(`📊 Response received: ${response.status} ${response.statusText}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      console.log('🔄 Parsing JSON response...')
      const result = await response.json()
      console.log('✅ JSON parsed successfully')
      console.log('📋 Upload response:', result)

      if (result.success) {
        // 确保URL格式正确
        const imageUrl = result.url || result.data?.url
        console.log('📸 Image URL received:', imageUrl)

        const newImage: ProductImage = {
          id: Date.now().toString(),
          url: imageUrl,
          alt: `${nameEn || 'Product'} - ${file.name.replace(/\.[^/.]+$/, '')}`,
          isPrimary: images.length === 0, // First image is primary
          order: images.length + 1
        }
        setImages(prev => {
          const updated = [...prev, newImage]
          console.log('✅ Images updated:', updated)
          return updated
        })

        // 验证图片是否可以访问
        const testImg = new Image()
        testImg.onload = () => {
          console.log('✅ Image accessibility verified')
          alert(`✅ Image uploaded and verified!\nURL: ${imageUrl}\nTotal images: ${images.length + 1}`)
        }
        testImg.onerror = () => {
          console.error('❌ Image uploaded but not accessible')
          alert(`⚠️ Image uploaded but may not be accessible.\nURL: ${imageUrl}\nPlease check the image display.`)
        }
        testImg.src = imageUrl
      } else {
        console.error('❌ Upload failed:', result.error)
        alert('❌ Error uploading image: ' + result.error)
      }
    } catch (error) {
      console.error('❌ Error uploading image:', error)
      console.error('❌ Error type:', typeof error)
      console.error('❌ Error name:', error?.name)
      console.error('❌ Error message:', error?.message)
      console.error('❌ Error stack:', error?.stack)

      let errorMessage = 'Error uploading image. Please try again.'
      if (error instanceof Error) {
        errorMessage = `Error uploading image: ${error.message}`
      } else if (typeof error === 'string') {
        errorMessage = `Error uploading image: ${error}`
      }

      alert(`❌ ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  const updateImageAlt = (imageId: string, alt: string) => {
    setImages(images.map(img =>
      img.id === imageId ? { ...img, alt } : img
    ))
  }

  const setPrimaryImage = (imageId: string) => {
    setImages(images.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    })))
  }

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId)
    // If we removed the primary image, make the first remaining image primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true
    }
    setImages(updatedImages)
  }

  const moveImage = (imageId: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === imageId)
    if (currentIndex === -1) return

    const newImages = [...images]
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1

    if (targetIndex >= 0 && targetIndex < newImages.length) {
      // Swap images
      [newImages[currentIndex], newImages[targetIndex]] = [newImages[targetIndex], newImages[currentIndex]]

      // Update order numbers - create new objects to avoid mutation
      const updatedImages = newImages.map((img, index) => ({
        ...img,
        order: index + 1
      }))

      setImages(updatedImages)
    }
  }

  const saveProduct = async () => {
    if (!nameEn.trim()) {
      alert('Product name is required')
      return
    }

    setSaving(true)
    try {
      // 准备变体数据 - 根据编辑模式处理
      const variantsForAPI = variants.map(variant => {
        if (isEditing) {
          // 编辑模式：保留完整的变体数据包括id
          return {
            id: variant.id,
            size: variant.size,
            color: variant.color,
            price: variant.price,
            stock: variant.stock,
            sku: variant.sku
          }
        } else {
          // 新建模式：移除前端生成的id，让后端重新生成
          return {
            size: variant.size,
            color: variant.color,
            price: variant.price,
            stock: variant.stock,
            sku: variant.sku
          }
        }
      })

      // 验证必填字段
      if (!nameEn.trim()) {
        alert('Product name is required')
        return
      }

      if (variantsForAPI.length === 0) {
        alert('At least one variant is required')
        return
      }

      // 找到选中分类的ID
      let categoryId = null
      if (category.trim()) {
        const selectedCategory = categories.find(cat => cat.name === category.trim())
        categoryId = selectedCategory?.id || null
      }

      // 统一使用 Supabase API 格式
      const productData = {
        name: nameEn.trim(),
        description: descriptionEn.trim(),
        price: variantsForAPI.length > 0 ? Math.min(...variantsForAPI.map(v => v.price)) : 0,
        category_id: categoryId,
        variants: variantsForAPI,
        images: images.map(img => img.url),
        is_active: isActive
      }

      console.log('Saving product with', variantsForAPI.length, 'variants')

      const url = isEditing
        ? `/api/admin/products/${product?.id}`
        : '/api/admin/products'

      const method = isEditing ? 'PUT' : 'POST'

      // Get admin token for authentication
      const token = localStorage.getItem('admin_token')

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Save result:', result)

      if (result.success) {
        alert('Product saved successfully!')
        router.push(`/${lang}/admin/products`)
      } else {
        alert('Error saving product: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      if (error instanceof Error) {
        alert('Error saving product: ' + error.message)
      } else {
        alert('Error saving product: Unknown error occurred')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Product Name (English)</Label>
            <Input
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          <div>
            <Label>Description (English)</Label>
            <Textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          <div>
            <Label>Category</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) && categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span>Active</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Product Images */}
      <Card>
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload New Image */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer flex flex-col items-center space-y-2 ${uploading ? 'opacity-50' : ''}`}
            >
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </span>
              <span className="text-xs text-gray-400">
                Supports: JPG, PNG, GIF (Max 5MB)
              </span>
            </label>
          </div>

          {/* Debug Display */}
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
            <strong>Debug Info:</strong> {images.length} images in state
            {images.length > 0 && (
              <div className="mt-1 text-xs text-gray-600">
                URLs: {images.map(img => img.url).join(', ')}
              </div>
            )}
          </div>

          {/* Existing Images */}
          {images.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Uploaded Images ({images.length})</h4>
              {images.map((image, index) => (
                <div key={image.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start space-x-4">
                    {/* Image Preview */}
                    <div className="relative">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      {image.isPrimary && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                          <Star className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Image Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <Label className="text-xs">Alt Text (SEO)</Label>
                        <Input
                          value={image.alt}
                          onChange={(e) => updateImageAlt(image.id, e.target.value)}
                          placeholder="Describe this image for SEO"
                          className="text-sm"
                        />
                      </div>

                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>Order: {image.order}</span>
                        {image.isPrimary && (
                          <Badge variant="secondary" className="text-xs">Primary</Badge>
                        )}
                      </div>
                    </div>

                    {/* Image Actions */}
                    <div className="flex flex-col space-y-2">
                      {!image.isPrimary && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPrimaryImage(image.id)}
                          className="text-xs"
                        >
                          Set Primary
                        </Button>
                      )}

                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImage(image.id, 'up')}
                          disabled={index === 0}
                          className="p-1"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImage(image.id, 'down')}
                          disabled={index === images.length - 1}
                          className="p-1"
                        >
                          ↓
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No images uploaded yet</p>
              <p className="text-sm">Upload at least one image for your product</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Variants */}
          {variants.map((variant) => (
            <div key={variant.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div>
                  <Label className="text-xs">Size</Label>
                  <Input
                    value={variant.size}
                    onChange={(e) => updateVariant(variant.id, 'size', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs">Color</Label>
                  <Input
                    value={variant.color}
                    onChange={(e) => updateVariant(variant.id, 'color', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs">Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs">Stock</Label>
                  <Input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) => updateVariant(variant.id, 'stock', e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(variant.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                SKU: {variant.sku}
              </div>
            </div>
          ))}
          
          {/* Add New Variant */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Add New Variant</h4>
            <div className="grid grid-cols-5 gap-4 items-end">
              <div>
                <Label className="text-xs">Size</Label>
                <select
                  value={newVariant.size}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                  <option value="均码">均码</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Color</Label>
                <select
                  value={newVariant.color}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Red">Red</option>
                  <option value="Pink">Pink</option>
                  <option value="Blue">Blue</option>
                  <option value="Purple">Purple</option>
                </select>
              </div>

              <div>
                <Label className="text-xs">Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newVariant.price}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>

              <div>
                <Label className="text-xs">Stock</Label>
                <Input
                  type="number"
                  min="0"
                  value={newVariant.stock}
                  onChange={(e) => setNewVariant(prev => ({ ...prev, stock: e.target.value }))}
                />
              </div>

              <Button onClick={addVariant} className="bg-pink-600 hover:bg-pink-700">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/${lang}/admin/products`)}
        >
          Cancel
        </Button>
        <Button
          onClick={saveProduct}
          disabled={saving}
          className="bg-pink-600 hover:bg-pink-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </div>
  )
}
