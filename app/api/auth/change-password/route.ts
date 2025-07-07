import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { UserService } from '@/lib/data/users'
import { ChangePasswordRequest } from '@/lib/types/user'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

// 从请求头获取用户ID
async function getUserIdFromToken(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = verify(token, JWT_SECRET) as any
    return decoded.userId || null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: ChangePasswordRequest = await request.json()

    // 验证必填字段
    if (!body.currentPassword || !body.newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    // 验证新密码强度
    if (body.newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // 检查新密码是否与当前密码相同
    if (body.currentPassword === body.newPassword) {
      return NextResponse.json(
        { success: false, error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // 修改密码
    const success = await UserService.changePassword(
      userId, 
      body.currentPassword, 
      body.newPassword
    )

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    console.log(`Password changed for user ID: ${userId} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
