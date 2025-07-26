'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Calendar, 
  Eye, 
  Heart, 
  MessageCircle, 
  Tag,
  Filter,
  Grid,
  List
} from 'lucide-react'
import { BlogPost, BlogCategory, BlogTag } from '@/lib/types/blog'
import { BlogSEO } from '@/components/blog/blog-seo'
import { AdvancedSearch } from '@/components/blog/advanced-search'
import { SearchHighlight } from '@/components/blog/search-highlight'

export default function BlogPage() {
  const params = useParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchBlogData()
  }, [selectedCategory, selectedTag, sortBy])

  const fetchBlogData = async () => {
    try {
      setLoading(true)
      
      // 构建查询参数
      const queryParams = new URLSearchParams({
        status: 'published',
        sort: sortBy
      })
      
      if (selectedCategory && selectedCategory !== 'all') queryParams.append('category', selectedCategory)
      if (selectedTags.length > 0) queryParams.append('tags', selectedTags.join(','))
      if (searchTerm) queryParams.append('search', searchTerm)

      // 获取文章
      const postsResponse = await fetch(`/api/blog/posts?${queryParams}`)
      const postsResult = await postsResponse.json()
      
      // 获取分类
      const categoriesResponse = await fetch('/api/blog/categories')
      const categoriesResult = await categoriesResponse.json()
      
      // 获取标签
      const tagsResponse = await fetch('/api/blog/tags')
      const tagsResult = await tagsResponse.json()

      if (postsResult.success) setPosts(postsResult.data)
      if (categoriesResult.success) setCategories(categoriesResult.data)
      if (tagsResult.success) setTags(tagsResult.data)
      
    } catch (error) {
      console.error('Error fetching blog data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchBlogData()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)
  }

  const getTagsByIds = (tagSlugs: string[]) => {
    return tags.filter(tag => tagSlugs.includes(tag.slug))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogSEO isListPage={true} lang={params.lang as string} />
      <Header onShowFavorites={() => {}} />
      
      <main className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">OWOWLOVE Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the latest trends, tutorials, and insights from the cosplay community
          </p>
        </div>

        {/* 高级搜索 */}
        <div className="mb-8">
          <AdvancedSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            categories={categories}
            tags={tags}
            onSearch={handleSearch}
            onClear={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedTags([])
              fetchBlogData()
            }}
          />
        </div>

        {/* 视图切换 */}
        <div className="flex justify-end mb-6">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 文章列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
            {posts.map((post) => {
              const category = getCategoryById(post.category_id)
              const postTags = getTagsByIds(post.tags)
              
              return (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  {viewMode === 'grid' ? (
                    <>
                      {post.featured_image && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={post.featured_image}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg'
                            }}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          {category && (
                            <Badge style={{ backgroundColor: category.color }} className="text-white">
                              {category.name}
                            </Badge>
                          )}
                          {post.is_featured && (
                            <Badge variant="secondary">Featured</Badge>
                          )}
                        </div>
                        <Link href={`/${params.lang}/blog/${post.slug}`}>
                          <h3 className="text-xl font-semibold text-gray-900 hover:text-pink-600 transition-colors line-clamp-2">
                            <SearchHighlight text={post.title} searchTerm={searchTerm} />
                          </h3>
                        </Link>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          <SearchHighlight text={post.excerpt} searchTerm={searchTerm} />
                        </p>
                        
                        {/* 标签 */}
                        {postTags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {postTags.slice(0, 3).map((tag) => (
                              <Badge key={tag.id} variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag.name}
                              </Badge>
                            ))}
                            {postTags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{postTags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* 元数据 */}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDate(post.published_at || post.created_at)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {post.view_count}
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {post.like_count}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {post.comment_count}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <CardContent className="p-6">
                      <div className="flex space-x-4">
                        {post.featured_image && (
                          <div className="w-32 h-24 flex-shrink-0 overflow-hidden rounded-lg">
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
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {category && (
                              <Badge style={{ backgroundColor: category.color }} className="text-white text-xs">
                                {category.name}
                              </Badge>
                            )}
                            {post.is_featured && (
                              <Badge variant="secondary" className="text-xs">Featured</Badge>
                            )}
                          </div>
                          <Link href={`/${params.lang}/blog/${post.slug}`}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors mb-2">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(post.published_at || post.created_at)}
                            </span>
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {post.view_count}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-3 h-3 mr-1" />
                                {post.like_count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
