import { NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'

export async function GET() {
  try {
    console.log('🔍 Payment methods API called at:', new Date().toISOString())
    
    const paymentMethods = await PaymentService.getPaymentMethods()
    
    console.log('✅ Payment methods fetched:', paymentMethods?.length || 0)
    
    return NextResponse.json({
      success: true,
      data: paymentMethods,
      debug: {
        count: paymentMethods?.length || 0,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Error fetching payment methods:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch payment methods',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
