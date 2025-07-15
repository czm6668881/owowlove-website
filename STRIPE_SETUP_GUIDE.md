# Stripe 支付集成设置指南

## 🚀 快速开始

### 1. 安装 Stripe SDK

```bash
npm install stripe @stripe/stripe-js
npm install --save-dev @types/stripe
```

### 2. 获取 Stripe API 密钥

1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 注册或登录您的 Stripe 账户
3. 在左侧菜单中点击 "Developers" > "API keys"
4. 复制以下密钥：
   - **Publishable key** (以 `pk_` 开头)
   - **Secret key** (以 `sk_` 开头)

### 3. 设置环境变量

在您的 `.env.local` 文件中添加：

```env
# Stripe 配置
STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# 生产环境使用 live 密钥
# STRIPE_PUBLIC_KEY=pk_live_your_live_publishable_key
# STRIPE_SECRET_KEY=sk_live_your_live_secret_key
```

### 4. 配置 Webhook

1. 在 Stripe Dashboard 中，转到 "Developers" > "Webhooks"
2. 点击 "Add endpoint"
3. 设置端点 URL: `https://yourdomain.com/api/payment/webhook/stripe`
4. 选择要监听的事件：
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. 复制 Webhook 签名密钥并添加到环境变量

## 💳 前端集成

### 1. 创建 Stripe 上下文

```typescript
// contexts/stripe-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { loadStripe, Stripe } from '@stripe/stripe-js'

interface StripeContextType {
  stripe: Stripe | null
  isLoading: boolean
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export function StripeProvider({ children }: { children: React.ReactNode }) {
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!)
      setStripe(stripeInstance)
      setIsLoading(false)
    }

    initializeStripe()
  }, [])

  return (
    <StripeContext.Provider value={{ stripe, isLoading }}>
      {children}
    </StripeContext.Provider>
  )
}

export const useStripe = () => {
  const context = useContext(StripeContext)
  if (!context) {
    throw new Error('useStripe must be used within StripeProvider')
  }
  return context
}
```

### 2. 创建信用卡支付组件

```typescript
// components/payment/stripe-payment.tsx
'use client'

import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface StripePaymentProps {
  clientSecret: string
  onSuccess: () => void
  onError: (error: string) => void
}

export function StripePayment({ clientSecret, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      }
    })

    if (error) {
      onError(error.message || 'Payment failed')
    } else {
      onSuccess()
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? '处理中...' : '确认支付'}
      </Button>
    </form>
  )
}
```

## 🔧 后端集成

### 1. 更新 Stripe 提供商

```typescript
// lib/services/payment-providers/stripe-enhanced.ts
import Stripe from 'stripe'
import { 
  PaymentProvider, 
  CreatePaymentRequest, 
  CreatePaymentResponse,
  PaymentStatusResponse,
  RefundRequest,
  RefundResponse
} from '@/lib/types/payment'

export class StripeEnhancedProvider implements PaymentProvider {
  name = 'credit_card'
  private stripe: Stripe

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    })
  }

  async createPayment(request: CreatePaymentRequest & { transaction_id?: string }): Promise<CreatePaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(request.amount * 100), // Convert to cents
        currency: request.currency?.toLowerCase() || 'usd',
        metadata: {
          order_id: request.order_id,
          transaction_id: request.transaction_id || `ORDER_${Date.now()}`
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        success: true,
        transaction_id: request.transaction_id || `ORDER_${Date.now()}`,
        payment_data: {
          payment_intent_id: paymentIntent.id,
          client_secret: paymentIntent.client_secret!,
          amount: request.amount,
          currency: request.currency || 'USD'
        }
      }
    } catch (error) {
      console.error('Stripe createPayment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      }
    }
  }

  async verifyPayment(transaction_id: string): Promise<PaymentStatusResponse> {
    try {
      // In production, you would store and retrieve the payment_intent_id
      // For now, this is a simplified implementation
      return {
        success: true,
        status: 'pending',
        transaction: {
          id: transaction_id,
          status: 'pending'
        } as any
      }
    } catch (error) {
      console.error('Stripe verifyPayment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed'
      }
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      // You would need to store the payment_intent_id or charge_id
      // This is a simplified implementation
      const refund = await this.stripe.refunds.create({
        amount: request.amount ? Math.round(request.amount * 100) : undefined,
        reason: 'requested_by_customer',
        metadata: {
          transaction_id: request.transaction_id,
          reason: request.reason || ''
        }
      })

      return {
        success: true,
        refund_id: refund.id
      }
    } catch (error) {
      console.error('Stripe processRefund error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed'
      }
    }
  }

  async handleWebhook(payload: any, signature: string): Promise<{ success: boolean; transaction_id?: string }> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      )

      const transactionId = event.data.object.metadata?.transaction_id

      switch (event.type) {
        case 'payment_intent.succeeded':
          return {
            success: true,
            transaction_id: transactionId
          }
        case 'payment_intent.payment_failed':
          return {
            success: true,
            transaction_id: transactionId
          }
        default:
          return { success: true }
      }
    } catch (error) {
      console.error('Stripe webhook error:', error)
      return { success: false }
    }
  }
}
```

## 🔐 安全配置

### 1. Webhook 签名验证

```typescript
// app/api/payment/webhook/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { StripeEnhancedProvider } from '@/lib/services/payment-providers/stripe-enhanced'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 })
    }

    const stripeProvider = new StripeEnhancedProvider()
    const result = await stripeProvider.handleWebhook(body, signature)

    if (result.success && result.transaction_id) {
      // Update payment status in database
      // ... implementation
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
```

## 📱 测试

### 1. 测试卡号

```
# 成功支付
4242424242424242

# 需要验证
4000002500003155

# 支付失败
4000000000000002

# 过期日期: 任何未来日期
# CVC: 任何3位数字
# 邮编: 任何5位数字
```

### 2. 测试流程

1. 使用测试密钥进行开发
2. 测试不同的支付场景
3. 验证 Webhook 处理
4. 确认退款功能

## 🚀 部署

### 1. 生产环境配置

1. 将测试密钥替换为生产密钥
2. 更新 Webhook 端点 URL
3. 启用 HTTPS
4. 配置域名验证

### 2. 监控

1. 在 Stripe Dashboard 中监控交易
2. 设置失败支付告警
3. 定期检查 Webhook 日志

---

## 📞 支持

如需帮助，请参考：
- [Stripe 官方文档](https://stripe.com/docs)
- [Stripe React 集成指南](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhook 指南](https://stripe.com/docs/webhooks)

---

*最后更新: 2025-01-15*
