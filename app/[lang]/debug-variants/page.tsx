'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

interface Variant {
  id: string
  size: string
  color: string
  price: number
  stock: number
  sku: string
}

export default function DebugVariantsPage() {
  const [variants, setVariants] = useState<Variant[]>([])
  const [newVariant, setNewVariant] = useState({
    size: 'S',
    color: 'Black',
    price: '0.00',
    stock: '0'
  })

  const addVariant = () => {
    const variant: Variant = {
      id: Date.now().toString(),
      size: newVariant.size,
      color: newVariant.color,
      price: parseFloat(newVariant.price) || 0,
      stock: parseInt(newVariant.stock) || 0,
      sku: `${newVariant.size}-${newVariant.color}-${Date.now()}`
    }

    console.log('Adding variant:', variant)
    setVariants([...variants, variant])
    setNewVariant({ size: 'S', color: 'Black', price: '0.00', stock: '0' })
  }

  const removeVariant = (variantId: string) => {
    console.log('Removing variant:', variantId)
    setVariants(variants.filter(v => v.id !== variantId))
  }

  const updateVariant = (variantId: string, field: string, value: any) => {
    console.log('Updating variant:', variantId, field, value)
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

  const testSaveProduct = async () => {
    const productData = {
      nameEn: "Debug Test Product",
      descriptionEn: "Testing variant saving",
      category: "test",
      isActive: true,
      variants,
      tags: [],
      images: [],
      seoTitle: "",
      seoDescription: "",
      seoKeywords: []
    }

    console.log('=== TESTING PRODUCT SAVE ===')
    console.log('Product data to save:', JSON.stringify(productData, null, 2))

    try {
      const token = localStorage.getItem('admin_token')
      
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(productData),
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Save result:', result)
      
      if (result.success) {
        console.log('✅ Product saved successfully!')
        console.log('Saved variants:', result.data.variants)
        alert(`Product saved successfully! ID: ${result.data.id}`)
      } else {
        console.log('❌ Save failed:', result.error)
        alert('Save failed: ' + result.error)
      }
    } catch (error) {
      console.error('❌ Save error:', error)
      alert('Save error: ' + error.message)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-8">变体功能调试页面</h1>
      
      <div className="space-y-8">
        {/* 当前变体列表 */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">当前变体 ({variants.length})</h2>
          
          {variants.length === 0 ? (
            <p className="text-gray-500">暂无变体</p>
          ) : (
            <div className="space-y-4">
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
                      <Label className="text-xs">SKU</Label>
                      <Input
                        value={variant.sku}
                        onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeVariant(variant.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 添加新变体 */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">添加新变体</h2>
          <div className="grid grid-cols-4 gap-4 items-end">
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
                <option value="均码">均码</option>
              </select>
            </div>
            
            <div>
              <Label className="text-xs">Color</Label>
              <Input
                value={newVariant.color}
                onChange={(e) => setNewVariant(prev => ({ ...prev, color: e.target.value }))}
              />
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
            
            <Button onClick={addVariant} className="bg-pink-600 hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-2" />
              添加变体
            </Button>
          </div>
        </div>

        {/* 测试保存 */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">测试保存功能</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              点击下面的按钮测试产品和变体的保存功能。查看浏览器控制台获取详细日志。
            </p>
            <Button 
              onClick={testSaveProduct}
              className="bg-green-600 hover:bg-green-700"
              disabled={variants.length === 0}
            >
              测试保存产品 ({variants.length} 个变体)
            </Button>
          </div>
        </div>

        {/* 调试信息 */}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h2 className="text-xl font-semibold mb-4">调试信息</h2>
          <div className="space-y-2 text-sm">
            <p><strong>变体数量:</strong> {variants.length}</p>
            <p><strong>变体数据:</strong></p>
            <pre className="bg-white p-2 rounded border text-xs overflow-auto">
              {JSON.stringify(variants, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
