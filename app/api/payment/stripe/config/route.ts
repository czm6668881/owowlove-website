import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Return Stripe public configuration
    const config = {
      public_key: process.env.STRIPE_PUBLIC_KEY || '',
      currency: 'USD',
      country: 'US'
    }

    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Error getting Stripe config:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get Stripe configuration'
      },
      { status: 500 }
    )
  }
}
