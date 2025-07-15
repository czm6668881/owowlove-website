'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle, ShoppingBag } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { useCart } from '@/contexts/cart-context'
import { useUserAuth } from '@/contexts/user-auth-context'
import Image from 'next/image'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const { user } = useUserAuth()

  // Guest checkout form data
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  })
  const [isGuest, setIsGuest] = useState(false)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/')
      return
    }

    // Check if user is logged in
    if (user) {
      setIsGuest(false)
      // Pre-fill guest info with user data
      setGuestInfo({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    } else {
      setIsGuest(true)
    }
  }, [user, cart.items.length, router])

  const validateGuestInfo = () => {
    if (!guestInfo.firstName.trim()) {
      setError('请填写名字')
      return false
    }
    if (!guestInfo.lastName.trim()) {
      setError('请填写姓氏')
      return false
    }
    if (!guestInfo.email.trim()) {
      setError('请填写邮箱地址')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      setError('请填写有效的邮箱地址')
      return false
    }
    if (!guestInfo.phone.trim()) {
      setError('请填写电话号码')
      return false
    }
    if (!guestInfo.address.trim()) {
      setError('请填写收货地址')
      return false
    }
    return true
  }

  const handleCreateOrder = async () => {
    if (!validateGuestInfo()) {
      return
    }

    try {
      setIsCreatingOrder(true)
      setError('')

      // Create order with guest or user info
      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.productId,
          variant_id: item.variantId,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: cart.total,
        shipping_address: guestInfo.address,
        payment_method: 'pending',
        payment_status: 'pending',
        // Guest checkout info
        guest_info: isGuest ? {
          first_name: guestInfo.firstName,
          last_name: guestInfo.lastName,
          email: guestInfo.email,
          phone: guestInfo.phone
        } : null
      }

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      const orderResult = await orderResponse.json()

      if (orderResult.success && orderResult.data) {
        // Navigate to payment
        router.push(`/payment?order_id=${orderResult.data.id}`)
      } else {
        setError(orderResult.error || '创建订单失败')
      }
    } catch (error) {
      console.error('Create order error:', error)
      setError('创建订单时发生错误，请重试')
    } finally {
      setIsCreatingOrder(false)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">购物车为空</h1>
            <p className="text-muted-foreground mb-6">请先添加商品到购物车</p>
            <Button onClick={() => router.push('/')}>
              继续购物
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">结账</h1>
              <p className="text-muted-foreground">确认您的订单信息</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-3">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={60}
                      height={60}
                      className="rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.productName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {item.size} / {item.color}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm">数量: {item.quantity}</span>
                        <span className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>总计:</span>
                    <span className="text-primary">¥{cart.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {isGuest ? '访客结账' : '用户信息'}
                </CardTitle>
                {isGuest && (
                  <p className="text-sm text-muted-foreground">
                    无需注册账户，填写以下信息即可完成购买
                  </p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">名字 *</Label>
                    <Input
                      id="first-name"
                      placeholder="请输入名字"
                      value={guestInfo.firstName}
                      onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                      disabled={!isGuest}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">姓氏 *</Label>
                    <Input
                      id="last-name"
                      placeholder="请输入姓氏"
                      value={guestInfo.lastName}
                      onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                      disabled={!isGuest}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址 *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="请输入邮箱地址"
                    value={guestInfo.email}
                    onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                    disabled={!isGuest}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">电话号码 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="请输入电话号码"
                    value={guestInfo.phone}
                    onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                    disabled={!isGuest}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping-address">收货地址 *</Label>
                  <Textarea
                    id="shipping-address"
                    placeholder="请输入详细的收货地址..."
                    value={guestInfo.address}
                    onChange={(e) => setGuestInfo({...guestInfo, address: e.target.value})}
                    rows={4}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {isGuest && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      您正在以访客身份结账。订单完成后，我们会将订单信息发送到您的邮箱。
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Button
                    onClick={handleCreateOrder}
                    disabled={isCreatingOrder}
                    className="w-full"
                    size="lg"
                  >
                    {isCreatingOrder ? '创建订单中...' : '确认订单并支付'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full"
                  >
                    返回购物车
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
