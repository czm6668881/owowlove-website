import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { UserService } from '@/lib/data/users'

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
      // 验证JWT token
      const decoded = verify(token, JWT_SECRET) as any
      
      if (!decoded.userId) {
        return NextResponse.json(
          { success: false, valid: false, error: 'Invalid token format' },
          { status: 401 }
        )
      }

      // 获取用户信息
      const user = await UserService.getUserById(decoded.userId)
      
      if (!user) {
        return NextResponse.json(
          { success: false, valid: false, error: 'User not found' },
          { status: 401 }
        )
      }

      if (!user.isActive) {
        return NextResponse.json(
          { success: false, valid: false, error: 'Account is deactivated' },
          { status: 403 }
        )
      }

      // 返回用户信息（不包含密码）
      const publicUser = UserService.toPublicUser(user)

      return NextResponse.json({
        success: true,
        valid: true,
        user: publicUser,
        message: 'Token is valid'
      })

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
