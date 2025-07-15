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
  Wallet, 
  Smartphone, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Play
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { PaymentMethodSelector } from '@/components/payment/payment-method-selector'
import { usePayment } from '@/contexts/payment-context'

export default function PaymentDemoPage() {
  const { 
    availablePaymentMethods, 
    selectedPaymentMethod, 
    createPayment, 
    checkPaymentStatus,
    isLoading, 
    error 
  } = usePayment()
  
  const [demoAmount, setDemoAmount] = useState('99.99')
  const [demoOrderId, setDemoOrderId] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [isTestRunning, setIsTestRunning] = useState(false)

  useEffect(() => {
    // 生成演示订单ID
    setDemoOrderId(`DEMO_${Date.now()}`)
  }, [])

  const handleTestPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('请先选择支付方式')
      return
    }

    try {
      setIsTestRunning(true)
      setTestResult(null)

      const result = await createPayment({
        order_id: demoOrderId,
        payment_method: selectedPaymentMethod.name,
        amount: parseFloat(demoAmount),
        currency: 'CNY'
      })

      setTestResult(result)
    } catch (error) {
      console.error('Test payment error:', error)
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setIsTestRunning(false)
    }
  }

  const handleTestStatusCheck = async () => {
    if (!testResult?.transaction_id) {
      alert('请先创建测试支付')
      return
    }

    try {
      setIsTestRunning(true)
      const statusResult = await checkPaymentStatus(testResult.transaction_id)
      setTestResult({
        ...testResult,
        statusCheck: statusResult
      })
    } catch (error) {
      console.error('Status check error:', error)
    } finally {
      setIsTestRunning(false)
    }
  }

  const getPaymentIcon = (methodName: string) => {
    switch (methodName) {
      case 'alipay':
        return <Wallet className="h-5 w-5 text-blue-600" />
      case 'wechat':
        return <Smartphone className="h-5 w-5 text-green-600" />
      case 'credit_card':
        return <CreditCard className="h-5 w-5 text-purple-600" />
      default:
        return <Wallet className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">支付系统演示</h1>
            <p className="text-muted-foreground">
              测试和演示 OWOWLOVE.COM 支付系统的功能
            </p>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>系统状态</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {availablePaymentMethods.length}
                  </div>
                  <div className="text-sm text-muted-foreground">可用支付方式</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {availablePaymentMethods.filter(m => m.is_active).length}
                  </div>
                  <div className="text-sm text-muted-foreground">已启用方式</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedPaymentMethod ? '1' : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">已选择方式</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>可用支付方式</CardTitle>
            </CardHeader>
            <CardContent>
              {availablePaymentMethods.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>暂无可用的支付方式</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availablePaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      {getPaymentIcon(method.name)}
                      <div className="flex-1">
                        <div className="font-medium">{method.display_name}</div>
                        <div className="text-sm text-muted-foreground">{method.name}</div>
                      </div>
                      <Badge variant={method.is_active ? 'default' : 'secondary'}>
                        {method.is_active ? '启用' : '禁用'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Method Selector */}
          <PaymentMethodSelector />

          {/* Test Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>测试支付</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="demo-amount">测试金额 (CNY)</Label>
                  <Input
                    id="demo-amount"
                    type="number"
                    step="0.01"
                    value={demoAmount}
                    onChange={(e) => setDemoAmount(e.target.value)}
                    placeholder="输入测试金额"
                  />
                </div>
                <div>
                  <Label htmlFor="demo-order-id">演示订单ID</Label>
                  <Input
                    id="demo-order-id"
                    value={demoOrderId}
                    onChange={(e) => setDemoOrderId(e.target.value)}
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

              <div className="flex space-x-2">
                <Button 
                  onClick={handleTestPayment}
                  disabled={!selectedPaymentMethod || isTestRunning || isLoading}
                  className="flex-1"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isTestRunning ? '创建中...' : '创建测试支付'}
                </Button>
                
                {testResult?.transaction_id && (
                  <Button 
                    variant="outline"
                    onClick={handleTestStatusCheck}
                    disabled={isTestRunning}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isTestRunning ? 'animate-spin' : ''}`} />
                    查询状态
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Test Results */}
          {testResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {testResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span>测试结果</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>创建结果</Label>
                      <Badge variant={testResult.success ? 'default' : 'destructive'}>
                        {testResult.success ? '成功' : '失败'}
                      </Badge>
                    </div>
                    
                    {testResult.transaction_id && (
                      <div>
                        <Label>交易ID</Label>
                        <p className="font-mono text-xs">{testResult.transaction_id}</p>
                      </div>
                    )}
                    
                    {testResult.payment_url && (
                      <div>
                        <Label>支付链接</Label>
                        <p className="text-xs text-blue-600 truncate">{testResult.payment_url}</p>
                      </div>
                    )}
                    
                    {testResult.qr_code_url && (
                      <div>
                        <Label>二维码链接</Label>
                        <p className="text-xs text-green-600 truncate">{testResult.qr_code_url}</p>
                      </div>
                    )}
                  </div>

                  {testResult.error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{testResult.error}</AlertDescription>
                    </Alert>
                  )}

                  {testResult.statusCheck && (
                    <div className="border-t pt-4">
                      <Label>状态查询结果</Label>
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <pre className="text-xs overflow-auto">
                          {JSON.stringify(testResult.statusCheck, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <Label>完整响应</Label>
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(testResult, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>API 文档</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">主要端点</h4>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li><code>GET /api/payment/methods</code> - 获取支付方式</li>
                    <li><code>POST /api/payment/create</code> - 创建支付</li>
                    <li><code>GET /api/payment/status/{id}</code> - 查询支付状态</li>
                    <li><code>POST /api/payment/refund</code> - 申请退款</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">管理员端点</h4>
                  <ul className="mt-2 space-y-1 text-muted-foreground">
                    <li><code>GET /api/admin/payment/transactions</code> - 所有交易记录</li>
                    <li><code>GET /api/admin/payment/methods</code> - 支付方式管理</li>
                  </ul>
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
