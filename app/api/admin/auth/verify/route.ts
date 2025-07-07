import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    try {
      const decoded = verify(token, JWT_SECRET) as any
      
      if (decoded.admin) {
        return NextResponse.json({
          success: true,
          valid: true,
          message: 'Token is valid'
        })
      } else {
        return NextResponse.json(
          { success: false, valid: false, error: 'Invalid token' },
          { status: 401 }
        )
      }
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, valid: false, error: 'Token expired or invalid' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    )
  }
}
