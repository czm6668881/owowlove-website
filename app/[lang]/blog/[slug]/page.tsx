'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft,
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  Tag,
  Share2,
  BookOpen,
  Clock,
  User,
  AlertCircle
} from 'lucide-react'
import { BlogPostWithDetails } from '@/lib/types/blog'
import { CommentSection } from '@/components/blog/comment-section'
import { BlogSEO } from '@/components/blog/blog-seo'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const [post, setPost] = useState<BlogPostWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  const fetchPost = async (slug: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/blog/posts/${slug}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setPost(result.data)
      } else {
        setError(result.error || 'Article not found')
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onShowFavorites={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading article...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onShowFavorites={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Article not found'}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogSEO post={post} lang={params.lang as string} />
      <Header onShowFavorites={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href={`/${params.lang}/blog`}>
            <Button variant="ghost" className="text-gray-600 hover:text-pink-600">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* 文章内容 */}
        <article className="max-w-4xl mx-auto">
          {/* 特色图片 */}
          {post.featured_image && (
            <div className="aspect-video overflow-hidden rounded-lg mb-8 shadow-lg">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                }}
              />
            </div>
          )}

          {/* 文章头部 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            {/* 分类和特色标识 */}
            <div className="flex items-center space-x-2 mb-4">
              {post.category && (
                <Badge style={{ backgroundColor: post.category.color }} className="text-white">
                  {post.category.name}
                </Badge>
              )}
              {post.is_featured && (
                <Badge variant="secondary">Featured</Badge>
              )}
            </div>

            {/* 标题 */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            {/* 摘要 */}
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            {/* 元数据 */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                <span>{estimateReadingTime(post.content)} min read</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{post.view_count} views</span>
              </div>
            </div>

            {/* 标签 */}
            {post.tag_details && post.tag_details.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tag_details.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-sm">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* 分享按钮 */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Like ({post.like_count})
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Comments ({post.comment_count})
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* 文章正文 */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-pink-600 prose-strong:text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
            />
          </div>

          {/* 文章底部 */}
          <Card className="p-6 mb-8">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Like this article
                  </Button>
                  <Button variant="outline">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Save for later
                  </Button>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {formatDate(post.updated_at)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 评论区域 */}
          <CommentSection postSlug={post.slug} />
        </article>
      </main>

      <Footer />
    </div>
  )
}
