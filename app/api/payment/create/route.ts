import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'
import { CreatePaymentRequest } from '@/lib/types/payment'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Create payment API called at:', new Date().toISOString())
    
    const body: CreatePaymentRequest = await request.json()
    
    // Validate required fields
    if (!body.order_id || !body.payment_method || !body.amount) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: order_id, payment_method, amount'
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

    // Get return and cancel URLs from headers or use defaults
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = `${protocol}://${host}`
    
    const paymentRequest: CreatePaymentRequest = {
      ...body,
      return_url: body.return_url || `${baseUrl}/payment/success`,
      cancel_url: body.cancel_url || `${baseUrl}/payment/cancel`
    }

    console.log('💳 Creating payment for order:', body.order_id, 'with method:', body.payment_method)
    
    const result = await PaymentService.createPaymentTransaction(paymentRequest)
    
    if (result.success) {
      console.log('✅ Payment created successfully:', result.transaction_id)
    } else {
      console.log('❌ Payment creation failed:', result.error)
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Error creating payment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create payment',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
