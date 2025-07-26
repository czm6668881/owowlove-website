// 博客分类接口
export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// 博客标签接口
export interface BlogTag {
  id: string
  name: string
  slug: string
  color?: string
  created_at: string
}

// 博客文章接口
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image?: string
  category_id: string
  tags: string[]
  author: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  view_count: number
  like_count: number
  comment_count: number
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
  published_at?: string
  created_at: string
  updated_at: string
}

// 博客文章详情（包含关联数据）
export interface BlogPostWithDetails extends BlogPost {
  category?: BlogCategory
  tag_details?: BlogTag[]
}

// 博客评论接口
export interface BlogComment {
  id: string
  post_id: string
  author_name: string
  author_email: string
  author_website?: string
  content: string
  status: 'pending' | 'approved' | 'spam'
  parent_id?: string
  created_at: string
  updated_at: string
}

// 博客评论详情（包含回复）
export interface BlogCommentWithReplies extends BlogComment {
  replies?: BlogComment[]
}

// API响应接口
export interface BlogPostsResponse {
  success: boolean
  data: BlogPost[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  error?: string
}

export interface BlogPostResponse {
  success: boolean
  data: BlogPostWithDetails | null
  error?: string
}

export interface BlogCategoriesResponse {
  success: boolean
  data: BlogCategory[]
  error?: string
}

export interface BlogTagsResponse {
  success: boolean
  data: BlogTag[]
  error?: string
}

// 博客文章创建/更新数据
export interface CreateBlogPostData {
  title: string
  slug?: string
  excerpt: string
  content: string
  featured_image?: string
  category_id: string
  tags: string[]
  author: string
  status: 'draft' | 'published'
  is_featured?: boolean
  seo_title?: string
  seo_description?: string
  seo_keywords?: string[]
}

export interface UpdateBlogPostData extends Partial<CreateBlogPostData> {
  id: string
}

// 博客分类创建/更新数据
export interface CreateBlogCategoryData {
  name: string
  slug?: string
  description?: string
  color?: string
  is_active?: boolean
}

export interface UpdateBlogCategoryData extends Partial<CreateBlogCategoryData> {
  id: string
}

// 博客标签创建数据
export interface CreateBlogTagData {
  name: string
  slug?: string
  color?: string
}

// 博客搜索参数
export interface BlogSearchParams {
  page?: number
  limit?: number
  category?: string
  tag?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  search?: string
  sort?: 'newest' | 'oldest' | 'popular' | 'title'
}

// 博客统计数据
export interface BlogStats {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_categories: number
  total_tags: number
  total_views: number
  total_likes: number
  total_comments: number
}
