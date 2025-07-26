import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const errors: string[] = []
    const warnings: string[] = []

    // 检查是否为开发模式
    const isDevMode = process.env.GOOGLE_CLIENT_ID?.includes('123456789-abcdefghijklmnopqrstuvwxyz123456')

    // 检查必需的环境变量
    if (!process.env.GOOGLE_CLIENT_ID) {
      errors.push('GOOGLE_CLIENT_ID 环境变量未设置')
    } else if (process.env.GOOGLE_CLIENT_ID === 'your-google-client-id-here') {
      errors.push('GOOGLE_CLIENT_ID 仍然是默认值，请设置真实的客户端ID')
    } else if (isDevMode) {
      warnings.push('正在使用开发模式的模拟凭据，生产环境请替换为真实的Google凭据')
    }

    if (!process.env.GOOGLE_CLIENT_SECRET) {
      errors.push('GOOGLE_CLIENT_SECRET 环境变量未设置')
    } else if (process.env.GOOGLE_CLIENT_SECRET === 'your-google-client-secret-here') {
      errors.push('GOOGLE_CLIENT_SECRET 仍然是默认值，请设置真实的客户端密钥')
    } else if (isDevMode) {
      // 开发模式下不重复警告
    }

    if (!process.env.NEXTAUTH_URL) {
      errors.push('NEXTAUTH_URL 环境变量未设置')
    }

    // 检查Google OAuth库是否可用
    try {
      const { OAuth2Client } = await import('google-auth-library')
      if (!OAuth2Client) {
        errors.push('google-auth-library 库未正确安装')
      }
    } catch (error) {
      errors.push('google-auth-library 库未安装或导入失败')
    }

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        error: errors.join('; ')
      })
    }

    return NextResponse.json({
      success: true,
      message: isDevMode ? 'Google OAuth配置检查通过（开发模式）' : 'Google OAuth配置检查通过',
      devMode: isDevMode,
      warnings: warnings,
      config: {
        clientIdSet: !!process.env.GOOGLE_CLIENT_ID,
        clientSecretSet: !!process.env.GOOGLE_CLIENT_SECRET,
        nextAuthUrlSet: !!process.env.NEXTAUTH_URL,
        redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
        devModeActive: isDevMode
      }
    })

  } catch (error) {
    console.error('Config test error:', error)
    return NextResponse.json({
      success: false,
      error: '配置检查失败'
    }, { status: 500 })
  }
}
