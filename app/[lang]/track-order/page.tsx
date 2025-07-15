'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Package, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Truck,
  MapPin
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface OrderInfo {
  id: string
  total_amount: number
  status: string
  payment_status: string
  shipping_address: string
  guest_info?: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
  created_at: string
  items: any[]
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrackOrder = async () => {
    if (!orderId.trim() || !email.trim()) {
      setError('请填写订单号和邮箱地址')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setOrderInfo(null)

      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId.trim(),
          email: email.trim()
        })
      })

      const result = await response.json()

      if (result.success && result.data) {
        setOrderInfo(result.data)
      } else {
        setError(result.error || '未找到订单信息，请检查订单号和邮箱地址')
      }
    } catch (error) {
      console.error('Track order error:', error)
      setError('查询订单时发生错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'processing':
        return <Package className="h-4 w-4 text-blue-600" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-600" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理'
      case 'processing':
        return '处理中'
      case 'shipped':
        return '已发货'
      case 'delivered':
        return '已送达'
      case 'cancelled':
        return '已取消'
      default:
        return '未知状态'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待支付'
      case 'paid':
        return '已支付'
      case 'failed':
        return '支付失败'
      default:
        return '未知状态'
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'delivered':
      case 'paid':
        return 'default'
      case 'pending':
      case 'processing':
      case 'shipped':
        return 'secondary'
      case 'cancelled':
      case 'failed':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">订单跟踪</h1>
            <p className="text-muted-foreground">
              输入您的订单号和邮箱地址来查询订单状态
            </p>
          </div>

          {/* Search Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>查询订单</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="order-id">订单号 *</Label>
                <Input
                  id="order-id"
                  placeholder="请输入订单号"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">邮箱地址 *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入下单时使用的邮箱地址"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleTrackOrder}
                disabled={isLoading || !orderId.trim() || !email.trim()}
                className="w-full"
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? '查询中...' : '查询订单'}
              </Button>
            </CardContent>
          </Card>

          {/* Order Information */}
          {orderInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>订单信息</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>订单状态</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusVariant(orderInfo.status)}>
                        {getStatusIcon(orderInfo.status)}
                        <span className="ml-1">{getStatusText(orderInfo.status)}</span>
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label>支付状态</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusVariant(orderInfo.payment_status)}>
                        {getPaymentStatusText(orderInfo.payment_status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>订单号</Label>
                    <p className="font-mono">{orderInfo.id}</p>
                  </div>
                  <div>
                    <Label>订单金额</Label>
                    <p className="font-semibold">¥{orderInfo.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label>下单时间</Label>
                    <p>{new Date(orderInfo.created_at).toLocaleString('zh-CN')}</p>
                  </div>
                  <div>
                    <Label>商品数量</Label>
                    <p>{orderInfo.items?.length || 0} 件</p>
                  </div>
                </div>

                {/* Customer Info */}
                {orderInfo.guest_info && (
                  <div>
                    <Label>客户信息</Label>
                    <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                      <p><strong>姓名:</strong> {orderInfo.guest_info.first_name} {orderInfo.guest_info.last_name}</p>
                      <p><strong>邮箱:</strong> {orderInfo.guest_info.email}</p>
                      <p><strong>电话:</strong> {orderInfo.guest_info.phone}</p>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                <div>
                  <Label className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>收货地址</span>
                  </Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg text-sm">
                    {orderInfo.shipping_address}
                  </div>
                </div>

                {/* Order Items */}
                {orderInfo.items && orderInfo.items.length > 0 && (
                  <div>
                    <Label>订单商品</Label>
                    <div className="mt-2 space-y-2">
                      {orderInfo.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg text-sm">
                          <div>
                            <p className="font-medium">商品 #{index + 1}</p>
                            <p className="text-muted-foreground">数量: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">¥{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Help Information */}
          <Card>
            <CardHeader>
              <CardTitle>需要帮助？</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>如果您无法找到订单信息或有任何问题，请联系我们的客服团队：</p>
              <ul className="mt-2 space-y-1">
                <li>• 客服邮箱: support@owowlove.com</li>
                <li>• 客服电话: 400-123-4567</li>
                <li>• 工作时间: 周一至周五 9:00-18:00</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
