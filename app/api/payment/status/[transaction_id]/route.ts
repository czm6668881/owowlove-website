import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transaction_id: string }> }
) {
  try {
    const { transaction_id } = await params
    
    console.log('🔍 Payment status API called for transaction:', transaction_id)
    
    if (!transaction_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Transaction ID is required'
        },
        { status: 400 }
      )
    }

    const result = await PaymentService.checkPaymentStatus(transaction_id)
    
    if (result.success) {
      console.log('✅ Payment status retrieved:', result.status)
    } else {
      console.log('❌ Payment status check failed:', result.error)
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Error checking payment status:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check payment status',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
