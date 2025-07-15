import { NextRequest, NextResponse } from 'next/server'
import { StripeEnhancedProvider } from '@/lib/services/payment-providers/stripe-enhanced'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Stripe confirm payment API called at:', new Date().toISOString())
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.payment_intent_id || !body.payment_method_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment intent ID and payment method ID are required'
        },
        { status: 400 }
      )
    }

    console.log('💳 Confirming Stripe payment:', body.payment_intent_id)

    // Create Stripe provider
    const stripeProvider = new StripeEnhancedProvider({
      public_key: process.env.STRIPE_PUBLIC_KEY || '',
      secret_key: process.env.STRIPE_SECRET_KEY || '',
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || ''
    })

    // Confirm payment
    const result = await stripeProvider.confirmPayment(
      body.payment_intent_id,
      body.payment_method_id
    )

    if (result.success) {
      console.log('✅ Stripe payment confirmed successfully')
      
      // Check if payment requires additional action (3D Secure)
      const paymentData = result.payment_data
      
      if (paymentData?.status === 'requires_action') {
        return NextResponse.json({
          success: true,
          requires_action: true,
          data: {
            client_secret: paymentData.client_secret,
            next_action: paymentData.next_action
          }
        })
      } else if (paymentData?.status === 'succeeded') {
        return NextResponse.json({
          success: true,
          completed: true,
          data: {
            payment_intent_id: paymentData.payment_intent_id,
            status: paymentData.status
          }
        })
      } else {
        return NextResponse.json({
          success: true,
          data: paymentData
        })
      }
    } else {
      console.log('❌ Stripe payment confirmation failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Payment confirmation failed'
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('❌ Error confirming Stripe payment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to confirm payment',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
