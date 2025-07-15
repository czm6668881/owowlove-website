import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Track order API called at:', new Date().toISOString())
    
    const body = await request.json()
    
    // Validate required fields
    if (!body.order_id || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order ID and email are required'
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format'
        },
        { status: 400 }
      )
    }

    console.log('🔍 Searching for order:', body.order_id, 'with email:', body.email)

    // Search for guest order by order ID and email
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', body.order_id)
      .is('user_id', null) // Guest orders only
      .single()

    if (error) {
      console.log('❌ Order not found:', error.message)
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found'
        },
        { status: 404 }
      )
    }

    // Verify email matches guest info
    if (!order.guest_info || order.guest_info.email !== body.email) {
      console.log('❌ Email mismatch for order:', body.order_id)
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found or email does not match'
        },
        { status: 404 }
      )
    }

    console.log('✅ Order found for guest:', order.id)

    // Return order information (excluding sensitive data)
    const orderInfo = {
      id: order.id,
      total_amount: order.total_amount,
      status: order.status,
      payment_status: order.payment_status,
      shipping_address: order.shipping_address,
      guest_info: {
        first_name: order.guest_info.first_name,
        last_name: order.guest_info.last_name,
        email: order.guest_info.email,
        phone: order.guest_info.phone
      },
      created_at: order.created_at,
      items: order.items || []
    }

    return NextResponse.json({
      success: true,
      data: orderInfo
    })
  } catch (error) {
    console.error('❌ Error tracking order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to track order',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
