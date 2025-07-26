'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useUserAuth } from '@/contexts/user-auth-context'

export default function LoginSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { checkAuth } = useUserAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const devMode = searchParams.get('dev_mode')

    if (token) {
      // 存储token到localStorage
      localStorage.setItem('user_token', token)

      // 触发认证检查以更新用户状态
      checkAuth?.()

      // 显示成功信息的时间（开发模式稍长一些）
      const redirectDelay = devMode ? 2000 : 1000

      // 重定向到首页
      setTimeout(() => {
        router.push('/en')
      }, redirectDelay)
    } else {
      // 如果没有token，重定向到登录页面
      router.push('/en/login?error=oauth_failed')
    }
  }, [searchParams, router, checkAuth])

  const devMode = searchParams.get('dev_mode')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {devMode ? '🧪 开发模式登录成功!' : 'Signing you in...'}
        </h2>
        <p className="text-gray-600">
          {devMode
            ? 'Google OAuth 开发模式测试完成，正在跳转...'
            : 'Please wait while we complete your login.'
          }
        </p>
        {devMode && (
          <div className="mt-4 p-3 bg-blue-100 rounded-lg text-sm text-blue-800">
            <p>✅ 开发模式测试成功！</p>
            <p>生产环境请配置真实的Google OAuth凭据</p>
          </div>
        )}
      </div>
    </div>
  )
}
