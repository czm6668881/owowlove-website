import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envInfo = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_URL_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_KEY_EXISTS: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_KEY_PREFIX: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: envInfo,
      message: 'Environment variables check'
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Environment test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
