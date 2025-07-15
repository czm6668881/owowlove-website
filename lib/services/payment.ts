import { supabase, supabaseAdmin } from '@/lib/supabase'
import { 
  PaymentMethod, 
  PaymentTransaction, 
  PaymentRefund,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
  RefundRequest,
  RefundResponse
} from '@/lib/types/payment'

export class PaymentService {
  // Get available payment methods
  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        console.error('Error fetching payment methods:', error)

        // 如果表不存在，返回默认支付方法
        if (error.code === '42P01') {
          console.log('⚠️ Payment methods table not found, returning default methods')
          return [
            {
              id: 'alipay',
              name: 'alipay',
              display_name: '支付宝',
              icon: 'alipay-icon',
              is_active: true,
              sort_order: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'wechat',
              name: 'wechat',
              display_name: '微信支付',
              icon: 'wechat-icon',
              is_active: true,
              sort_order: 2,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 'credit_card',
              name: 'credit_card',
              display_name: '信用卡',
              icon: 'credit-card-icon',
              is_active: true,
              sort_order: 3,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        }

        // 对于其他错误，也返回默认方法而不是抛出错误
        console.log('⚠️ Payment methods error, returning default methods as fallback')
        return [
          {
            id: 'credit_card',
            name: 'credit_card',
            display_name: '信用卡',
            icon: 'credit-card-icon',
            is_active: true,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }

      return data || []
    } catch (error) {
      console.error('PaymentService.getPaymentMethods error:', error)
      throw error
    }
  }

  // Get payment method by name
  static async getPaymentMethodByName(name: string): Promise<PaymentMethod | null> {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('name', name)
        .eq('is_active', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        console.error('Error fetching payment method:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('PaymentService.getPaymentMethodByName error:', error)
      throw error
    }
  }

  // Create payment transaction
  static async createPaymentTransaction(request: CreatePaymentRequest): Promise<CreatePaymentResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      // Get payment method
      const paymentMethod = await this.getPaymentMethodByName(request.payment_method)
      if (!paymentMethod) {
        return { success: false, error: 'Invalid payment method' }
      }

      // Verify order exists and user has access (for authenticated users) or is a guest order
      let order: any
      if (user) {
        // Authenticated user - check order belongs to user
        const { data: userOrder, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', request.order_id)
          .eq('user_id', user.id)
          .single()

        if (orderError || !userOrder) {
          return { success: false, error: 'Order not found or access denied' }
        }
        order = userOrder
      } else {
        // Guest user - use admin client to check order exists and is a guest order
        const { data: guestOrder, error: orderError } = await supabaseAdmin
          .from('orders')
          .select('*')
          .eq('id', request.order_id)
          .is('user_id', null)
          .single()

        if (orderError || !guestOrder) {
          return { success: false, error: 'Order not found or access denied' }
        }
        order = guestOrder
      }

      // Check if order amount matches request amount
      if (Math.abs(order.total_amount - request.amount) > 0.01) {
        return { success: false, error: 'Amount mismatch' }
      }

      // Create transaction record
      const transactionData = {
        order_id: request.order_id,
        user_id: user?.id || null,
        payment_method_id: paymentMethod.id,
        amount: request.amount,
        currency: request.currency || 'CNY',
        provider: request.payment_method,
        status: 'pending' as const,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        payment_data: {}
      }

      // Use admin client for guest transactions
      const client = user ? supabase : supabaseAdmin
      const { data: transaction, error: transactionError } = await client
        .from('payment_transactions')
        .insert([transactionData])
        .select()
        .single()

      if (transactionError) {
        console.error('Error creating transaction:', transactionError)
        return { success: false, error: 'Failed to create payment transaction' }
      }

      // Initialize payment with provider
      const paymentProvider = this.getPaymentProvider(request.payment_method)
      if (!paymentProvider) {
        return { success: false, error: 'Payment provider not available' }
      }

      const paymentResult = await paymentProvider.createPayment({
        ...request,
        transaction_id: transaction.id,
        return_url: request.return_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/success`,
        cancel_url: request.cancel_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/payment/cancel`
      })

      if (!paymentResult.success) {
        // Update transaction status to failed
        await supabase
          .from('payment_transactions')
          .update({ status: 'failed' })
          .eq('id', transaction.id)

        return paymentResult
      }

      // Update transaction with payment data
      await client
        .from('payment_transactions')
        .update({
          provider_transaction_id: paymentResult.transaction_id,
          payment_url: paymentResult.payment_url,
          qr_code_url: paymentResult.qr_code_url,
          payment_data: paymentResult.payment_data || {}
        })
        .eq('id', transaction.id)

      return {
        success: true,
        transaction_id: transaction.id,
        payment_url: paymentResult.payment_url,
        qr_code_url: paymentResult.qr_code_url,
        payment_data: paymentResult.payment_data
      }
    } catch (error) {
      console.error('PaymentService.createPaymentTransaction error:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  // Get payment transaction by ID
  static async getPaymentTransaction(id: string): Promise<PaymentTransaction | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // No rows found
        }
        console.error('Error fetching transaction:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('PaymentService.getPaymentTransaction error:', error)
      throw error
    }
  }

  // Check payment status
  static async checkPaymentStatus(transaction_id: string): Promise<PaymentStatusResponse> {
    try {
      const transaction = await this.getPaymentTransaction(transaction_id)
      if (!transaction) {
        return { success: false, error: 'Transaction not found' }
      }

      // If already completed, return current status
      if (transaction.status === 'completed') {
        return { success: true, status: transaction.status, transaction }
      }

      // Check with payment provider
      const paymentProvider = this.getPaymentProvider(transaction.provider)
      if (!paymentProvider) {
        return { success: false, error: 'Payment provider not available' }
      }

      const statusResult = await paymentProvider.verifyPayment(transaction_id)
      
      if (statusResult.success && statusResult.transaction) {
        // Update local transaction status
        await supabase
          .from('payment_transactions')
          .update({
            status: statusResult.transaction.status,
            paid_at: statusResult.transaction.paid_at
          })
          .eq('id', transaction_id)

        // If payment completed, update order status
        if (statusResult.transaction.status === 'completed') {
          await supabase
            .from('orders')
            .update({ payment_status: 'paid' })
            .eq('id', transaction.order_id)
        }
      }

      return statusResult
    } catch (error) {
      console.error('PaymentService.checkPaymentStatus error:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  // Get user's payment transactions
  static async getUserPaymentTransactions(): Promise<PaymentTransaction[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user transactions:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('PaymentService.getUserPaymentTransactions error:', error)
      throw error
    }
  }

  // Process refund
  static async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const transaction = await this.getPaymentTransaction(request.transaction_id)
      if (!transaction) {
        return { success: false, error: 'Transaction not found' }
      }

      if (transaction.status !== 'completed') {
        return { success: false, error: 'Can only refund completed transactions' }
      }

      const refundAmount = request.amount || transaction.amount

      // Create refund record
      const refundData = {
        transaction_id: request.transaction_id,
        order_id: transaction.order_id,
        user_id: user.id,
        amount: refundAmount,
        reason: request.reason,
        status: 'pending' as const
      }

      const { data: refund, error: refundError } = await supabase
        .from('payment_refunds')
        .insert([refundData])
        .select()
        .single()

      if (refundError) {
        console.error('Error creating refund:', refundError)
        return { success: false, error: 'Failed to create refund request' }
      }

      // Process refund with payment provider
      const paymentProvider = this.getPaymentProvider(transaction.provider)
      if (!paymentProvider) {
        return { success: false, error: 'Payment provider not available' }
      }

      const refundResult = await paymentProvider.processRefund(request)

      if (refundResult.success) {
        // Update refund record
        await supabase
          .from('payment_refunds')
          .update({
            provider_refund_id: refundResult.refund_id,
            status: 'completed',
            processed_at: new Date().toISOString()
          })
          .eq('id', refund.id)

        // Update transaction status if full refund
        if (refundAmount >= transaction.amount) {
          await supabase
            .from('payment_transactions')
            .update({ status: 'refunded' })
            .eq('id', request.transaction_id)
        }
      } else {
        // Update refund record as failed
        await supabase
          .from('payment_refunds')
          .update({ status: 'failed' })
          .eq('id', refund.id)
      }

      return refundResult
    } catch (error) {
      console.error('PaymentService.processRefund error:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  // Get payment provider instance
  private static getPaymentProvider(providerName: string): any {
    const { AlipayProvider } = require('./payment-providers/alipay')
    const { WechatProvider } = require('./payment-providers/wechat')
    const { StripeProvider } = require('./payment-providers/stripe')

    switch (providerName) {
      case 'alipay':
        return new AlipayProvider({
          app_id: process.env.ALIPAY_APP_ID || '',
          private_key: process.env.ALIPAY_PRIVATE_KEY || '',
          public_key: process.env.ALIPAY_PUBLIC_KEY || '',
          gateway_url: process.env.ALIPAY_GATEWAY_URL || 'https://openapi.alipay.com/gateway.do',
          notify_url: process.env.ALIPAY_NOTIFY_URL || '',
          return_url: process.env.ALIPAY_RETURN_URL || ''
        })

      case 'wechat':
        return new WechatProvider({
          app_id: process.env.WECHAT_APP_ID || '',
          mch_id: process.env.WECHAT_MCH_ID || '',
          api_key: process.env.WECHAT_API_KEY || '',
          notify_url: process.env.WECHAT_NOTIFY_URL || ''
        })

      case 'credit_card':
        const { StripeEnhancedProvider } = require('./payment-providers/stripe-enhanced')
        return new StripeEnhancedProvider({
          public_key: process.env.STRIPE_PUBLIC_KEY || '',
          secret_key: process.env.STRIPE_SECRET_KEY || '',
          webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || ''
        })

      default:
        return null
    }
  }

  // Admin: Get all payment transactions
  static async getAllPaymentTransactions(): Promise<PaymentTransaction[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('payment_transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching all transactions:', error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error('PaymentService.getAllPaymentTransactions error:', error)
      throw error
    }
  }

  // Admin: Update payment method
  static async updatePaymentMethod(id: string, updates: Partial<PaymentMethod>): Promise<PaymentMethod> {
    try {
      const { data, error } = await supabaseAdmin
        .from('payment_methods')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating payment method:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('PaymentService.updatePaymentMethod error:', error)
      throw error
    }
  }
}
