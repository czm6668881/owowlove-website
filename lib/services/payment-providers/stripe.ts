import { 
  PaymentProvider, 
  CreatePaymentRequest, 
  CreatePaymentResponse,
  PaymentStatusResponse,
  RefundRequest,
  RefundResponse,
  StripeConfig,
  StripePaymentData
} from '@/lib/types/payment'

export class StripeProvider implements PaymentProvider {
  name = 'credit_card'
  private config: StripeConfig

  constructor(config: StripeConfig) {
    this.config = config
  }

  async createPayment(request: CreatePaymentRequest & { transaction_id?: string }): Promise<CreatePaymentResponse> {
    try {
      const outTradeNo = request.transaction_id || `ORDER_${Date.now()}`
      
      // Create payment intent with Stripe
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secret_key}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          amount: Math.round(request.amount * 100).toString(), // Convert to cents
          currency: request.currency?.toLowerCase() || 'cny',
          metadata: JSON.stringify({
            order_id: request.order_id,
            transaction_id: outTradeNo
          }),
          return_url: request.return_url || '',
          cancel_url: request.cancel_url || ''
        })
      })

      const result = await response.json()

      if (response.ok && result.id) {
        return {
          success: true,
          transaction_id: outTradeNo,
          payment_data: {
            payment_intent_id: result.id,
            client_secret: result.client_secret,
            amount: request.amount,
            currency: request.currency || 'CNY'
          }
        }
      } else {
        return {
          success: false,
          error: result.error?.message || 'Payment creation failed'
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
      // In a real implementation, you would store the payment_intent_id
      // and retrieve it here. For now, we'll use a mock implementation.
      
      // This is a simplified version - in production you'd need to:
      // 1. Store payment_intent_id when creating payment
      // 2. Retrieve payment intent from Stripe API
      // 3. Map Stripe status to our status enum
      
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
      // In a real implementation, you would need the charge_id or payment_intent_id
      // This is a simplified mock implementation
      
      const refundAmount = request.amount || 0
      
      const response = await fetch('https://api.stripe.com/v1/refunds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.secret_key}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          amount: Math.round(refundAmount * 100).toString(),
          reason: 'requested_by_customer',
          metadata: JSON.stringify({
            transaction_id: request.transaction_id,
            reason: request.reason
          })
        })
      })

      const result = await response.json()

      if (response.ok && result.id) {
        return {
          success: true,
          refund_id: result.id
        }
      } else {
        return {
          success: false,
          error: result.error?.message || 'Refund failed'
        }
      }
    } catch (error) {
      console.error('Stripe processRefund error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed'
      }
    }
  }

  async handleWebhook(payload: any): Promise<{ success: boolean; transaction_id?: string }> {
    try {
      // Verify webhook signature
      const isValid = this.verifyWebhookSignature(payload)
      if (!isValid) {
        return { success: false }
      }

      const event = payload
      const transactionId = event.data?.object?.metadata?.transaction_id

      // Process webhook based on event type
      if (event.type === 'payment_intent.succeeded') {
        return {
          success: true,
          transaction_id: transactionId
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Stripe handleWebhook error:', error)
      return { success: false }
    }
  }

  private verifyWebhookSignature(payload: any): boolean {
    try {
      // In a real implementation, you would verify the Stripe webhook signature
      // using the webhook secret and the raw request body
      return true // Simplified for demo
    } catch (error) {
      console.error('Stripe signature verification error:', error)
      return false
    }
  }
}
