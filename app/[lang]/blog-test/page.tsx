'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BookOpen, 
  FileText, 
  BarChart3, 
  Eye, 
  Heart, 
  MessageCircle,
  CheckCircle,
  ExternalLink,
  Settings,
  Users
} from 'lucide-react'
import { BlogStats } from '@/lib/types/blog'

export default function BlogTestPage() {
  const params = useParams()
  const [stats, setStats] = useState<BlogStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/blog/stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching blog stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const testItems = [
    {
      title: '博客前端功能',
      items: [
        { name: '博客列表页面', url: `/${params.lang}/blog`, status: 'ready' },
        { name: '文章详情页面', url: `/${params.lang}/blog/ultimate-guide-cosplay-photography`, status: 'ready' },
        { name: '分类筛选功能', url: `/${params.lang}/blog?category=cat-1`, status: 'ready' },
        { name: '搜索功能', url: `/${params.lang}/blog?search=cosplay`, status: 'ready' },
        { name: '响应式设计', url: `/${params.lang}/blog`, status: 'ready' }
      ]
    },
    {
      title: '博客后台管理',
      items: [
        { name: '文章管理页面', url: '/admin/blog/posts', status: 'ready' },
        { name: '分类管理页面', url: '/admin/blog/categories', status: 'ready' },
        { name: '文章创建功能', url: '/admin/blog/posts/new', status: 'pending' },
        { name: '文章编辑功能', url: '/admin/blog/posts/edit', status: 'pending' },
        { name: '统计数据显示', url: '/admin/blog/posts', status: 'ready' }
      ]
    },
    {
      title: 'API 接口',
      items: [
        { name: '获取文章列表', url: '/api/blog/posts', status: 'ready' },
        { name: '获取单篇文章', url: '/api/blog/posts/ultimate-guide-cosplay-photography', status: 'ready' },
        { name: '获取分类列表', url: '/api/blog/categories', status: 'ready' },
        { name: '获取标签列表', url: '/api/blog/tags', status: 'ready' },
        { name: '获取统计数据', url: '/api/blog/stats', status: 'ready' }
      ]
    },
    {
      title: '导航集成',
      items: [
        { name: '主导航菜单', url: `/${params.lang}`, status: 'ready' },
        { name: '管理员侧边栏', url: '/admin', status: 'ready' },
        { name: 'SEO 优化', url: `/${params.lang}/blog`, status: 'ready' },
        { name: '面包屑导航', url: `/${params.lang}/blog`, status: 'pending' },
        { name: '相关文章推荐', url: `/${params.lang}/blog`, status: 'pending' }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Settings className="w-4 h-4" />
      case 'error': return <ExternalLink className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onShowFavorites={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">博客功能测试</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            验证 OWOWLOVE 博客系统的完整功能和集成状态
          </p>
        </div>

        {/* 统计概览 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总文章数</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_posts}</div>
                <p className="text-xs text-muted-foreground">
                  已发布: {stats.published_posts} | 草稿: {stats.draft_posts}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">分类数量</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_categories}</div>
                <p className="text-xs text-muted-foreground">
                  标签: {stats.total_tags}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_views}</div>
                <p className="text-xs text-muted-foreground">
                  点赞: {stats.total_likes}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">评论数量</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total_comments}</div>
                <p className="text-xs text-muted-foreground">
                  互动数据
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 功能测试列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testItems.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(item.status)}
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status === 'ready' ? '已完成' : item.status === 'pending' ? '待开发' : '错误'}
                        </Badge>
                        {item.status === 'ready' && (
                          <Link href={item.url} target="_blank">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 快速链接 */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">快速访问链接</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href={`/${params.lang}/blog`}>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                博客首页
              </Button>
            </Link>
            <Link href="/admin/blog/posts">
              <Button className="w-full justify-start" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                文章管理
              </Button>
            </Link>
            <Link href="/admin/blog/categories">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                分类管理
              </Button>
            </Link>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">博客系统功能说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800">
            <div>
              <h3 className="font-semibold mb-2">前端功能</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>响应式博客列表页面</li>
                <li>文章详情页面展示</li>
                <li>分类和标签筛选</li>
                <li>搜索功能</li>
                <li>文章浏览统计</li>
                <li>SEO 优化支持</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">后台管理</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>文章 CRUD 操作</li>
                <li>分类管理</li>
                <li>标签管理</li>
                <li>统计数据展示</li>
                <li>文章状态管理</li>
                <li>富文本编辑器</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
