'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [orderInfo, setOrderInfo] = useState<any>(null)
  
  const orderId = searchParams.get('order_id')
  const transactionId = searchParams.get('transaction_id')

  useEffect(() => {
    if (orderId) {
      // In a real implementation, you would fetch order details
      setOrderInfo({
        id: orderId,
        transaction_id: transactionId
      })
    }
  }, [orderId, transactionId])

  const handleTrackOrder = () => {
    router.push('/track-order')
  }

  const handleContinueShopping = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Message */}
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">支付成功！</h1>
              <p className="text-muted-foreground mb-6">
                感谢您的购买，您的订单已成功提交并完成支付。
              </p>
              
              {orderInfo && (
                <div className="bg-muted rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">订单号</p>
                      <p className="font-mono text-xs">{orderInfo.id}</p>
                    </div>
                    {orderInfo.transaction_id && (
                      <div>
                        <p className="font-medium">交易号</p>
                        <p className="font-mono text-xs">{orderInfo.transaction_id}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <Button onClick={handleTrackOrder} className="w-full" size="lg">
                  <Package className="h-4 w-4 mr-2" />
                  跟踪订单状态
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleContinueShopping}
                  className="w-full"
                >
                  继续购物
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                接下来会发生什么？
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">订单确认</p>
                    <p className="text-muted-foreground">我们会向您的邮箱发送订单确认邮件</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">订单处理</p>
                    <p className="text-muted-foreground">我们会在1-2个工作日内处理您的订单</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">发货通知</p>
                    <p className="text-muted-foreground">订单发货后，我们会发送跟踪信息到您的邮箱</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <div>
                    <p className="font-medium">送达</p>
                    <p className="text-muted-foreground">预计3-7个工作日内送达您的地址</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Tracking Info */}
          <Alert>
            <Package className="h-4 w-4" />
            <AlertDescription>
              您可以随时使用订单号和邮箱地址在"跟踪订单"页面查询订单状态。
              如有任何问题，请联系我们的客服团队。
            </AlertDescription>
          </Alert>

          {/* Contact Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-3">需要帮助？</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>客服邮箱: support@owowlove.com</p>
                <p>客服电话: 400-123-4567</p>
                <p>工作时间: 周一至周五 9:00-18:00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
