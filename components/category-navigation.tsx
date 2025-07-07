'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Category } from '@/lib/data/categories'

export function CategoryNavigation() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.filter((cat: Category) => cat.isActive))
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-8 md:py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/en/category/${category.name}`}
              className="group block"
            >
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 hover:shadow-lg transition-all duration-300 border border-pink-100 hover:border-pink-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">
                  {category.nameEn}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {category.productCount} products
                  </span>
                  <span className="text-pink-600 group-hover:text-pink-700 font-medium text-sm">
                    Shop Now →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
