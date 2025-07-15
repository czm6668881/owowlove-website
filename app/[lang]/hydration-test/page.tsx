'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { useCart } from '@/contexts/cart-context'
import { useFavorites } from '@/contexts/favorites-context'

export default function HydrationTestPage() {
  const [mounted, setMounted] = useState(false)
  const [testResults, setTestResults] = useState<Array<{
    name: string
    status: 'pass' | 'fail' | 'pending'
    message: string
  }>>([])

  const { cart, addToCart } = useCart()
  const { favoriteCount, addToFavorites } = useFavorites()

  useEffect(() => {
    setMounted(true)
    runHydrationTests()
  }, [])

  const runHydrationTests = () => {
    const tests = [
      {
        name: '购物车状态一致性',
        test: () => {
          // 测试购物车初始状态
          return cart.itemCount === 0 && cart.total === 0 && Array.isArray(cart.items)
        }
      },
      {
        name: '收藏夹状态一致性',
        test: () => {
          // 测试收藏夹初始状态
          return favoriteCount === 0
        }
      },
      {
        name: '浏览器API可用性',
        test: () => {
          // 测试浏览器API
          return typeof window !== 'undefined' && typeof navigator !== 'undefined'
        }
      },
      {
        name: '本地存储可用性',
        test: () => {
          // 测试localStorage
          try {
            localStorage.setItem('test', 'test')
            localStorage.removeItem('test')
            return true
          } catch {
            return false
          }
        }
      }
    ]

    const results = tests.map(({ name, test }) => {
      try {
        const passed = test()
        return {
          name,
          status: passed ? 'pass' : 'fail' as const,
          message: passed ? '测试通过' : '测试失败'
        }
      } catch (error) {
        return {
          name,
          status: 'fail' as const,
          message: `错误: ${error instanceof Error ? error.message : '未知错误'}`
        }
      }
    })

    setTestResults(results)
  }

  const handleAddToCart = () => {
    addToCart({
      productId: 'test-product',
      variantId: 'test-variant',
      productName: '测试商品',
      productImage: '/placeholder.jpg',
      size: 'M',
      color: '红色',
      price: 99.99,
      sku: 'TEST-001'
    })
  }

  const handleAddToFavorites = () => {
    addToFavorites({
      productId: 'test-product',
      productName: '测试商品',
      productImage: '/placeholder.jpg',
      price: 99.99
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-600">通过</Badge>
      case 'fail':
        return <Badge variant="destructive">失败</Badge>
      default:
        return <Badge variant="secondary">待测</Badge>
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>正在加载...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 标题 */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">水合错误测试</h1>
            <p className="text-muted-foreground">
              检查服务器端渲染和客户端渲染的一致性
            </p>
          </div>

          {/* 状态显示 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>购物车状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>商品数量: {cart.itemCount}</p>
                  <p>总金额: ¥{cart.total.toFixed(2)}</p>
                  <p>商品列表: {cart.items.length} 项</p>
                </div>
                <Button onClick={handleAddToCart} className="w-full mt-4">
                  添加测试商品
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>收藏夹状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p>收藏数量: {favoriteCount}</p>
                </div>
                <Button onClick={handleAddToFavorites} className="w-full mt-4">
                  添加测试收藏
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 测试结果 */}
          <Card>
            <CardHeader>
              <CardTitle>水合测试结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.name}</div>
                        <div className="text-sm text-muted-foreground">{result.message}</div>
                      </div>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                ))}
              </div>
              
              <Button onClick={runHydrationTests} className="w-full mt-4">
                重新运行测试
              </Button>
            </CardContent>
          </Card>

          {/* 说明 */}
          <Card>
            <CardHeader>
              <CardTitle>说明</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p>这个页面用于测试水合错误是否已修复：</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>检查购物车和收藏夹的初始状态</li>
                  <li>验证浏览器API的可用性</li>
                  <li>测试本地存储功能</li>
                  <li>确保服务器端和客户端渲染一致</li>
                </ul>
                <p className="mt-4">
                  如果所有测试都通过，说明水合错误已经修复。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
