import { NextRequest, NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { UserService } from '@/lib/data/users'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

// 开发模式的模拟Google用户数据
const mockGoogleUsers = [
  {
    id: 'google_dev_user_1',
    email: 'test@gmail.com',
    firstName: 'Test',
    lastName: 'User',
    picture: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=TU',
    emailVerified: true
  },
  {
    id: 'google_dev_user_2', 
    email: 'demo@gmail.com',
    firstName: 'Demo',
    lastName: 'Account',
    picture: 'https://via.placeholder.com/150/34A853/FFFFFF?text=DA',
    emailVerified: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userIndex = parseInt(searchParams.get('user') || '0')
    
    // 选择模拟用户
    const googleUser = mockGoogleUsers[userIndex] || mockGoogleUsers[0]

    console.log('🧪 开发模式：模拟Google OAuth登录', googleUser.email)

    // 检查用户是否已存在
    let user = await UserService.findUserByEmail(googleUser.email)

    if (!user) {
      // 创建新用户
      const newUserData = {
        email: googleUser.email,
        password: '', // OAuth用户无密码
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        acceptTerms: true,
        googleId: googleUser.id,
        picture: googleUser.picture,
        isEmailVerified: googleUser.emailVerified
      }

      const { user: createdUser, error: createError } = await UserService.registerUser(newUserData)
      
      if (createError || !createdUser) {
        console.error('创建模拟Google用户失败:', createError)
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/login?error=dev_registration_failed`)
      }

      user = createdUser
    } else {
      // 更新现有用户的Google信息
      if (!user.googleId) {
        await UserService.updateUser(user.id, {
          googleId: googleUser.id,
          picture: googleUser.picture,
          isEmailVerified: googleUser.emailVerified
        })
      }
    }

    // 生成JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role || 'user',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
      },
      JWT_SECRET
    )

    console.log('✅ 开发模式：模拟登录成功', user.email)

    // 重定向到成功页面
    const redirectUrl = new URL(`${process.env.NEXTAUTH_URL}/en/login/success`)
    redirectUrl.searchParams.set('token', token)
    redirectUrl.searchParams.set('dev_mode', 'true')
    
    return NextResponse.redirect(redirectUrl.toString())

  } catch (error) {
    console.error('开发模式Google OAuth错误:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/en/login?error=dev_mode_failed`)
  }
}
