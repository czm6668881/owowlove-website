import { Product } from '@/lib/types/product'
import { loadProducts, saveProducts } from './storage'

// 产品缓存
let productsCache: Product[] | null = null

// 获取产品数据（带缓存）
async function getProducts(): Promise<Product[]> {
  if (!productsCache) {
    productsCache = await loadProducts()
  }
  return productsCache
}

// 更新缓存并保存
async function updateProducts(newProducts: Product[]): Promise<void> {
  productsCache = newProducts
  await saveProducts(newProducts)
}

// Product management functions
export class ProductService {
  // 清除缓存方法
  static clearCache(): void {
    productsCache = null
  }

  static async getAllProducts(): Promise<Product[]> {
    const products = await getProducts()
    return products.filter(p => p.isActive)
  }

  static async getAllProductsAdmin(): Promise<Product[]> {
    return await getProducts()
  }

  static async getProductById(id: string): Promise<Product | null> {
    const products = await getProducts()
    return products.find(p => p.id === id) || null
  }

  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const products = await getProducts()
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updatedProducts = [...products, newProduct]
    await updateProducts(updatedProducts)
    return newProduct
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const products = await getProducts()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return null

    const updatedProduct = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    const updatedProducts = [...products]
    updatedProducts[index] = updatedProduct
    await updateProducts(updatedProducts)
    return updatedProduct
  }

  static async deleteProduct(id: string): Promise<boolean> {
    const products = await getProducts()
    const index = products.findIndex(p => p.id === id)

    if (index === -1) {
      return false
    }

    const updatedProducts = products.filter(p => p.id !== id)
    await updateProducts(updatedProducts)
    return true
  }

  static async toggleProductStatus(id: string): Promise<Product | null> {
    const products = await getProducts()
    const productIndex = products.findIndex(p => p.id === id)
    if (productIndex === -1) return null

    const updatedProducts = [...products]
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      isActive: !updatedProducts[productIndex].isActive,
      updatedAt: new Date().toISOString()
    }

    await updateProducts(updatedProducts)
    return updatedProducts[productIndex]
  }
}
