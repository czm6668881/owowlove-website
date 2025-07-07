'use client'

import { useParams } from 'next/navigation'
import { NewProductForm } from '@/components/admin/new-product-form'

export default function NewProductPage() {
  const params = useParams()
  const lang = params?.lang as string || 'en'

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <NewProductForm
        lang={lang}
        isEditing={false}
      />
    </div>
  )
}
