'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle,
  Play,
  RefreshCw
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { StripePaymentForm } from '@/components/payment/stripe-payment-form'

export default function StripeTestPage() {
  const [testAmount, setTestAmount] = useState('29.99')
  const [testOrderId, setTestOrderId] = useState('')
  const [paymentIntent, setPaymentIntent] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Generate test order ID
    setTestOrderId(`TEST_${Date.now()}`)
  }, [])

  const handleCreatePaymentIntent = async () => {
    try {
      setIsCreating(true)
      setError('')
      setPaymentIntent(null)

      const response = await fetch('/api/payment/stripe/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(testAmount),
          order_id: testOrderId,
          currency: 'USD'
        })
      })

      const result = await response.json()

      if (result.success) {
        setPaymentIntent(result.data)
      } else {
        setError(result.error || 'Failed to create payment intent')
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      setError('Failed to create payment intent')
    } finally {
      setIsCreating(false)
    }
  }

  const handlePaymentSuccess = () => {
    setSuccess(true)
    setPaymentIntent(null)
  }

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const handleReset = () => {
    setSuccess(false)
    setError('')
    setPaymentIntent(null)
    setTestOrderId(`TEST_${Date.now()}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Stripe 支付测试</h1>
            <p className="text-muted-foreground">
              测试 Stripe 信用卡支付功能
            </p>
          </div>

          {/* Test Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>测试配置</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-amount">测试金额 (USD)</Label>
                  <Input
                    id="test-amount"
                    type="number"
                    step="0.01"
                    value={testAmount}
                    onChange={(e) => setTestAmount(e.target.value)}
                    placeholder="输入测试金额"
                  />
                </div>
                <div>
                  <Label htmlFor="test-order-id">测试订单ID</Label>
                  <Input
                    id="test-order-id"
                    value={testOrderId}
                    onChange={(e) => setTestOrderId(e.target.value)}
                    placeholder="订单ID"
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleCreatePaymentIntent}
                disabled={isCreating || !testAmount || !testOrderId}
                className="w-full"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                {isCreating ? '创建中...' : '创建支付意图'}
              </Button>
            </CardContent>
          </Card>

          {/* Payment Intent Info */}
          {paymentIntent && (
            <Card>
              <CardHeader>
                <CardTitle>支付意图信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>支付意图ID:</span>
                    <span className="font-mono text-xs">{paymentIntent.payment_intent_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>金额:</span>
                    <span>{paymentIntent.currency?.toUpperCase()} {paymentIntent.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>客户端密钥:</span>
                    <span className="font-mono text-xs truncate max-w-32">
                      {paymentIntent.client_secret?.substring(0, 20)}...
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Form */}
          {paymentIntent && !success && (
            <StripePaymentForm
              clientSecret={paymentIntent.client_secret}
              amount={paymentIntent.amount}
              currency={paymentIntent.currency || 'USD'}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          )}

          {/* Success Message */}
          {success && (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">支付成功！</h2>
                <p className="text-muted-foreground mb-6">
                  Stripe 支付测试已成功完成。
                </p>
                <Button onClick={handleReset}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重新测试
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Test Cards Info */}
          <Card>
            <CardHeader>
              <CardTitle>测试卡号</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">成功支付</p>
                    <p className="text-sm text-muted-foreground font-mono">4242 4242 4242 4242</p>
                  </div>
                  <Badge variant="default">成功</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">支付失败</p>
                    <p className="text-sm text-muted-foreground font-mono">4000 0000 0000 0002</p>
                  </div>
                  <Badge variant="destructive">失败</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">需要验证</p>
                    <p className="text-sm text-muted-foreground font-mono">4000 0025 0000 3155</p>
                  </div>
                  <Badge variant="secondary">3D Secure</Badge>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p><strong>过期日期:</strong> 任何未来日期 (如: 12/25)</p>
                <p><strong>CVC:</strong> 任何3位数字 (如: 123)</p>
                <p><strong>邮编:</strong> 任何5位数字 (如: 12345)</p>
              </div>
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>API 端点</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="bg-muted px-2 py-1 rounded">POST /api/payment/stripe/create-intent</code>
                  <p className="text-muted-foreground">创建支付意图</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">POST /api/payment/stripe/confirm</code>
                  <p className="text-muted-foreground">确认支付</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">GET /api/payment/stripe/config</code>
                  <p className="text-muted-foreground">获取Stripe配置</p>
                </div>
                <div>
                  <code className="bg-muted px-2 py-1 rounded">POST /api/payment/webhook/stripe</code>
                  <p className="text-muted-foreground">Webhook处理</p>
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
