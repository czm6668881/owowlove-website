import { NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Admin payment transactions API called at:', new Date().toISOString())
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }
    
    const transactions = await PaymentService.getAllPaymentTransactions()
    
    console.log('✅ Admin payment transactions fetched:', transactions?.length || 0)
    
    return NextResponse.json({
      success: true,
      data: transactions,
      debug: {
        count: transactions?.length || 0,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Error fetching admin payment transactions:', error)
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
