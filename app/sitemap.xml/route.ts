import { NextResponse } from 'next/server'
import { BlogService } from '@/lib/data/blog'

export async function GET() {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://owowlove.com'
    
    // 获取所有已发布的博客文章
    const posts = await BlogService.getPosts({ status: 'published', limit: 1000 })
    const categories = await BlogService.getCategories()
    
    // 生成sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${siteUrl}/zh"/>
  </url>
  
  <!-- Blog main pages -->
  <url>
    <loc>${siteUrl}/en/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/blog"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${siteUrl}/zh/blog"/>
  </url>
  <url>
    <loc>${siteUrl}/zh/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/blog"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${siteUrl}/zh/blog"/>
  </url>
  
  <!-- Blog posts -->
  ${posts.map(post => `
  <url>
    <loc>${siteUrl}/en/blog/${post.slug}</loc>
    <lastmod>${post.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/blog/${post.slug}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${siteUrl}/zh/blog/${post.slug}"/>
  </url>
  <url>
    <loc>${siteUrl}/zh/blog/${post.slug}</loc>
    <lastmod>${post.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/blog/${post.slug}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${siteUrl}/zh/blog/${post.slug}"/>
  </url>`).join('')}
  
  <!-- Blog categories -->
  ${categories.map(category => `
  <url>
    <loc>${siteUrl}/en/blog?category=${category.id}</loc>
    <lastmod>${category.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/blog?category=${category.id}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${siteUrl}/zh/blog?category=${category.id}"/>
  </url>
  <url>
    <loc>${siteUrl}/zh/blog?category=${category.id}</loc>
    <lastmod>${category.updated_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/blog?category=${category.id}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${siteUrl}/zh/blog?category=${category.id}"/>
  </url>`).join('')}
  
  <!-- Other important pages -->
  <url>
    <loc>${siteUrl}/en/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/contact"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${siteUrl}/zh/contact"/>
  </url>
  <url>
    <loc>${siteUrl}/zh/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en/contact"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${siteUrl}/zh/contact"/>
  </url>
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}
