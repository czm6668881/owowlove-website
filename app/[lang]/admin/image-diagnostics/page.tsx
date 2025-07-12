'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Product {
  id: string
  name: string
  images: string[]
  is_active: boolean
  created_at: string
}

interface ImageDiagnostic {
  productId: string
  productName: string
  imageUrl: string
  status: 'loading' | 'success' | 'error'
  error?: string
}

export default function ImageDiagnosticsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [diagnostics, setDiagnostics] = useState<ImageDiagnostic[]>([])
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState({
    total: 0,
    success: 0,
    error: 0,
    loading: 0
  })

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const testImageUrl = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
      
      // 设置超时
      setTimeout(() => resolve(false), 5000)
    })
  }

  const runDiagnostics = async () => {
    setLoading(true)
    const newDiagnostics: ImageDiagnostic[] = []

    // 收集所有图片URL
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          newDiagnostics.push({
            productId: product.id,
            productName: product.name,
            imageUrl,
            status: 'loading'
          })
        }
      }
    }

    setDiagnostics(newDiagnostics)

    // 测试每个图片
    for (let i = 0; i < newDiagnostics.length; i++) {
      const diagnostic = newDiagnostics[i]
      
      try {
        const success = await testImageUrl(diagnostic.imageUrl)
        diagnostic.status = success ? 'success' : 'error'
        if (!success) {
          diagnostic.error = 'Image failed to load'
        }
      } catch (error) {
        diagnostic.status = 'error'
        diagnostic.error = error instanceof Error ? error.message : 'Unknown error'
      }

      // 更新状态
      setDiagnostics([...newDiagnostics])
      
      // 更新摘要
      const currentSummary = {
        total: newDiagnostics.length,
        success: newDiagnostics.filter(d => d.status === 'success').length,
        error: newDiagnostics.filter(d => d.status === 'error').length,
        loading: newDiagnostics.filter(d => d.status === 'loading').length
      }
      setSummary(currentSummary)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const currentSummary = {
      total: diagnostics.length,
      success: diagnostics.filter(d => d.status === 'success').length,
      error: diagnostics.filter(d => d.status === 'error').length,
      loading: diagnostics.filter(d => d.status === 'loading').length
    }
    setSummary(currentSummary)
  }, [diagnostics])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">图片诊断工具</h1>
        <p className="text-gray-600">检查所有产品图片的可访问性</p>
      </div>

      {/* 控制面板 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>诊断控制</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={runDiagnostics} 
              disabled={loading || products.length === 0}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? '检查中...' : '开始诊断'}
            </Button>
            
            <div className="text-sm text-gray-600">
              找到 {products.length} 个产品
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 摘要 */}
      {diagnostics.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>诊断摘要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{summary.total}</div>
                <div className="text-sm text-gray-600">总图片数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.success}</div>
                <div className="text-sm text-gray-600">成功加载</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{summary.error}</div>
                <div className="text-sm text-gray-600">加载失败</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.loading}</div>
                <div className="text-sm text-gray-600">检查中</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 详细结果 */}
      {diagnostics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>详细结果</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnostics.map((diagnostic, index) => (
                <div key={`${diagnostic.productId}-${diagnostic.imageUrl}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{diagnostic.productName}</div>
                    <div className="text-sm text-gray-600 break-all">{diagnostic.imageUrl}</div>
                    {diagnostic.error && (
                      <div className="text-sm text-red-600 mt-1">{diagnostic.error}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* 状态图标 */}
                    {diagnostic.status === 'loading' && (
                      <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {diagnostic.status === 'success' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {diagnostic.status === 'error' && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    
                    {/* 状态标签 */}
                    <Badge 
                      variant={
                        diagnostic.status === 'success' ? 'default' :
                        diagnostic.status === 'error' ? 'destructive' : 'secondary'
                      }
                    >
                      {diagnostic.status === 'loading' ? '检查中' :
                       diagnostic.status === 'success' ? '成功' : '失败'}
                    </Badge>
                    
                    {/* 预览图片 */}
                    {diagnostic.status === 'success' && (
                      <img 
                        src={diagnostic.imageUrl} 
                        alt="预览" 
                        className="w-12 h-12 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {products.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">没有找到产品数据</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
