'use client'

import { useCart } from '@/contexts/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function CartTestPage() {
  const { cart, addToCart, openCart } = useCart()

  const handleAddTestItem = () => {
    addToCart({
      productId: 'test-product-1',
      variantId: 'test-variant-1',
      productName: '测试商品',
      productImage: '/placeholder.jpg',
      size: 'M',
      color: '红色',
      price: 99.99,
      sku: 'TEST-001'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>购物车功能测试</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">当前购物车状态:</h3>
                <p>商品数量: {cart.itemCount}</p>
                <p>总金额: ¥{cart.total.toFixed(2)}</p>
                <p>商品列表: {cart.items.length} 项</p>
              </div>

              <div className="space-y-2">
                <Button onClick={handleAddTestItem} className="w-full">
                  添加测试商品到购物车
                </Button>
                
                <Button onClick={openCart} variant="outline" className="w-full">
                  打开购物车侧边栏
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">购物车商品:</h3>
                {cart.items.length === 0 ? (
                  <p className="text-muted-foreground">购物车为空</p>
                ) : (
                  <div className="space-y-2">
                    {cart.items.map((item) => (
                      <div key={item.id} className="p-2 border rounded">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.size} / {item.color} - 数量: {item.quantity}
                        </p>
                        <p className="text-sm">¥{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
