'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  Lock, 
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface StripePaymentFormProps {
  clientSecret?: string
  amount: number
  currency: string
  onSuccess: () => void
  onError: (error: string) => void
}

export function StripePaymentForm({ 
  clientSecret, 
  amount, 
  currency, 
  onSuccess, 
  onError 
}: StripePaymentFormProps) {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateCard = () => {
    const newErrors: Record<string, string> = {}

    // Card number validation (basic)
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 13) {
      newErrors.number = '请输入有效的卡号'
    }

    // Expiry validation
    if (!cardData.expiry || !/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = '请输入有效的过期日期 (MM/YY)'
    }

    // CVC validation
    if (!cardData.cvc || cardData.cvc.length < 3) {
      newErrors.cvc = '请输入有效的CVC'
    }

    // Name validation
    if (!cardData.name.trim()) {
      newErrors.name = '请输入持卡人姓名'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    
    return v
  }

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value

    if (field === 'number') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value)
    } else if (field === 'cvc') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4)
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!validateCard()) {
      return
    }

    setIsProcessing(true)

    try {
      // 模拟支付处理，基于卡号判断结果
      const cardNumber = cardData.number.replace(/\s/g, '')

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (cardNumber.startsWith('4242')) {
        // 成功支付
        onSuccess()
      } else if (cardNumber.startsWith('4000000000000002')) {
        // 支付失败
        onError('您的卡被拒绝了')
      } else if (cardNumber.startsWith('4000002500003155')) {
        // 需要3D验证
        onError('需要额外验证，请联系您的银行')
      } else {
        // 默认成功
        onSuccess()
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : '支付处理失败')
    } finally {
      setIsProcessing(false)
    }
  }

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, '')
    
    if (num.startsWith('4')) return 'Visa'
    if (num.startsWith('5') || num.startsWith('2')) return 'Mastercard'
    if (num.startsWith('3')) return 'American Express'
    
    return 'Card'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>信用卡支付</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="card-number">卡号 *</Label>
            <div className="relative">
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                maxLength={19}
                className={errors.number ? 'border-red-500' : ''}
              />
              {cardData.number && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                  {getCardType(cardData.number)}
                </div>
              )}
            </div>
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number}</p>
            )}
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">过期日期 *</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => handleInputChange('expiry', e.target.value)}
                maxLength={5}
                className={errors.expiry ? 'border-red-500' : ''}
              />
              {errors.expiry && (
                <p className="text-sm text-red-500">{errors.expiry}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc">CVC *</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={cardData.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value)}
                maxLength={4}
                className={errors.cvc ? 'border-red-500' : ''}
              />
              {errors.cvc && (
                <p className="text-sm text-red-500">{errors.cvc}</p>
              )}
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="card-name">持卡人姓名 *</Label>
            <Input
              id="card-name"
              placeholder="张三"
              value={cardData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Payment Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">支付金额:</span>
              <span className="text-lg font-bold">
                {currency.toUpperCase()} {amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Security Notice */}
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              您的支付信息通过SSL加密传输，我们不会存储您的卡片信息。
            </AlertDescription>
          </Alert>

          {/* Test Cards Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>测试卡号:</strong><br />
              成功: 4242 4242 4242 4242<br />
              失败: 4000 0000 0000 0002<br />
              过期日期: 任何未来日期，CVC: 任何3位数字
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            <Lock className="h-4 w-4 mr-2" />
            {isProcessing ? '处理中...' : `支付 ${currency.toUpperCase()} ${amount.toFixed(2)}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
