import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
)

// 检查是否为开发模式（使用模拟凭据）
const isDevMode = process.env.GOOGLE_CLIENT_ID?.includes('123456789-abcdefghijklmnopqrstuvwxyz123456')

// 检查是否有有效的Google凭据
const hasValidGoogleCredentials = process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  !isDevMode

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Google OAuth 请求开始')
    console.log('🔧 环境检查:', {
      NODE_ENV: process.env.NODE_ENV,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '已设置' : '未设置',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '已设置' : '未设置',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      isDevMode,
      hasValidGoogleCredentials
    })

    // 开发模式：使用模拟Google OAuth
    if (isDevMode) {
      console.log('🧪 开发模式：重定向到模拟Google OAuth')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/api/auth/google/dev-mode`)
    }

    // 检查是否有有效凭据
    if (!hasValidGoogleCredentials) {
      console.log('❌ 缺少有效的Google OAuth凭据')
      return NextResponse.json(
        { success: false, error: 'Google OAuth credentials not configured' },
        { status: 500 }
      )
    }

    // 生产模式：使用真实Google OAuth
    console.log('🚀 生产模式：生成Google授权URL')
    const authorizeUrl = client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      include_granted_scopes: true,
    })

    console.log('🔗 重定向到Google:', authorizeUrl)
    return NextResponse.redirect(authorizeUrl)
  } catch (error) {
    console.error('Google OAuth error:', error)

    // 如果是开发模式且出错，回退到模拟器
    if (isDevMode) {
      console.log('🧪 开发模式：回退到模拟器')
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/api/auth/google/dev-mode`)
    }

    return NextResponse.json(
      { success: false, error: 'Failed to initiate Google OAuth' },
      { status: 500 }
    )
  }
}
