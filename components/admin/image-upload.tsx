'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Upload, 
  X, 
  Star,
  StarOff,
  Image as ImageIcon,
  Edit,
  Save,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { ProductImage } from '@/lib/types/product'

interface ImageUploadProps {
  images: ProductImage[]
  onChange: (images: ProductImage[]) => void
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [editingAlt, setEditingAlt] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    const newImages: ProductImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`)
        continue
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB.`)
        continue
      }

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          const newImage: ProductImage = {
            id: Date.now().toString() + i,
            url: result.data.url,
            alt: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
            isPrimary: images.length === 0 && i === 0, // First image is primary
            order: images.length + i + 1
          }
          newImages.push(newImage)
        } else {
          alert(`Failed to upload ${file.name}: ${result.error}`)
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert(`Failed to upload ${file.name}`)
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages])
    }
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id)
    // If removed image was primary, make first image primary
    if (updatedImages.length > 0 && !updatedImages.some(img => img.isPrimary)) {
      updatedImages[0].isPrimary = true
    }
    onChange(updatedImages)
  }

  const setPrimary = (id: string) => {
    const updatedImages = images.map(img => ({
      ...img,
      isPrimary: img.id === id
    }))
    onChange(updatedImages)
  }

  const updateAlt = (id: string, alt: string) => {
    const updatedImages = images.map(img => 
      img.id === id ? { ...img, alt } : img
    )
    onChange(updatedImages)
  }

  const moveImage = (id: string, direction: 'up' | 'down') => {
    const currentIndex = images.findIndex(img => img.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const updatedImages = [...images]
    const [movedImage] = updatedImages.splice(currentIndex, 1)
    updatedImages.splice(newIndex, 0, movedImage)

    // Update order numbers
    updatedImages.forEach((img, index) => {
      img.order = index + 1
    })

    onChange(updatedImages)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
        <p className="text-sm text-gray-600">
          Upload and manage product images. The first image will be used as the primary image.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Upload Images</h3>
              <p className="text-gray-500">Drag and drop images here, or click to select</p>
              <p className="text-sm text-gray-400 mt-2">
                Supports: JPEG, PNG, WebP • Max size: 5MB each
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Select Images'}
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        />

        {/* Images Grid */}
        {images.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">
                Uploaded Images ({images.length})
              </h3>
              <p className="text-sm text-gray-500">
                Click the star to set primary image
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images
                .sort((a, b) => a.order - b.order)
                .map((image, index) => (
                <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex space-x-1">
                      {image.isPrimary && (
                        <Badge className="bg-pink-600">Primary</Badge>
                      )}
                      <Badge variant="secondary">#{image.order}</Badge>
                    </div>
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPrimary(image.id)}
                        className="p-1 h-8 w-8"
                      >
                        {image.isPrimary ? (
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeImage(image.id)}
                        className="p-1 h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-2">
                    <div className="space-y-2">
                      <Label className="text-xs">Alt Text</Label>
                      {editingAlt === image.id ? (
                        <div className="flex space-x-2">
                          <Input
                            value={image.alt}
                            onChange={(e) => updateAlt(image.id, e.target.value)}
                            className="text-sm"
                            placeholder="Describe this image"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingAlt(null)}
                            className="p-1 h-8 w-8"
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate flex-1">
                            {image.alt || 'No alt text'}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingAlt(image.id)}
                            className="p-1 h-8 w-8 ml-2"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Order: {image.order}
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImage(image.id, 'up')}
                          disabled={index === 0}
                          className="p-1 h-6 w-6"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveImage(image.id, 'down')}
                          disabled={index === images.length - 1}
                          className="p-1 h-6 w-6"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No images uploaded yet</p>
            <p className="text-sm text-gray-400">Upload images to showcase your product</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
