'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'

interface PerformanceTest {
  name: string
  url: string
  status: 'pending' | 'success' | 'slow' | 'error'
  duration?: number
  error?: string
}

export default function PerformancePage() {
  const [tests, setTests] = useState<PerformanceTest[]>([
    { name: '简单页面', url: '/simple', status: 'pending' },
    { name: '快速主页', url: '/fast', status: 'pending' },
    { name: '完整主页', url: '/en', status: 'pending' },
    { name: 'Stripe测试', url: '/stripe-test', status: 'pending' },
    { name: '错误监控', url: '/error-monitor', status: 'pending' }
  ])
  
  const [isRunning, setIsRunning] = useState(false)
  const [pageLoadTime, setPageLoadTime] = useState<number | null>(null)

  useEffect(() => {
    // 记录当前页面加载时间
    const loadTime = performance.now()
    setPageLoadTime(loadTime)
  }, [])

  const runPerformanceTest = async (test: PerformanceTest): Promise<PerformanceTest> => {
    const startTime = performance.now()
    
    try {
      const response = await fetch(test.url, { 
        method: 'HEAD',
        cache: 'no-cache'
      })
      
      const duration = performance.now() - startTime
      
      if (!response.ok) {
        return {
          ...test,
          status: 'error',
          error: `HTTP ${response.status}`,
          duration
        }
      }
      
      // 判断性能等级
      let status: 'success' | 'slow' = 'success'
      if (duration > 2000) {
        status = 'slow'
      }
      
      return {
        ...test,
        status,
        duration
      }
    } catch (error) {
      const duration = performance.now() - startTime
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
      const result = await runPerformanceTest(test)
      
      setTests(prev => prev.map((t, index) => 
        index === i ? result : t
      ))
    }
    
    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'slow':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'pending':
        return <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />
      default:
        return <Zap className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusBadge = (status: string, duration?: number) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-600">快速</Badge>
      case 'slow':
        return <Badge variant="secondary" className="bg-yellow-600">较慢</Badge>
      case 'error':
        return <Badge variant="destructive">错误</Badge>
      case 'pending':
        return <Badge variant="outline">测试中</Badge>
      default:
        return <Badge variant="outline">未知</Badge>
    }
  }

  const getDurationColor = (duration?: number) => {
    if (!duration) return 'text-gray-500'
    if (duration < 500) return 'text-green-600'
    if (duration < 1000) return 'text-yellow-600'
    if (duration < 2000) return 'text-orange-600'
    return 'text-red-600'
  }

  const successCount = tests.filter(t => t.status === 'success').length
  const slowCount = tests.filter(t => t.status === 'slow').length
  const errorCount = tests.filter(t => t.status === 'error').length

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 标题 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">性能监控</h1>
          <p className="text-muted-foreground">
            检查页面加载速度和响应时间
          </p>
        </div>

        {/* 当前页面性能 */}
        <Card>
          <CardHeader>
            <CardTitle>当前页面性能</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {pageLoadTime ? `${pageLoadTime.toFixed(0)}ms` : '计算中...'}
                </div>
                <div className="text-sm text-muted-foreground">页面加载时间</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {navigator.hardwareConcurrency || 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">CPU核心数</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {navigator.onLine ? '在线' : '离线'}
                </div>
                <div className="text-sm text-muted-foreground">网络状态</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 总览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-muted-foreground">快速</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{slowCount}</div>
              <div className="text-sm text-muted-foreground">较慢</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-muted-foreground">错误</div>
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
            {isRunning ? '测试中...' : '开始性能测试'}
          </Button>
        </div>

        {/* 测试结果 */}
        <Card>
          <CardHeader>
            <CardTitle>页面性能测试</CardTitle>
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
                      <span className={`text-sm font-mono ${getDurationColor(test.duration)}`}>
                        {test.duration.toFixed(0)}ms
                      </span>
                    )}
                    {getStatusBadge(test.status, test.duration)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 性能建议 */}
        <Card>
          <CardHeader>
            <CardTitle>性能优化建议</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert>
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>快速页面 (/fast)</strong>: 使用模拟数据，避免API调用，加载速度最快
                </AlertDescription>
              </Alert>
              
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>完整主页 (/en)</strong>: 包含完整功能但可能较慢，建议优化API调用
                </AlertDescription>
              </Alert>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>简单页面 (/simple)</strong>: 静态内容，加载速度快，适合测试基础功能
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        {/* 导航链接 */}
        <div className="text-center space-x-4">
          <a href="/simple" className="text-blue-600 hover:underline">
            → 简单页面
          </a>
          <a href="/fast" className="text-blue-600 hover:underline">
            → 快速主页
          </a>
          <a href="/en" className="text-blue-600 hover:underline">
            → 完整主页
          </a>
        </div>
      </div>
    </div>
  )
}
