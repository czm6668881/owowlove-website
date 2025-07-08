import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/services/users'
import { RegisterRequest } from '@/lib/types/user'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()

    // 验证必填字段
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // 验证密码强度
    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // 验证是否同意条款
    if (!body.acceptTerms) {
      return NextResponse.json(
        { success: false, error: 'You must accept the terms and conditions' },
        { status: 400 }
      )
    }

    // 创建用户
    const { user: newUser, error } = await UserService.registerUser(body)

    if (error || !newUser) {
      if (error === 'User already exists') {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 409 }
        )
      }

      return NextResponse.json(
        { success: false, error: error || 'Registration failed' },
        { status: 400 }
      )
    }

    // 生成JWT token
    const token = sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      },
      JWT_SECRET
    )

    console.log(`New user registered: ${newUser.email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      token,
      user: newUser,
      message: 'Registration successful'
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
