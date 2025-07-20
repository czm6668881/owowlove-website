import { promises as fs } from 'fs'
import path from 'path'

export interface Category {
  id: string
  name: string
  nameEn: string
  description?: string
  productCount: number
  isActive: boolean
  createdAt: string
}

const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json')

// Default categories data
const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'sexy cosplay',
    nameEn: 'Sexy Cosplay',
    description: 'Premium sexy cosplay costumes for women and girls featuring animal costumes, bunny outfits, and fantasy designs. High-quality costume collection for confident women seeking playful and seductive cosplay experiences.',
    productCount: 0,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'bunny sexy cosplay',
    nameEn: 'Bunny Sexy Cosplay',
    description: 'Adorable and sexy bunny cosplay costumes for women and girls. Premium collection of bunny ears, tails, and complete bunny outfits perfect for costume parties, role-play, and fantasy experiences.',
    productCount: 0,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'animal sexy cosplay',
    nameEn: 'animal Sexy Cosplay',
    description: 'Exciting animal-themed sexy cosplay costumes for women and girls. Featuring cat, fox, wolf, and other animal designs with premium quality materials and attention to detail.',
    productCount: 0,
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z'
  }
]

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read categories from file
export async function getCategories(): Promise<Category[]> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist, create it with default data
    await saveCategories(defaultCategories)
    return defaultCategories
  }
}

// Save categories to file
export async function saveCategories(categories: Category[]): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2))
}

// Category management functions
export class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    return await getCategories()
  }

  static async getCategoryById(id: string): Promise<Category | null> {
    const categories = await getCategories()
    return categories.find(c => c.id === id) || null
  }

  static async createCategory(categoryData: Omit<Category, 'id' | 'createdAt'>): Promise<Category> {
    const categories = await getCategories()
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    categories.push(newCategory)
    await saveCategories(categories)
    return newCategory
  }

  static async updateCategory(id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category | null> {
    const categories = await getCategories()
    const index = categories.findIndex(c => c.id === id)
    
    if (index === -1) {
      return null
    }

    categories[index] = { ...categories[index], ...categoryData }
    await saveCategories(categories)
    return categories[index]
  }

  static async deleteCategory(id: string): Promise<boolean> {
    const categories = await getCategories()
    const index = categories.findIndex(c => c.id === id)
    
    if (index === -1) {
      return false
    }

    categories.splice(index, 1)
    await saveCategories(categories)
    return true
  }
}
