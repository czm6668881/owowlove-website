'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Category } from '@/lib/data/categories'

interface CategoryPageProps {
  params: Promise<{ lang: string; slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const resolvedParams = useParams()
  const slug = resolvedParams?.slug as string

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const categories = await response.json()
          const foundCategory = categories.find((cat: Category) => cat.name === slug)
          setCategory(foundCategory || null)
        }
      } catch (error) {
        console.error('Failed to fetch category:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategory()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600">The category you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Category Header */}
      <section className="bg-gradient-to-r from-pink-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{category.nameEn}</h1>
          <p className="text-lg text-gray-600 max-w-3xl">{category.description}</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              Products for this category will be available soon. Stay tuned!
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
