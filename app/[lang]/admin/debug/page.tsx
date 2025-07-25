'use client'

import { useParams, usePathname } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  const params = useParams()
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>路由调试信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>当前路径:</strong> {pathname}
          </div>
          <div>
            <strong>参数:</strong> {JSON.stringify(params, null, 2)}
          </div>
          <div>
            <strong>语言:</strong> {params?.lang as string}
          </div>
          <div>
            <strong>时间:</strong> {new Date().toLocaleString()}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>测试链接</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <a href="." className="text-blue-600 hover:underline">
              管理首页
            </a>
          </div>
          <div>
            <a href="products" className="text-blue-600 hover:underline">
              产品列表
            </a>
          </div>
          <div>
            <a href="test" className="text-blue-600 hover:underline">
              测试页面
            </a>
          </div>
          <div>
            <a href="debug" className="text-blue-600 hover:underline">
              当前页面
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
