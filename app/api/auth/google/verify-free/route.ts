import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    
    // 检查是否为开发模式
    const isDevMode = clientId?.includes('123456789-abcdefghijklmnopqrstuvwxyz123456')
    
    // 检查是否为真实Google凭据
    const isRealGoogle = clientId?.includes('.apps.googleusercontent.com') && 
                        clientSecret?.startsWith('GOCSPX-') &&
                        !isDevMode

    const freeFeatures = [
      '✅ 用户登录认证 - 永久免费',
      '✅ 获取用户基本信息 - 永久免费',
      '✅ 邮箱和姓名 - 永久免费',
      '✅ 用户头像 - 永久免费',
      '✅ 无使用次数限制 - 永久免费',
      '✅ OAuth 2.0配置 - 永久免费'
    ]

    const paidFeatures = [
      '💰 Google Drive API大量调用',
      '💰 Google Maps API',
      '💰 云存储服务',
      '💰 高级分析功能'
    ]

    return NextResponse.json({
      success: true,
      mode: isDevMode ? 'development' : (isRealGoogle ? 'production' : 'unknown'),
      isCompleteFree: true,
      message: isDevMode 
        ? '🧪 开发模式 - 100%免费模拟服务'
        : (isRealGoogle 
          ? '🌟 生产模式 - 使用Google免费OAuth服务'
          : '⚠️ 配置不完整'),
      freeFeatures,
      paidFeatures,
      costAnalysis: {
        setup: '免费',
        monthlyUsage: '免费',
        userLogin: '免费',
        apiCalls: '免费（基本认证）',
        storage: '不需要（用户数据存储在您的系统中）'
      },
      recommendations: isDevMode ? [
        '当前使用免费开发模式，功能完整',
        '如需真实Google登录，请配置免费的Google OAuth凭据',
        '所有基本功能永远免费'
      ] : [
        '恭喜！您正在使用完全免费的Google OAuth服务',
        '用户登录和基本信息获取永远不收费',
        '可以支持无限数量的用户登录'
      ]
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '检查失败',
      message: '无法验证配置状态'
    }, { status: 500 })
  }
}
