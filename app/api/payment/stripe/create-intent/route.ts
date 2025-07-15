import { NextRequest, NextResponse } from 'next/server'
import { StripeEnhancedProvider } from '@/lib/services/payment-providers/stripe-enhanced'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Stripe create payment intent API called at:', new Date().toISOString())
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.amount || !body.order_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Amount and order_id are required'
        },
        { status: 400 }
      )
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Amount must be greater than 0'
        },
        { status: 400 }
      )
    }

    console.log('💳 Creating Stripe payment intent for amount:', body.amount)

    // Create Stripe provider
    const stripeProvider = new StripeEnhancedProvider({
      public_key: process.env.STRIPE_PUBLIC_KEY || '',
      secret_key: process.env.STRIPE_SECRET_KEY || '',
      webhook_secret: process.env.STRIPE_WEBHOOK_SECRET || ''
    })

    // Create payment intent
    const result = await stripeProvider.createPayment({
      order_id: body.order_id,
      payment_method: 'credit_card',
      amount: body.amount,
      currency: body.currency || 'USD',
      transaction_id: body.transaction_id
    })

    if (result.success) {
      console.log('✅ Stripe payment intent created successfully')
      return NextResponse.json({
        success: true,
        data: {
          client_secret: result.payment_data?.client_secret,
          payment_intent_id: result.payment_data?.payment_intent_id,
          amount: result.payment_data?.amount,
          currency: result.payment_data?.currency
        }
      })
    } else {
      console.log('❌ Stripe payment intent creation failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to create payment intent'
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('❌ Error creating Stripe payment intent:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
