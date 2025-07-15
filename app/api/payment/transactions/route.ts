import { NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'

export async function GET() {
  try {
    console.log('🔍 User payment transactions API called at:', new Date().toISOString())
    
    const transactions = await PaymentService.getUserPaymentTransactions()
    
    console.log('✅ User payment transactions fetched:', transactions?.length || 0)
    
    return NextResponse.json({
      success: true,
      data: transactions,
      debug: {
        count: transactions?.length || 0,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Error fetching user payment transactions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch payment transactions',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
