export interface ProductVariant {
  id: string
  size: string
  color: string
  price: number
  originalPrice?: number
  stock: number
  sku: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order: number
}

export interface Product {
  id: string
  nameKey: string
  nameEn: string
  descriptionEn: string
  category: string
  tags: string[]
  variants: ProductVariant[]
  images: ProductImage[]
  rating: number
  reviews: number
  isActive: boolean
  isNew: boolean
  isSale: boolean
  createdAt: string
  updatedAt: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

export interface ProductFormData {
  nameEn: string
  descriptionEn: string
  category: string
  tags: string[]
  isActive: boolean
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

export interface CreateProductRequest extends ProductFormData {
  variants: Omit<ProductVariant, 'id'>[]
  images: Omit<ProductImage, 'id'>[]
}

export interface UpdateProductRequest extends Partial<ProductFormData> {
  id: string
  variants?: ProductVariant[]
  images?: ProductImage[]
}
