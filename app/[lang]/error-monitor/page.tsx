'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Network,
  Database,
  CreditCard
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

interface ApiTest {
  name: string
  url: string
  status: 'pending' | 'success' | 'error'
  error?: string
  data?: any
  duration?: number
}

export default function ErrorMonitorPage() {
  const [tests, setTests] = useState<ApiTest[]>([
    { name: '产品API', url: '/api/products', status: 'pending' },
    { name: '支付方法API', url: '/api/payment/methods', status: 'pending' },
    { name: '管理员设置API', url: '/api/admin/settings', status: 'pending' },
    { name: 'Stripe配置API', url: '/api/payment/stripe/config', status: 'pending' }
  ])

  const [isRunning, setIsRunning] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const runTest = async (test: ApiTest): Promise<ApiTest> => {
    const startTime = Date.now()
    
    try {
      const response = await fetch(test.url)
      const duration = Date.now() - startTime
      
      if (!response.ok) {
        return {
          ...test,
          status: 'error',
          error: `HTTP ${response.status}: ${response.statusText}`,
          duration
        }
      }
      
      const data = await response.json()
      
      return {
        ...test,
        status: 'success',
        data,
        duration
      }
    } catch (error) {
      const duration = Date.now() - startTime
      return {
        ...test,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    
    // 重置所有测试状态
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const })))
    
    // 逐个运行测试
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i]
      const result = await runTest(test)
      
      setTests(prev => prev.map((t, index) => 
        index === i ? result : t
      ))
    }
    
    setIsRunning(false)
  }

  useEffect(() => {
    runAllTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'pending':
        return <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-600">成功</Badge>
      case 'error':
        return <Badge variant="destructive">失败</Badge>
      case 'pending':
        return <Badge variant="secondary">测试中</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const successCount = tests.filter(t => t.status === 'success').length
  const errorCount = tests.filter(t => t.status === 'error').length
  const pendingCount = tests.filter(t => t.status === 'pending').length

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 标题 */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">系统状态监控</h1>
            <p className="text-muted-foreground">
              检查API端点和系统组件的运行状态
            </p>
          </div>

          {/* 总览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{successCount}</div>
                <div className="text-sm text-muted-foreground">成功</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-muted-foreground">失败</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">{pendingCount}</div>
                <div className="text-sm text-muted-foreground">测试中</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{tests.length}</div>
                <div className="text-sm text-muted-foreground">总计</div>
              </CardContent>
            </Card>
          </div>

          {/* 控制按钮 */}
          <div className="text-center">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="w-full md:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? '测试中...' : '重新测试'}
            </Button>
          </div>

          {/* 测试结果 */}
          <Card>
            <CardHeader>
              <CardTitle>API 端点测试</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="font-medium">{test.name}</div>
                        <div className="text-sm text-muted-foreground">{test.url}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {test.duration && (
                        <span className="text-sm text-muted-foreground">
                          {test.duration}ms
                        </span>
                      )}
                      {getStatusBadge(test.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 错误详情 */}
          {errorCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">错误详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tests.filter(t => t.status === 'error').map((test, index) => (
                    <Alert key={index} variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{test.name}</strong>: {test.error}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 成功响应数据 */}
          {successCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">成功响应</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tests.filter(t => t.status === 'success').map((test, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-medium">{test.name}</h4>
                      <pre className="p-3 bg-muted rounded-lg text-xs overflow-auto">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 系统信息 */}
          <Card>
            <CardHeader>
              <CardTitle>系统信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium mb-2">环境变量</h4>
                  <div className="space-y-1">
                    <p>NODE_ENV: {process.env.NODE_ENV}</p>
                    <p>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '已配置' : '未配置'}</p>
                    <p>Stripe Public Key: {process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ? '已配置' : '未配置'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">浏览器信息</h4>
                  <div className="space-y-1">
                    {mounted ? (
                      <>
                        <p>User Agent: {navigator.userAgent.split(' ')[0]}</p>
                        <p>Language: {navigator.language}</p>
                        <p>Online: {navigator.onLine ? '是' : '否'}</p>
                      </>
                    ) : (
                      <>
                        <p>User Agent: 加载中...</p>
                        <p>Language: 加载中...</p>
                        <p>Online: 加载中...</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
