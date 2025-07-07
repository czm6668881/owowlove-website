import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { Product } from '@/lib/types/product'

const DATA_DIR = join(process.cwd(), 'data')
const PRODUCTS_FILE = join(DATA_DIR, 'products.json')

// 确保数据目录存在
async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

// Default product data
const defaultProducts: Product[] = [
  {
    id: '1',
    nameKey: 'productNames.crotchlessLacePanties',
    nameEn: 'Sexy Crotchless Lace Panties',
    descriptionEn: 'Elegant lace crotchless panties with delicate details',
    category: 'panties',
    tags: ['lace', 'crotchless', 'sexy'],
    variants: [
      {
        id: '1-1',
        size: 'S',
        color: 'Black',
        price: 29.99,
        originalPrice: 45.99,
        stock: 10,
        sku: 'CLP-S-BLK'
      },
      {
        id: '1-2',
        size: 'M',
        color: 'Black',
        price: 29.99,
        originalPrice: 45.99,
        stock: 15,
        sku: 'CLP-M-BLK'
      },
      {
        id: '1-3',
        size: 'S',
        color: 'Red',
        price: 32.99,
        originalPrice: 45.99,
        stock: 8,
        sku: 'CLP-S-RED'
      }
    ],
    images: [
      {
        id: '1-img-1',
        url: '/placeholder.svg',
        alt: 'Sexy Crotchless Lace Panties - Black',
        isPrimary: true,
        order: 1
      }
    ],
    rating: 4.8,
    reviews: 256,
    isActive: true,
    isNew: false,
    isSale: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    seoTitle: 'Sexy Crotchless Lace Panties | OWOWLOVE.COM',
    seoDescription: 'Premium crotchless lace panties for women. Elegant design with delicate details.',
    seoKeywords: ['crotchless panties', 'lace panties', 'sexy underwear']
  },
  {
    id: '2',
    nameKey: 'productNames.silkBodysuit',
    nameEn: 'Silk Bodysuit',
    descriptionEn: 'Luxurious silk bodysuit with smooth finish',
    category: 'bodysuit',
    tags: ['silk', 'luxury', 'bodysuit'],
    variants: [
      {
        id: '2-1',
        size: 'S',
        color: 'Black',
        price: 89.99,
        stock: 5,
        sku: 'SB-S-BLK'
      },
      {
        id: '2-2',
        size: 'M',
        color: 'Nude',
        price: 89.99,
        stock: 7,
        sku: 'SB-M-NUDE'
      }
    ],
    images: [
      {
        id: '2-img-1',
        url: '/placeholder.svg',
        alt: 'Luxury Silk Bodysuit - Black',
        isPrimary: true,
        order: 1
      }
    ],
    rating: 4.8,
    reviews: 95,
    isActive: true,
    isNew: true,
    isSale: false,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
]

// Read product data
export async function loadProducts(): Promise<Product[]> {
  try {
    await ensureDataDir()
    
    if (!existsSync(PRODUCTS_FILE)) {
      // 如果文件不存在，创建默认数据
      await saveProducts(defaultProducts)
      return defaultProducts
    }
    
    const data = await readFile(PRODUCTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading products:', error)
    return defaultProducts
  }
}

// 保存产品数据
export async function saveProducts(products: Product[]): Promise<void> {
  try {
    await ensureDataDir()
    await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error saving products:', error)
    throw error
  }
}
