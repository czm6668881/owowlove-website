'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { 
  CreditCard, 
  Smartphone, 
  Wallet,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { PaymentMethod } from '@/lib/types/payment'
import { usePayment } from '@/contexts/payment-context'

interface PaymentMethodSelectorProps {
  onMethodSelect?: (method: PaymentMethod) => void
  disabled?: boolean
}

export function PaymentMethodSelector({ onMethodSelect, disabled = false }: PaymentMethodSelectorProps) {
  const { 
    availablePaymentMethods, 
    selectedPaymentMethod, 
    selectPaymentMethod,
    isLoading,
    error 
  } = usePayment()
  
  const [localSelectedId, setLocalSelectedId] = useState<string>(selectedPaymentMethod?.id || '')

  const handleMethodSelect = (methodId: string) => {
    const method = availablePaymentMethods.find(m => m.id === methodId)
    if (method) {
      setLocalSelectedId(methodId)
      selectPaymentMethod(method)
      onMethodSelect?.(method)
    }
  }

  const getPaymentIcon = (methodName: string) => {
    switch (methodName) {
      case 'alipay':
        return <Wallet className="h-6 w-6 text-blue-600" />
      case 'wechat':
        return <Smartphone className="h-6 w-6 text-green-600" />
      case 'credit_card':
        return <CreditCard className="h-6 w-6 text-purple-600" />
      default:
        return <Wallet className="h-6 w-6 text-gray-600" />
    }
  }

  const getPaymentDescription = (methodName: string) => {
    switch (methodName) {
      case 'alipay':
        return '使用支付宝扫码支付，安全便捷'
      case 'wechat':
        return '使用微信扫码支付，快速到账'
      case 'credit_card':
        return '支持Visa、MasterCard等主流信用卡'
      default:
        return '安全可靠的支付方式'
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">加载支付方式...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (availablePaymentMethods.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>暂无可用的支付方式</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">选择支付方式</h3>
          
          <RadioGroup
            value={localSelectedId}
            onValueChange={handleMethodSelect}
            disabled={disabled}
            className="space-y-3"
          >
            {availablePaymentMethods.map((method) => (
              <div key={method.id} className="relative">
                <Label
                  htmlFor={method.id}
                  className={`
                    flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${localSelectedId === method.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  
                  <div className="flex items-center space-x-3 flex-1">
                    {getPaymentIcon(method.name)}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{method.display_name}</span>
                        {method.name === 'alipay' && (
                          <Badge variant="secondary" className="text-xs">推荐</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {getPaymentDescription(method.name)}
                      </p>
                    </div>
                  </div>
                  
                  {localSelectedId === method.id && (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedPaymentMethod && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  已选择：{selectedPaymentMethod.display_name}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
