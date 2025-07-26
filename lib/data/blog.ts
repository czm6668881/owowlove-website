import { 
  BlogPost, 
  BlogCategory, 
  BlogTag, 
  BlogPostWithDetails,
  CreateBlogPostData,
  UpdateBlogPostData,
  CreateBlogCategoryData,
  UpdateBlogCategoryData,
  CreateBlogTagData,
  BlogSearchParams,
  BlogStats,
  BlogComment
} from '@/lib/types/blog'

// 模拟数据存储
let blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Ultimate Guide to Cosplay Photography',
    slug: 'ultimate-guide-cosplay-photography',
    excerpt: 'Learn professional tips and techniques for capturing stunning cosplay photos that bring your characters to life.',
    content: `# The Ultimate Guide to Cosplay Photography

Cosplay photography is an art form that combines fashion photography, portrait photography, and creative storytelling. Whether you're a cosplayer looking to document your work or a photographer interested in this exciting genre, this guide will help you create stunning images.

## Essential Equipment

### Camera and Lenses
- DSLR or mirrorless camera with manual controls
- 50mm f/1.8 lens for portraits
- 85mm f/1.4 for beautiful bokeh
- Wide-angle lens for environmental shots

### Lighting Equipment
- Softbox or umbrella for soft, even lighting
- Reflectors to fill in shadows
- LED panels for consistent lighting
- Flash triggers for off-camera flash

## Composition Techniques

### Rule of Thirds
Place your subject along the rule of thirds lines to create more dynamic compositions.

### Leading Lines
Use architectural elements or natural lines to guide the viewer's eye to your subject.

### Depth of Field
Use shallow depth of field to isolate your subject from the background.

## Post-Processing Tips

### Color Grading
Enhance the mood of your photos with appropriate color grading that matches the character's aesthetic.

### Retouching
- Remove distracting elements
- Enhance costume details
- Adjust skin tone and texture
- Add special effects if needed

## Working with Cosplayers

### Communication
- Discuss the character and desired mood beforehand
- Share reference images
- Be respectful and professional
- Give clear direction during the shoot

### Posing
- Study the character's signature poses
- Encourage natural expressions
- Capture both action shots and portraits
- Take multiple shots of each pose

## Location Scouting

### Indoor Locations
- Studios with controllable lighting
- Convention centers
- Historic buildings
- Modern architectural spaces

### Outdoor Locations
- Parks and gardens
- Urban environments
- Beaches and natural landscapes
- Abandoned or industrial locations

## Conclusion

Great cosplay photography requires technical skill, creativity, and collaboration. Practice these techniques, experiment with different styles, and most importantly, have fun bringing these amazing characters to life through your lens!`,
    featured_image: '/placeholder.jpg',
    category_id: 'cat-1',
    tags: ['photography', 'cosplay', 'tutorial'],
    author: 'OWOWLOVE Team',
    status: 'published',
    is_featured: true,
    view_count: 1250,
    like_count: 89,
    comment_count: 23,
    seo_title: 'Ultimate Cosplay Photography Guide - Tips & Techniques',
    seo_description: 'Master cosplay photography with our comprehensive guide. Learn equipment, techniques, and tips for stunning cosplay photos.',
    seo_keywords: ['cosplay photography', 'photography tips', 'cosplay guide', 'portrait photography'],
    published_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'post-2',
    title: 'Top 10 Trending Cosplay Characters in 2024',
    slug: 'top-10-trending-cosplay-characters-2024',
    excerpt: 'Discover the most popular cosplay characters this year and get inspired for your next costume project.',
    content: `# Top 10 Trending Cosplay Characters in 2024

The cosplay community is always evolving, with new characters gaining popularity from anime, games, movies, and TV shows. Here are the top 10 trending cosplay characters that are dominating conventions and social media in 2024.

## 1. Nezuko Kamado (Demon Slayer)
Still incredibly popular, Nezuko's iconic look with her bamboo muzzle and pink kimono continues to be a favorite among cosplayers.

## 2. Power (Chainsaw Man)
The Blood Devil's wild personality and distinctive appearance have made her one of the most cosplayed characters this year.

## 3. Yor Forger (Spy x Family)
The assassin mother's elegant yet deadly persona has captured the hearts of cosplayers worldwide.

## 4. Makima (Chainsaw Man)
The Control Devil's sophisticated and mysterious appearance makes for stunning cosplay photos.

## 5. Marin Kitagawa (My Dress-Up Darling)
A cosplayer cosplaying a cosplayer! Marin's various outfits provide endless inspiration.

## 6. Raiden Shogun (Genshin Impact)
The Electro Archon's regal appearance and intricate design continue to challenge and inspire cosplayers.

## 7. Jinx (Arcane/League of Legends)
The chaotic character's punk aesthetic and blue hair have made her a convention staple.

## 8. Wednesday Addams (Wednesday)
The Netflix series brought new life to this classic character, inspiring countless interpretations.

## 9. Hu Tao (Genshin Impact)
The Pyro character's playful personality and unique design make her perfect for expressive cosplay.

## 10. Tanjiro Kamado (Demon Slayer)
The protagonist's distinctive checkered haori and kind demeanor continue to be popular choices.

## Tips for Choosing Your Next Cosplay

- Consider your skill level and budget
- Choose characters you genuinely love
- Think about the convention environment
- Don't be afraid to put your own spin on classic characters

Happy cosplaying!`,
    featured_image: '/placeholder.jpg',
    category_id: 'cat-2',
    tags: ['trends', 'characters', '2024'],
    author: 'OWOWLOVE Team',
    status: 'published',
    is_featured: true,
    view_count: 2100,
    like_count: 156,
    comment_count: 45,
    seo_title: 'Top 10 Trending Cosplay Characters 2024 - Popular Costumes',
    seo_description: 'Discover the most popular cosplay characters in 2024. Get inspired for your next costume with our trending character guide.',
    seo_keywords: ['trending cosplay', '2024 cosplay', 'popular characters', 'cosplay trends'],
    published_at: '2024-02-01T14:30:00Z',
    created_at: '2024-02-01T14:30:00Z',
    updated_at: '2024-02-01T14:30:00Z'
  }
]

