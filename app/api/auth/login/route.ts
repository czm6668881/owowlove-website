import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/data/users'
import { LoginRequest } from '@/lib/types/user'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()

    // 验证必填字段
    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // 验证用户凭据
    const user = await UserService.validatePassword(body.email, body.password)
    
    if (!user) {
      // 记录失败的登录尝试
      console.log(`Failed login attempt for email: ${body.email} at ${new Date().toISOString()}`)
      
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 检查账户是否激活
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is deactivated. Please contact support.' },
        { status: 403 }
      )
    }

    // 生成JWT token
    const tokenExpiry = body.rememberMe 
      ? 30 * 24 * 60 * 60 // 30 days if remember me
      : 7 * 24 * 60 * 60  // 7 days default

    const token = sign(
      { 
        userId: user.id,
        email: user.email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + tokenExpiry
      },
      JWT_SECRET
    )

    // 返回成功响应（不包含密码）
    const publicUser = UserService.toPublicUser(user)

    console.log(`Successful user login: ${user.email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      token,
      user: publicUser,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    )
  }
}
