import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider } = await params
    
    console.log('🔔 Payment webhook received from:', provider)
    
    // Get raw body for signature verification
    const rawBody = await request.text()
    let payload: any
    
    try {
      payload = JSON.parse(rawBody)
    } catch (error) {
      // For XML payloads (WeChat)
      payload = rawBody
    }

    // Log webhook for debugging
    await supabaseAdmin
      .from('payment_webhooks')
      .insert([{
        provider,
        event_type: payload.event_type || payload.trade_status || 'unknown',
        payload: typeof payload === 'string' ? { raw: payload } : payload,
        processed: false
      }])

    // Get payment provider
    const paymentProvider = getPaymentProvider(provider)
    if (!paymentProvider) {
      console.error('❌ Unknown payment provider:', provider)
      return NextResponse.json(
        { success: false, error: 'Unknown payment provider' },
        { status: 400 }
      )
    }

    // Handle webhook
    const result = await paymentProvider.handleWebhook(payload)
    
    if (result.success && result.transaction_id) {
      // Update transaction status
      const { data: transaction } = await supabaseAdmin
        .from('payment_transactions')
        .select('*')
        .eq('id', result.transaction_id)
        .single()

      if (transaction) {
        // Update transaction as completed
        await supabaseAdmin
          .from('payment_transactions')
          .update({
            status: 'completed',
            paid_at: new Date().toISOString()
          })
          .eq('id', result.transaction_id)

        // Update order payment status
        await supabaseAdmin
          .from('orders')
          .update({ payment_status: 'paid' })
          .eq('id', transaction.order_id)

        console.log('✅ Payment completed for transaction:', result.transaction_id)
      }

      // Mark webhook as processed
      await supabaseAdmin
        .from('payment_webhooks')
        .update({ processed: true })
        .eq('provider', provider)
        .eq('payload->transaction_id', result.transaction_id)
    }

    // Return appropriate response based on provider
    if (provider === 'alipay') {
      return new Response('success', { status: 200 })
    } else if (provider === 'wechat') {
      return new Response(
        '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>',
        { 
          status: 200,
          headers: { 'Content-Type': 'application/xml' }
        }
      )
    } else {
      return NextResponse.json({ received: true })
    }
  } catch (error) {
    console.error('❌ Error processing webhook:', error)
    
    // Log error
    const { provider } = await params
    await supabaseAdmin
      .from('payment_webhooks')
      .update({ 
        processed: false,
        error_message: error instanceof Error ? error.message : 'Unknown error'
      })
      .eq('provider', provider)
      .order('created_at', { ascending: false })
      .limit(1)

    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

function getPaymentProvider(providerName: string): any {
  const { AlipayProvider } = require('@/lib/services/payment-providers/alipay')
  const { WechatProvider } = require('@/lib/services/payment-providers/wechat')
  const { StripeProvider } = require('@/lib/services/payment-providers/stripe')

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
    
    case 'stripe':
      const { StripeEnhancedProvider } = require('@/lib/services/payment-providers/stripe-enhanced')
      return new StripeEnhancedProvider({
        public_key: process.env.STRIPE_PUBLIC_KEY || '',
        secret_key: process.env.STRIPE_SECRET_KEY || '',
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || ''
      })
    
    default:
      return null
  }
}
