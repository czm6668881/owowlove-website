'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ExternalLink,
  QrCode,
  CreditCard,
  RefreshCw
} from 'lucide-react'
import { PaymentTransaction } from '@/lib/types/payment'
import { usePayment } from '@/contexts/payment-context'
import { StripePaymentForm } from './stripe-payment-form'

interface PaymentProcessorProps {
  transaction: PaymentTransaction
  onPaymentComplete?: () => void
  onPaymentFailed?: () => void
}

export function PaymentProcessor({ 
  transaction, 
  onPaymentComplete, 
  onPaymentFailed 
}: PaymentProcessorProps) {
  const { checkPaymentStatus, isLoading } = usePayment()
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)

  // Generate QR code if needed
  useEffect(() => {
    if (transaction.qr_code_url) {
      // In a real implementation, you would use a QR code library
      // For now, we'll just store the URL
      setQrCodeDataUrl(transaction.qr_code_url)
    }
  }, [transaction.qr_code_url])

  // Calculate time remaining
  useEffect(() => {
    if (transaction.expires_at && typeof window !== 'undefined') {
      const updateTimeRemaining = () => {
        const now = new Date().getTime()
        const expiry = new Date(transaction.expires_at!).getTime()
        const remaining = Math.max(0, expiry - now)
        setTimeRemaining(remaining)

        if (remaining === 0) {
          clearInterval(statusCheckInterval!)
        }
      }

      updateTimeRemaining()
      const timer = setInterval(updateTimeRemaining, 1000)

      return () => clearInterval(timer)
    }
  }, [transaction.expires_at, statusCheckInterval])

  // Auto-check payment status
  useEffect(() => {
    if (transaction.status === 'pending' || transaction.status === 'processing') {
      const interval = setInterval(async () => {
        try {
          const result = await checkPaymentStatus(transaction.id)
          if (result.success && result.transaction) {
            if (result.transaction.status === 'completed') {
              clearInterval(interval)
              onPaymentComplete?.()
            } else if (result.transaction.status === 'failed' || result.transaction.status === 'cancelled') {
              clearInterval(interval)
              onPaymentFailed?.()
            }
          }
        } catch (error) {
          console.error('Error checking payment status:', error)
        }
      }, 3000) // Check every 3 seconds

      setStatusCheckInterval(interval)

      return () => {
        if (interval) clearInterval(interval)
      }
    }
  }, [transaction.id, transaction.status, checkPaymentStatus, onPaymentComplete, onPaymentFailed])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'failed':
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '支付成功'
      case 'pending':
        return '等待支付'
      case 'processing':
        return '支付处理中'
      case 'failed':
        return '支付失败'
      case 'cancelled':
        return '支付已取消'
      default:
        return '未知状态'
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'pending':
      case 'processing':
        return 'secondary'
      case 'failed':
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleManualRefresh = async () => {
    await checkPaymentStatus(transaction.id)
  }

  const handlePaymentRedirect = () => {
    if (transaction.payment_url) {
      window.open(transaction.payment_url, '_blank')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>支付处理</span>
          <Badge variant={getStatusVariant(transaction.status)}>
            {getStatusIcon(transaction.status)}
            <span className="ml-1">{getStatusText(transaction.status)}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Payment Info */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">订单金额:</span>
            <span className="font-medium">¥{transaction.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">支付方式:</span>
            <span className="font-medium">{transaction.provider}</span>
          </div>
          {timeRemaining > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">剩余时间:</span>
              <span className="font-medium text-orange-600">
                {formatTimeRemaining(timeRemaining)}
              </span>
            </div>
          )}
        </div>

        {/* QR Code Payment */}
        {transaction.qr_code_url && (transaction.status === 'pending' || transaction.status === 'processing') && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
                <QrCode className="h-32 w-32 text-gray-400" />
                <p className="text-xs text-muted-foreground mt-2">扫码支付</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              请使用{transaction.provider === 'alipay' ? '支付宝' : '微信'}扫描二维码完成支付
            </p>
          </div>
        )}

        {/* Redirect Payment */}
        {transaction.payment_url && !transaction.qr_code_url && (
          <div className="text-center space-y-4">
            <Button 
              onClick={handlePaymentRedirect}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              前往支付页面
            </Button>
            <p className="text-sm text-muted-foreground">
              点击按钮将在新窗口中打开支付页面
            </p>
          </div>
        )}

        {/* Credit Card Payment */}
        {transaction.provider === 'credit_card' && (transaction.status === 'pending' || transaction.status === 'processing') && (
          <div className="space-y-4">
            <StripePaymentForm
              clientSecret={transaction.payment_data?.client_secret}
              amount={transaction.amount}
              currency={transaction.currency}
              onSuccess={onPaymentComplete || (() => {})}
              onError={(error) => console.error('Stripe payment error:', error)}
            />
          </div>
        )}

        {/* Payment Status Messages */}
        {transaction.status === 'completed' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              支付已成功完成！您的订单正在处理中。
            </AlertDescription>
          </Alert>
        )}

        {transaction.status === 'failed' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              支付失败，请重试或选择其他支付方式。
            </AlertDescription>
          </Alert>
        )}

        {transaction.status === 'cancelled' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              支付已取消，您可以重新发起支付。
            </AlertDescription>
          </Alert>
        )}

        {timeRemaining === 0 && (transaction.status === 'pending' || transaction.status === 'processing') && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              支付已超时，请重新发起支付。
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="flex-1"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            刷新状态
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
