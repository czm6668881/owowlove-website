import { NextResponse } from 'next/server'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://owowlove.com'
  
  const robotsTxt = `User-agent: *
Allow: /

# Allow all crawlers to access blog content
Allow: /en/blog
Allow: /zh/blog
Allow: /en/blog/*
Allow: /zh/blog/*

# Disallow admin areas
Disallow: /admin
Disallow: /api
Disallow: /_next
Disallow: /debug*
Disallow: /test*

# Allow specific API endpoints for SEO
Allow: /api/blog/posts
Allow: /api/blog/categories
Allow: /api/blog/tags

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}
