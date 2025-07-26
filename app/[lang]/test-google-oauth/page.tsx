'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TestGoogleOAuthPage() {
  const [testResult, setTestResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)
  const [warnings, setWarnings] = useState<string[]>([])

  const testGoogleOAuthConfig = async () => {
    setIsLoading(true)
    setTestResult('')

    try {
      // 检查环境变量
      const response = await fetch('/api/auth/google/test-config', {
        method: 'GET',
      })

      const data = await response.json()

      if (data.success) {
        setIsDevMode(data.devMode || false)
        setWarnings(data.warnings || [])

        if (data.devMode) {
          setTestResult('✅ Google OAuth配置正确！（开发模式）\n🧪 正在使用模拟凭据进行测试。')
        } else {
          setTestResult('✅ Google OAuth配置正确！可以开始测试登录流程。')
        }
      } else {
        setTestResult(`❌ 配置错误: ${data.error}`)
      }
    } catch (error) {
      setTestResult('❌ 测试失败: 无法连接到服务器')
    } finally {
      setIsLoading(false)
    }
  }

  const testGoogleLogin = () => {
    window.location.href = '/api/auth/google'
  }

  const verifyFreeStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/google/verify-free')
      const data = await response.json()

      if (data.success) {
        const freeInfo = `
🆓 免费状态验证：

${data.message}

免费功能：
${data.freeFeatures.join('\n')}

成本分析：
• 设置成本：${data.costAnalysis.setup}
• 月度使用：${data.costAnalysis.monthlyUsage}
• 用户登录：${data.costAnalysis.userLogin}
• API调用：${data.costAnalysis.apiCalls}

建议：
${data.recommendations.join('\n')}
        `
        setTestResult(freeInfo)
      }
    } catch (error) {
      setTestResult('❌ 免费状态检查失败')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Google OAuth 测试</CardTitle>
            <CardDescription className="text-gray-600">
              测试Google OAuth配置和登录流程
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Button
              onClick={testGoogleOAuthConfig}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? '检查中...' : '检查配置'}
            </Button>

            <Button
              onClick={verifyFreeStatus}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? '验证中...' : '🆓 验证免费状态'}
            </Button>

            <Button
              onClick={testGoogleLogin}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isDevMode ? '测试Google登录（开发模式）' : '测试Google登录'}
            </Button>

            {isDevMode && (
              <div className="space-y-2">
                <Button
                  onClick={() => window.location.href = '/api/auth/google/dev-mode?user=0'}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
                >
                  模拟用户1: test@gmail.com
                </Button>
                <Button
                  onClick={() => window.location.href = '/api/auth/google/dev-mode?user=1'}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm"
                >
                  模拟用户2: demo@gmail.com
                </Button>
              </div>
            )}

            {testResult && (
              <Alert className={testResult.includes('✅') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={testResult.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                  <pre className="whitespace-pre-wrap">{testResult}</pre>
                </AlertDescription>
              </Alert>
            )}

            {warnings.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                  <div className="font-semibold mb-1">⚠️ 注意事项：</div>
                  {warnings.map((warning, index) => (
                    <div key={index} className="text-sm">• {warning}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-6 text-sm text-gray-600">
              <h3 className="font-semibold mb-2">配置检查项：</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>GOOGLE_CLIENT_ID 环境变量</li>
                <li>GOOGLE_CLIENT_SECRET 环境变量</li>
                <li>NEXTAUTH_URL 环境变量</li>
                <li>Google OAuth库安装</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
