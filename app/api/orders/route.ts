import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/lib/services/orders'

export async function GET() {
  try {
    console.log('🔍 Orders API called at:', new Date().toISOString())
    
    const orders = await OrderService.getUserOrders()
    
    console.log('✅ User orders fetched:', orders?.length || 0)
    
    return NextResponse.json({
      success: true,
      data: orders,
      debug: {
        count: orders?.length || 0,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('❌ Error fetching user orders:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Create order API called at:', new Date().toISOString())

    const body = await request.json()

    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order items are required'
        },
        { status: 400 }
      )
    }

    if (!body.total_amount || body.total_amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid total amount is required'
        },
        { status: 400 }
      )
    }

    if (!body.shipping_address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Shipping address is required'
        },
        { status: 400 }
      )
    }

    // For guest checkout, validate guest info
    if (body.guest_info) {
      const { first_name, last_name, email, phone } = body.guest_info
      if (!first_name || !last_name || !email || !phone) {
        return NextResponse.json(
          {
            success: false,
            error: 'Guest information is incomplete'
          },
          { status: 400 }
        )
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid email format'
          },
          { status: 400 }
        )
      }
    }

    // Validate order items
    for (const item of body.items) {
      if (!item.product_id || !item.variant_id || !item.quantity || !item.price) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid order item format'
          },
          { status: 400 }
        )
      }

      if (item.quantity <= 0 || item.price <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid item quantity or price'
          },
          { status: 400 }
        )
      }
    }

    // Calculate and verify total
    const calculatedTotal = body.items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    )

    if (Math.abs(calculatedTotal - body.total_amount) > 0.01) {
      return NextResponse.json(
        {
          success: false,
          error: 'Total amount mismatch'
        },
        { status: 400 }
      )
    }

    console.log('💰 Creating order with total:', body.total_amount)

    const order = await OrderService.createOrder({
      items: body.items,
      total_amount: body.total_amount,
      status: 'pending',
      shipping_address: body.shipping_address,
      payment_method: body.payment_method || 'pending',
      payment_status: body.payment_status || 'pending',
      guest_info: body.guest_info || null
    })
    
    console.log('✅ Order created successfully:', order.id)
    
    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('❌ Error creating order:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
