import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'
import { RefundRequest } from '@/lib/types/payment'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Refund API called at:', new Date().toISOString())
    
    const body: RefundRequest = await request.json()
    
    // Validate required fields
    if (!body.transaction_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: transaction_id'
        },
        { status: 400 }
      )
    }

    // Validate amount if provided
    if (body.amount !== undefined && body.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Refund amount must be greater than 0'
        },
        { status: 400 }
      )
    }

    console.log('💰 Processing refund for transaction:', body.transaction_id)
    
    const result = await PaymentService.processRefund(body)
    
    if (result.success) {
      console.log('✅ Refund processed successfully:', result.refund_id)
    } else {
      console.log('❌ Refund processing failed:', result.error)
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Error processing refund:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process refund',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
