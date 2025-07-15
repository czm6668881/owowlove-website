import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/lib/services/payment'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 Admin payment methods API called at:', new Date().toISOString())
    
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
    
    // Get all payment methods (including inactive ones for admin)
    const { data: paymentMethods, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      throw error
    }
    
    console.log('✅ Admin payment methods fetched:', paymentMethods?.length || 0)
    
    return NextResponse.json({
      success: true,
      data: paymentMethods,
      debug: {
        count: paymentMethods?.length || 0,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Error fetching admin payment methods:', error)
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

export async function PUT(request: NextRequest) {
  try {
    console.log('🔍 Admin update payment method API called at:', new Date().toISOString())
    
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

    const { id, ...updates } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Payment method ID is required' },
        { status: 400 }
      )
    }

    const updatedMethod = await PaymentService.updatePaymentMethod(id, updates)
    
    console.log('✅ Payment method updated:', id)
    
    return NextResponse.json({
      success: true,
      data: updatedMethod
    })
  } catch (error) {
    console.error('❌ Error updating payment method:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update payment method',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
