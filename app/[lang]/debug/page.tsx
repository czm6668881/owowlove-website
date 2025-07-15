'use client'

import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { useState, useEffect } from 'react'

export default function DebugPage() {
  const { cart, addToCart, openCart, isOpen } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddTestItem = () => {
    console.log('Adding test item to cart...')
    addToCart({
      productId: 'debug-product-1',
      variantId: 'debug-variant-1',
      productName: '调试测试商品',
      productImage: '/placeholder.jpg',
      size: 'M',
      color: '蓝色',
      price: 199.99,
      sku: 'DEBUG-001'
    })
    console.log('Test item added, cart should update')
  }

  const handleOpenCart = () => {
    console.log('Opening cart...')
    openCart()
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>购物车调试页面</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 购物车状态 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">购物车状态</h3>
                  <div className="space-y-1 text-sm">
                    <p>商品数量: <span className="font-mono">{cart.itemCount}</span></p>
                    <p>总金额: <span className="font-mono">¥{cart.total.toFixed(2)}</span></p>
                    <p>商品项目: <span className="font-mono">{cart.items.length}</span></p>
                    <p>侧边栏状态: <span className="font-mono">{isOpen ? '打开' : '关闭'}</span></p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">操作按钮</h3>
                  <div className="space-y-2">
                    <Button onClick={handleAddTestItem} className="w-full">
                      添加测试商品
                    </Button>
                    <Button onClick={handleOpenCart} variant="outline" className="w-full">
                      打开购物车
                    </Button>
                  </div>
                </div>
              </div>

              {/* 购物车内容 */}
              <div>
                <h3 className="font-medium mb-4">购物车内容详情</h3>
                {cart.items.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-muted-foreground">购物车为空</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      点击"添加测试商品"按钮来测试功能
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.items.map((item, index) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-500">图片</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.productName}</h4>
                            <p className="text-sm text-muted-foreground">
                              尺寸: {item.size} | 颜色: {item.color}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              SKU: {item.sku}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm">数量: {item.quantity}</span>
                              <span className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 原始数据 */}
              <div>
                <h3 className="font-medium mb-2">原始购物车数据 (JSON)</h3>
                <pre className="p-4 bg-gray-100 rounded-lg text-xs overflow-auto">
                  {JSON.stringify(cart, null, 2)}
                </pre>
              </div>

              {/* 测试说明 */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium mb-2">测试说明</h3>
                <div className="text-sm space-y-1">
                  <p>1. 点击"添加测试商品"按钮，观察购物车状态是否更新</p>
                  <p>2. 点击"打开购物车"按钮，检查侧边栏是否显示</p>
                  <p>3. 查看页面右上角的购物车图标是否显示商品数量</p>
                  <p>4. 检查浏览器控制台是否有错误信息</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
