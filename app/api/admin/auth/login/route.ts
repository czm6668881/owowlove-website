import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'

// Admin password - in production, this should be stored securely
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    // Check password
    if (password !== ADMIN_PASSWORD) {
      // Log failed attempt
      console.log(`Failed admin login attempt at ${new Date().toISOString()}`)
      
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = sign(
      { 
        admin: true, 
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      JWT_SECRET
    )

    // Log successful login
    console.log(`Successful admin login at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      token,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}
