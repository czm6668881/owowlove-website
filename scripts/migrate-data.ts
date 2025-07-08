#!/usr/bin/env tsx
/**
 * OWOWLOVE.COM Data Migration Script
 * Migrates existing JSON data to Supabase database
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { supabaseAdmin } from '../lib/supabase'
import bcrypt from 'bcryptjs'

const DATA_DIR = join(process.cwd(), 'data')

interface JSONProduct {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  categoryId: string
  variants: any[]
  isListed: boolean
}

interface JSONCategory {
  id: string
  name: string
  description: string
  image: string
}

interface JSONUser {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  address?: string
  role?: string
}

async function loadJSONData<T>(filename: string): Promise<T[]> {
  const filePath = join(DATA_DIR, filename)
  if (!existsSync(filePath)) {
    console.log(`File ${filename} not found, skipping...`)
    return []
  }
  
  try {
    const data = readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
    return []
  }
}

async function migrateCategories() {
  console.log('🏷️ Migrating categories...')
  
  const categories = await loadJSONData<JSONCategory>('categories.json')
  
  if (categories.length === 0) {
    console.log('No categories to migrate')
    return
  }

  for (const category of categories) {
    const { error } = await supabaseAdmin
      .from('categories')
      .upsert({
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
        is_active: true
      })
    
    if (error) {
      console.error(`Error migrating category ${category.name}:`, error)
    } else {
      console.log(`✅ Migrated category: ${category.name}`)
    }
  }
}

async function migrateProducts() {
  console.log('🛍️ Migrating products...')
  
  const products = await loadJSONData<JSONProduct>('products.json')
  
  if (products.length === 0) {
    console.log('No products to migrate')
    return
  }

  for (const product of products) {
    const { error } = await supabaseAdmin
      .from('products')
      .upsert({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        category_id: product.categoryId,
        variants: product.variants,
        is_active: product.isListed
      })
    
    if (error) {
      console.error(`Error migrating product ${product.name}:`, error)
    } else {
      console.log(`✅ Migrated product: ${product.name}`)
    }
  }
}

async function migrateUsers() {
  console.log('👥 Migrating users...')
  
  const users = await loadJSONData<JSONUser>('users.json')
  
  if (users.length === 0) {
    console.log('No users to migrate')
    return
  }

  for (const user of users) {
    // Hash password if it's not already hashed
    let passwordHash = user.password
    if (!user.password.startsWith('$2')) {
      passwordHash = await bcrypt.hash(user.password, 12)
    }

    const { error } = await supabaseAdmin
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        password_hash: passwordHash,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phone || '',
        address: user.address || '',
        role: user.role || 'user',
        is_active: true
      })
    
    if (error) {
      console.error(`Error migrating user ${user.email}:`, error)
    } else {
      console.log(`✅ Migrated user: ${user.email}`)
    }
  }
}

async function createAdminUser() {
  console.log('👑 Creating admin user...')
  
  const adminEmail = 'owowlove@163.com'
  const adminPassword = 'owowlove2025'
  
  // Check if admin already exists
  const { data: existingAdmin } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', adminEmail)
    .single()
  
  if (existingAdmin) {
    console.log('Admin user already exists')
    return
  }
  
  const passwordHash = await bcrypt.hash(adminPassword, 12)
  
  const { error } = await supabaseAdmin
    .from('users')
    .insert({
      email: adminEmail,
      password_hash: passwordHash,
      first_name: 'Admin',
      last_name: 'OWOWLOVE',
      role: 'admin',
      is_active: true
    })
  
  if (error) {
    console.error('Error creating admin user:', error)
  } else {
    console.log(`✅ Created admin user: ${adminEmail}`)
  }
}

async function main() {
  console.log('🚀 Starting data migration to Supabase...')
  
  try {
    await migrateCategories()
    await migrateProducts()
    await migrateUsers()
    await createAdminUser()
    
    console.log('✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration if called directly
if (require.main === module) {
  main()
}

export { main as migrateData }