let blogCategories: BlogCategory[] = [
  {
    id: 'cat-1',
    name: 'Tutorials',
    slug: 'tutorials',
    description: 'Step-by-step guides and how-to articles for cosplay creation',
    color: '#3B82F6',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-2',
    name: 'Trends',
    slug: 'trends',
    description: 'Latest trends and popular characters in the cosplay community',
    color: '#EF4444',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cat-3',
    name: 'Reviews',
    slug: 'reviews',
    description: 'Product reviews and recommendations for cosplayers',
    color: '#10B981',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

let blogTags: BlogTag[] = [
  { id: 'tag-1', name: 'Photography', slug: 'photography', color: '#8B5CF6', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-2', name: 'Cosplay', slug: 'cosplay', color: '#F59E0B', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-3', name: 'Tutorial', slug: 'tutorial', color: '#06B6D4', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-4', name: 'Trends', slug: 'trends', color: '#EC4899', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-5', name: 'Characters', slug: 'characters', color: '#84CC16', created_at: '2024-01-01T00:00:00Z' },
  { id: 'tag-6', name: '2024', slug: '2024', color: '#6366F1', created_at: '2024-01-01T00:00:00Z' }
]

// 模拟评论数据
let blogComments: BlogComment[] = [
  {
    id: 'comment-1',
    post_id: 'post-1',
    author_name: 'Sarah Johnson',
    author_email: 'sarah@example.com',
    content: 'This is such a helpful guide! I\'ve been struggling with cosplay photography and these tips are exactly what I needed.',
    status: 'approved',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'comment-2',
    post_id: 'post-1',
    author_name: 'Mike Chen',
    author_email: 'mike@example.com',
    content: 'Great article! The lighting tips especially helped me improve my photos.',
    status: 'approved',
    created_at: '2024-01-16T14:20:00Z',
    updated_at: '2024-01-16T14:20:00Z'
  }
]

export class BlogService {
  // 获取博客文章列表
  static async getPosts(params: BlogSearchParams = {}): Promise<BlogPost[]> {
    let filteredPosts = [...blogPosts]

    // 状态筛选
    if (params.status) {
      filteredPosts = filteredPosts.filter(post => post.status === params.status)
    }

    // 分类筛选
    if (params.category) {
      filteredPosts = filteredPosts.filter(post => post.category_id === params.category)
    }

    // 标签筛选
    if (params.tag) {
      filteredPosts = filteredPosts.filter(post => post.tags.includes(params.tag))
    }

    // 特色文章筛选
    if (params.featured !== undefined) {
      filteredPosts = filteredPosts.filter(post => post.is_featured === params.featured)
    }

    // 搜索
    if (params.search) {
      const searchTerm = params.search.toLowerCase()
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      )
    }

    // 排序
    switch (params.sort) {
      case 'oldest':
        filteredPosts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'popular':
        filteredPosts.sort((a, b) => b.view_count - a.view_count)
        break
      case 'title':
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'newest':
      default:
        filteredPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
    }

    // 分页
    const page = params.page || 1
    const limit = params.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return filteredPosts.slice(startIndex, endIndex)
  }

  // 根据ID获取单篇文章
  static async getPostById(id: string): Promise<BlogPostWithDetails | null> {
    const post = blogPosts.find(p => p.id === id)
    if (!post) return null

    const category = blogCategories.find(c => c.id === post.category_id)
    const tag_details = blogTags.filter(t => post.tags.includes(t.slug))

    return {
      ...post,
      category,
      tag_details
    }
  }

  // 根据slug获取单篇文章
  static async getPostBySlug(slug: string): Promise<BlogPostWithDetails | null> {
    const post = blogPosts.find(p => p.slug === slug)
    if (!post) return null

    // 增加浏览量
    post.view_count += 1

    const category = blogCategories.find(c => c.id === post.category_id)
    const tag_details = blogTags.filter(t => post.tags.includes(t.slug))

    return {
      ...post,
      category,
      tag_details
    }
  }

  // 创建文章
  static async createPost(data: CreateBlogPostData): Promise<BlogPost> {
    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      featured_image: data.featured_image,
      category_id: data.category_id,
      tags: data.tags,
      author: data.author,
      status: data.status,
      is_featured: data.is_featured || false,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      seo_keywords: data.seo_keywords,
      published_at: data.status === 'published' ? new Date().toISOString() : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    blogPosts.unshift(newPost)
    return newPost
  }

  // 更新文章
  static async updatePost(data: UpdateBlogPostData): Promise<BlogPost | null> {
    const index = blogPosts.findIndex(p => p.id === data.id)
    if (index === -1) return null

    const updatedPost = {
      ...blogPosts[index],
      ...data,
      updated_at: new Date().toISOString()
    }

    // 如果状态改为已发布且之前没有发布时间，设置发布时间
    if (data.status === 'published' && !blogPosts[index].published_at) {
      updatedPost.published_at = new Date().toISOString()
    }

    blogPosts[index] = updatedPost
    return updatedPost
  }

  // 删除文章
  static async deletePost(id: string): Promise<boolean> {
    const index = blogPosts.findIndex(p => p.id === id)
    if (index === -1) return false

    blogPosts.splice(index, 1)
    return true
  }

  // 根据slug删除文章
  static async deletePostBySlug(slug: string): Promise<boolean> {
    const index = blogPosts.findIndex(p => p.slug === slug)
    if (index === -1) return false

    blogPosts.splice(index, 1)
    return true
  }

  // 获取分类列表
  static async getCategories(): Promise<BlogCategory[]> {
    return blogCategories.filter(c => c.is_active)
  }

  // 创建分类
  static async createCategory(data: CreateBlogCategoryData): Promise<BlogCategory> {
    const newCategory: BlogCategory = {
      id: `cat-${Date.now()}`,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: data.description,
      color: data.color,
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    blogCategories.push(newCategory)
    return newCategory
  }

  // 根据ID获取分类
  static async getCategoryById(id: string): Promise<BlogCategory | null> {
    return blogCategories.find(c => c.id === id) || null
  }

  // 更新分类
  static async updateCategory(data: UpdateBlogCategoryData): Promise<BlogCategory | null> {
    const index = blogCategories.findIndex(c => c.id === data.id)
    if (index === -1) return null

    const updatedCategory = {
      ...blogCategories[index],
      name: data.name || blogCategories[index].name,
      slug: data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : blogCategories[index].slug),
      description: data.description !== undefined ? data.description : blogCategories[index].description,
      color: data.color || blogCategories[index].color,
      is_active: data.is_active !== undefined ? data.is_active : blogCategories[index].is_active,
      updated_at: new Date().toISOString()
    }

    blogCategories[index] = updatedCategory
    return updatedCategory
  }

  // 删除分类
  static async deleteCategory(id: string): Promise<boolean> {
    const index = blogCategories.findIndex(c => c.id === id)
    if (index === -1) return false

    blogCategories.splice(index, 1)
    return true
  }

  // 获取标签列表
  static async getTags(): Promise<BlogTag[]> {
    return blogTags
  }

  // 创建标签
  static async createTag(data: CreateBlogTagData): Promise<BlogTag> {
    const newTag: BlogTag = {
      id: `tag-${Date.now()}`,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      color: data.color,
      created_at: new Date().toISOString()
    }

    blogTags.push(newTag)
    return newTag
  }

  // 根据ID获取标签
  static async getTagById(id: string): Promise<BlogTag | null> {
    return blogTags.find(t => t.id === id) || null
  }

  // 更新标签
  static async updateTag(data: { id: string } & Partial<CreateBlogTagData>): Promise<BlogTag | null> {
    const index = blogTags.findIndex(t => t.id === data.id)
    if (index === -1) return null

    const updatedTag = {
      ...blogTags[index],
      name: data.name || blogTags[index].name,
      slug: data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : blogTags[index].slug),
      color: data.color || blogTags[index].color
    }

    blogTags[index] = updatedTag
    return updatedTag
  }

  // 删除标签
  static async deleteTag(id: string): Promise<boolean> {
    const index = blogTags.findIndex(t => t.id === id)
    if (index === -1) return false

    blogTags.splice(index, 1)
    return true
  }

  // 获取博客统计
  static async getStats(): Promise<BlogStats> {
    const total_posts = blogPosts.length
    const published_posts = blogPosts.filter(p => p.status === 'published').length
    const draft_posts = blogPosts.filter(p => p.status === 'draft').length
    const total_views = blogPosts.reduce((sum, post) => sum + post.view_count, 0)
    const total_likes = blogPosts.reduce((sum, post) => sum + post.like_count, 0)
    const total_comments = blogPosts.reduce((sum, post) => sum + post.comment_count, 0)

    return {
      total_posts,
      published_posts,
      draft_posts,
      total_categories: blogCategories.length,
      total_tags: blogTags.length,
      total_views,
      total_likes,
      total_comments
    }
  }

  // 评论相关方法
  // 根据文章slug获取评论
  static async getCommentsByPostSlug(slug: string): Promise<BlogComment[]> {
    const post = blogPosts.find(p => p.slug === slug)
    if (!post) return []

    return blogComments
      .filter(c => c.post_id === post.id && c.status === 'approved')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  // 创建评论
  static async createComment(data: {
    post_id: string
    author_name: string
    author_email: string
    author_website?: string
    content: string
    parent_id?: string
  }): Promise<BlogComment> {
    const newComment: BlogComment = {
      id: `comment-${Date.now()}`,
      post_id: data.post_id,
      author_name: data.author_name,
      author_email: data.author_email,
      author_website: data.author_website,
      content: data.content,
      status: 'pending', // 新评论默认待审核
      parent_id: data.parent_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    blogComments.push(newComment)

    // 更新文章评论数
    const post = blogPosts.find(p => p.id === data.post_id)
    if (post) {
      post.comment_count += 1
    }

    return newComment
  }

  // 获取所有评论（管理员用）
  static async getAllComments(): Promise<BlogComment[]> {
    return blogComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  // 根据ID获取评论
  static async getCommentById(id: string): Promise<BlogComment | null> {
    return blogComments.find(c => c.id === id) || null
  }

  // 更新评论状态
  static async updateCommentStatus(id: string, status: 'pending' | 'approved' | 'spam'): Promise<BlogComment | null> {
    const comment = blogComments.find(c => c.id === id)
    if (!comment) return null

    comment.status = status
    comment.updated_at = new Date().toISOString()
    return comment
  }

  // 审核评论
  static async approveComment(id: string): Promise<boolean> {
    const comment = blogComments.find(c => c.id === id)
    if (!comment) return false

    comment.status = 'approved'
    comment.updated_at = new Date().toISOString()
    return true
  }

  // 删除评论
  static async deleteComment(id: string): Promise<boolean> {
    const index = blogComments.findIndex(c => c.id === id)
    if (index === -1) return false

    const comment = blogComments[index]

    // 更新文章评论数
    const post = blogPosts.find(p => p.id === comment.post_id)
    if (post && post.comment_count > 0) {
      post.comment_count -= 1
    }

    blogComments.splice(index, 1)
    return true
  }
}
