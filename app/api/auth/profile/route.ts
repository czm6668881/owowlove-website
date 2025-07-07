import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { UserService } from '@/lib/data/users'
import { UpdateUserRequest, ChangePasswordRequest } from '@/lib/types/user'

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

// GET - 获取用户资料
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await UserService.getUserById(userId)
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const publicUser = UserService.toPublicUser(user)

    return NextResponse.json({
      success: true,
      user: publicUser
    })

  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get profile' },
      { status: 500 }
    )
  }
}

// PUT - 更新用户资料
export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserIdFromToken(request)
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: UpdateUserRequest = await request.json()

    // 验证数据
    if (body.firstName && body.firstName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'First name cannot be empty' },
        { status: 400 }
      )
    }

    if (body.lastName && body.lastName.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Last name cannot be empty' },
        { status: 400 }
      )
    }

    // 更新用户信息
    const updatedUser = await UserService.updateUser(userId, body)
    
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const publicUser = UserService.toPublicUser(updatedUser)

    console.log(`User profile updated: ${updatedUser.email} at ${new Date().toISOString()}`)

    return NextResponse.json({
      success: true,
      user: publicUser,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
