import { NextRequest, NextResponse } from 'next/server'
import { StripeEnhancedProvider } from '@/lib/services/payment-providers/stripe-enhanced'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Stripe create payment method API called at:', new Date().toISOString())
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.card || !body.card.number || !body.card.exp_month || !body.card.exp_year || !body.card.cvc) {
      return NextResponse.json(
        {
          success: false,
          error: 'Card information is required'
        },
        { status: 400 }
      )
    }

    console.log('💳 Creating Stripe payment method')

    // Create Stripe provider
    const stripeProvider = new StripeEnhancedProvider({
      public_key: process.env.STRIPE_PUBLIC_KEY || '',
      secret_key: process.env.STRIPE_SECRET_KEY || '',
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || ''
    })

    // Create payment method
    const result = await stripeProvider.createPaymentMethod(body.card)

    if (result.success) {
      console.log('✅ Stripe payment method created successfully')
      return NextResponse.json({
        success: true,
        payment_method_id: result.payment_method_id
      })
    } else {
      console.log('❌ Stripe payment method creation failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to create payment method'
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('❌ Error creating Stripe payment method:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create payment method',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
