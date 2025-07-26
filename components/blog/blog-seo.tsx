import Head from 'next/head'
import { BlogPostWithDetails } from '@/lib/types/blog'

interface BlogSEOProps {
  post?: BlogPostWithDetails
  isListPage?: boolean
  lang?: string
}

export function BlogSEO({ post, isListPage = false, lang = 'en' }: BlogSEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://owowlove.com'
  const siteName = 'OWOWLOVE Blog'
  
  if (isListPage) {
    // Blog list page SEO
    const title = 'Blog - OWOWLOVE | Cosplay Fashion & Style'
    const description = 'Discover the latest in cosplay fashion, styling tips, and character inspiration. Your ultimate guide to cosplay fashion and accessories.'
    const url = `${siteUrl}/${lang}/blog`
    
    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="cosplay, fashion, blog, style, costume, anime, manga, character" />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:image" content={`${siteUrl}/images/blog-og-image.jpg`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${siteUrl}/images/blog-og-image.jpg`} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={url} />
        
        {/* Language alternates */}
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en/blog`} />
        <link rel="alternate" hrefLang="zh" href={`${siteUrl}/zh/blog`} />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": siteName,
              "description": description,
              "url": url,
              "publisher": {
                "@type": "Organization",
                "name": "OWOWLOVE",
                "url": siteUrl
              }
            })
          }}
        />
      </Head>
    )
  }
  
  if (!post) return null
  
  // Individual blog post SEO
  const title = post.seo_title || `${post.title} - OWOWLOVE Blog`
  const description = post.seo_description || post.excerpt
  const keywords = post.seo_keywords?.join(', ') || `cosplay, ${post.category?.name || 'fashion'}, ${post.tag_details?.map(t => t.name).join(', ') || ''}`
  const url = `${siteUrl}/${lang}/blog/${post.slug}`
  const imageUrl = post.featured_image || `${siteUrl}/images/blog-default-og.jpg`
  
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={post.author} />
      
      {/* Article specific meta */}
      <meta name="article:published_time" content={post.published_at || post.created_at} />
      <meta name="article:modified_time" content={post.updated_at} />
      <meta name="article:author" content={post.author} />
      {post.category && <meta name="article:section" content={post.category.name} />}
      {post.tag_details?.map((tag) => (
        <meta key={tag.id} name="article:tag" content={tag.name} />
      ))}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Language alternates */}
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/en/blog/${post.slug}`} />
      <link rel="alternate" hrefLang="zh" href={`${siteUrl}/zh/blog/${post.slug}`} />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": description,
            "image": imageUrl,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "OWOWLOVE",
              "url": siteUrl,
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/images/logo.png`
              }
            },
            "datePublished": post.published_at || post.created_at,
            "dateModified": post.updated_at,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            },
            "articleSection": post.category?.name,
            "keywords": keywords,
            "wordCount": post.content.split(/\s+/).length,
            "url": url
          })
        }}
      />
      
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${siteUrl}/${lang}/blog`
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": url
              }
            ]
          })
        }}
      />
    </Head>
  )
}
