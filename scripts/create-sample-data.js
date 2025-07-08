#!/usr/bin/env node
/**
 * OWOWLOVE.COM Sample Data Creator
 * Creates sample data for testing Supabase migration
 */

const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Sample categories
const sampleCategories = [
  {
    id: 'cat-1',
    name: 'Bunny Cosplay',
    description: 'Cute bunny-themed cosplay costumes',
    image: '/placeholder-category.jpg'
  },
  {
    id: 'cat-2', 
    name: 'Animal Cosplay',
    description: 'Various animal-themed costumes',
    image: '/placeholder-category.jpg'
  },
  {
    id: 'cat-3',
    name: 'Sexy Lingerie',
    description: 'Premium lingerie collection',
    image: '/placeholder-category.jpg'
  }
]

// Sample products
const sampleProducts = [
  {
    id: 'prod-1',
    name: 'Sexy Bunny Costume',
    description: 'Premium bunny cosplay costume with ears and tail',
    price: 49.99,
    images: ['/placeholder-product.jpg'],
    categoryId: 'cat-1',
    variants: [
      {
        id: 'var-1',
        size: 'S',
        color: 'White',
        price: 49.99,
        stock: 10
      },
      {
        id: 'var-2',
        size: 'M', 
        color: 'White',
        price: 49.99,
        stock: 15
      },
      {
        id: 'var-3',
        size: 'L',
        color: 'Pink',
        price: 54.99,
        stock: 8
      }
    ],
    isListed: true
  },
  {
    id: 'prod-2',
    name: 'Cat Girl Outfit',
    description: 'Adorable cat-themed cosplay set',
    price: 39.99,
    images: ['/placeholder-product.jpg'],
    categoryId: 'cat-2',
    variants: [
      {
        id: 'var-4',
        size: 'One Size',
        color: 'Black',
        price: 39.99,
        stock: 20
      }
    ],
    isListed: true
  },
  {
    id: 'prod-3',
    name: 'Lace Lingerie Set',
    description: 'Elegant lace lingerie with premium materials',
    price: 69.99,
    images: ['/placeholder-product.jpg'],
    categoryId: 'cat-3',
    variants: [
      {
        id: 'var-5',
        size: 'S',
        color: 'Red',
        price: 69.99,
        stock: 5
      },
      {
        id: 'var-6',
        size: 'M',
        color: 'Black',
        price: 69.99,
        stock: 12
      }
    ],
    isListed: true
  }
]

// Sample users
const sampleUsers = [
  {
    id: 'user-1',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    phone: '+1234567890',
    address: '123 Test Street, Test City',
    role: 'user'
  }
]

// Write sample data files
console.log('🚀 Creating sample data files...')

try {
  // Categories
  fs.writeFileSync(
    path.join(DATA_DIR, 'categories.json'),
    JSON.stringify(sampleCategories, null, 2)
  )
  console.log('✅ Created categories.json with', sampleCategories.length, 'categories')

  // Products
  fs.writeFileSync(
    path.join(DATA_DIR, 'products.json'),
    JSON.stringify(sampleProducts, null, 2)
  )
  console.log('✅ Created products.json with', sampleProducts.length, 'products')

  // Users
  fs.writeFileSync(
    path.join(DATA_DIR, 'users.json'),
    JSON.stringify(sampleUsers, null, 2)
  )
  console.log('✅ Created users.json with', sampleUsers.length, 'users')

  console.log('')
  console.log('🎉 Sample data created successfully!')
  console.log('📁 Files created in:', DATA_DIR)
  console.log('')
  console.log('📋 Next steps:')
  console.log('1. Set up your Supabase project')
  console.log('2. Run: npm run migrate:data')
  console.log('3. Test the migration')

} catch (error) {
  console.error('❌ Error creating sample data:', error)
  process.exit(1)
}
