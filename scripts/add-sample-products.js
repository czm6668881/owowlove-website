const { createClient } = require('@supabase/supabase-js')

// Supabase configuration
const supabaseUrl = 'https://zzexacrffmxmqrqamcxo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZXhhY3JmZm14bXFycWFtY3hvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NzAxODEsImV4cCI6MjA2NzU0NjE4MX0.OjvVxog9bRc6zixbJTFp0Jgg-xzpv1ZuDKEba2-dG34'

const supabase = createClient(supabaseUrl, supabaseKey)

// Sample categories (without ID - let Supabase generate UUIDs)
const categories = [
  {
    name: 'Animal Costumes',
    description: 'Sexy animal-themed cosplay costumes',
    image: '/placeholder.svg',
    is_active: true
  },
  {
    name: 'Bunny Outfits',
    description: 'Cute and sexy bunny costumes',
    image: '/placeholder.svg',
    is_active: true
  },
  {
    name: 'Fantasy Costumes',
    description: 'Fantasy and roleplay costumes',
    image: '/placeholder.svg',
    is_active: true
  }
]

// We'll add products after getting category IDs
let products = []


async function addSampleData() {
  try {
    console.log('🚀 Starting to add sample data...')

    // Add categories first
    console.log('📂 Adding categories...')
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .insert(categories)
      .select()

    if (categoryError) {
      console.error('❌ Error adding categories:', categoryError)
      return
    }
    console.log('✅ Categories added:', categoryData?.length || 0)

    // Now create products with the actual category IDs
    const animalCatId = categoryData.find(c => c.name === 'Animal Costumes')?.id
    const bunnyCatId = categoryData.find(c => c.name === 'Bunny Outfits')?.id
    const fantasyCatId = categoryData.find(c => c.name === 'Fantasy Costumes')?.id

    products = [
      {
        name: 'Sexy Black Cat Costume',
        description: 'Premium black cat cosplay costume with ears and tail. Perfect for parties and roleplay.',
        price: 49.99,
        images: ['/placeholder.svg'],
        category_id: animalCatId,
        variants: [
          { id: 'var-1', color: 'Black', size: 'S', price: 49.99, stock: 10 },
          { id: 'var-2', color: 'Black', size: 'M', price: 49.99, stock: 15 },
          { id: 'var-3', color: 'Black', size: 'L', price: 49.99, stock: 8 }
        ],
        is_active: true
      },
      {
        name: 'Pink Bunny Girl Costume',
        description: 'Adorable pink bunny costume with fluffy tail and ears. High-quality materials.',
        price: 59.99,
        images: ['/placeholder.svg'],
        category_id: bunnyCatId,
        variants: [
          { id: 'var-4', color: 'Pink', size: 'S', price: 59.99, stock: 12 },
          { id: 'var-5', color: 'Pink', size: 'M', price: 59.99, stock: 18 },
          { id: 'var-6', color: 'Pink', size: 'L', price: 59.99, stock: 6 }
        ],
        is_active: true
      },
      {
        name: 'White Angel Wings Costume',
        description: 'Elegant white angel costume with beautiful wings. Perfect for fantasy roleplay.',
        price: 69.99,
        images: ['/placeholder.svg'],
        category_id: fantasyCatId,
        variants: [
          { id: 'var-7', color: 'White', size: 'One Size', price: 69.99, stock: 20 }
        ],
        is_active: true
      },
      {
        name: 'Red Fox Tail Costume',
        description: 'Sexy red fox costume with realistic tail and ears. Premium quality materials.',
        price: 54.99,
        images: ['/placeholder.svg'],
        category_id: animalCatId,
        variants: [
          { id: 'var-8', color: 'Red', size: 'S', price: 54.99, stock: 8 },
          { id: 'var-9', color: 'Red', size: 'M', price: 54.99, stock: 12 },
          { id: 'var-10', color: 'Red', size: 'L', price: 54.99, stock: 5 }
        ],
        is_active: true
      },
      {
        name: 'Black Bunny Playsuit',
        description: 'Sophisticated black bunny costume with satin finish. Includes ears and bow tie.',
        price: 64.99,
        images: ['/placeholder.svg'],
        category_id: bunnyCatId,
        variants: [
          { id: 'var-11', color: 'Black', size: 'S', price: 64.99, stock: 15 },
          { id: 'var-12', color: 'Black', size: 'M', price: 64.99, stock: 22 },
          { id: 'var-13', color: 'Black', size: 'L', price: 64.99, stock: 10 }
        ],
        is_active: true
      }
    ]

    // Add products
    console.log('📦 Adding products...')
    const { data: productData, error: productError } = await supabase
      .from('products')
      .insert(products)
      .select()

    if (productError) {
      console.error('❌ Error adding products:', productError)
      return
    }
    console.log('✅ Products added:', productData?.length || 0)

    console.log('🎉 Sample data added successfully!')
    console.log('🌐 Visit https://owowlove.com to see the products!')

  } catch (error) {
    console.error('💥 Error:', error)
  }
}

// Run the script
addSampleData()
