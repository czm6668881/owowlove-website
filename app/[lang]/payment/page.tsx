'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { PaymentMethodSelector } from '@/components/payment/payment-method-selector'
import { PaymentProcessor } from '@/components/payment/payment-processor'
import { usePayment } from '@/contexts/payment-context'
import { useCart } from '@/contexts/cart-context'
import { PaymentMethod, PaymentTransaction } from '@/lib/types/payment'

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { 
    selectedPaymentMethod, 
    currentTransaction, 
    createPayment, 
    isLoading, 
    error 
  } = usePayment()
  const { cart, clearCart } = useCart()
  
  const [step, setStep] = useState<'select' | 'process' | 'complete'>('select')
  const [orderData, setOrderData] = useState<any>(null)

  // Get order ID from URL params
  const orderId = searchParams.get('order_id')

  useEffect(() => {
    if (!orderId) {
      router.push('/cart')
      return
    }

    // Fetch order details from API
    fetchOrderDetails(orderId)
  }, [orderId, router])

  const fetchOrderDetails = async (orderId: string) => {
    try {
      // Try to fetch order details
      // For now, we'll use cart data as fallback
      setOrderData({
        id: orderId,
        total: cart.total,
        items: cart.items
      })
    } catch (error) {
      console.error('Error fetching order details:', error)
      // Fallback to cart data
      setOrderData({
        id: orderId,
        total: cart.total,
        items: cart.items
      })
    }
  }

  const handleMethodSelect = (method: PaymentMethod) => {
    // Method is already selected via context
  }

  const handlePaymentCreate = async () => {
    if (!selectedPaymentMethod || !orderData) {
      return
    }

    try {
      const result = await createPayment({
        order_id: orderData.id,
        payment_method: selectedPaymentMethod.name,
        amount: orderData.total,
        currency: 'CNY'
      })

      if (result.success) {
        setStep('process')
      }
    } catch (error) {
      console.error('Payment creation error:', error)
    }
  }

  const handlePaymentComplete = () => {
    clearCart()
    // Redirect to success page
    router.push(`/payment/success?order_id=${orderData.id}&transaction_id=${currentTransaction?.id}`)
  }

  const handlePaymentFailed = () => {
    setStep('select')
  }

  const handleBackToCart = () => {
    router.push('/cart')
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  if (!orderId || !orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              订单信息不存在，请重新下单。
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToCart}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">支付订单</h1>
              <p className="text-muted-foreground">订单号: {orderData.id}</p>
            </div>
          </div>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>订单摘要</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>商品数量:</span>
                  <span>{orderData.items?.length || 0} 件</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>总金额:</span>
                  <span className="text-primary">¥{orderData.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Steps */}
          {step === 'select' && (
            <div className="space-y-6">
              <PaymentMethodSelector onMethodSelect={handleMethodSelect} />
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToCart}
                  className="flex-1"
                >
                  返回购物车
                </Button>
                <Button 
                  onClick={handlePaymentCreate}
                  disabled={!selectedPaymentMethod || isLoading}
                  className="flex-1"
                >
                  {isLoading ? '创建支付中...' : '确认支付'}
                </Button>
              </div>
            </div>
          )}

          {step === 'process' && currentTransaction && (
            <PaymentProcessor
              transaction={currentTransaction}
              onPaymentComplete={handlePaymentComplete}
              onPaymentFailed={handlePaymentFailed}
            />
          )}

          {step === 'complete' && (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">支付成功！</h2>
                <p className="text-muted-foreground mb-6">
                  您的订单已支付成功，我们将尽快为您处理。
                </p>
                <div className="space-y-2">
                  <Button onClick={handleBackToHome} className="w-full">
                    返回首页
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/account')}
                    className="w-full"
                  >
                    查看订单
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
