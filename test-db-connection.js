#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('Testing database connection...')
console.log('Supabase URL:', supabaseUrl)
console.log('Service Key exists:', !!supabaseServiceKey)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  try {
    console.log('Attempting to connect to database...')
    
    const { data, error } = await supabase
      .from('products')
      .select('id, name, images, is_active')
      .limit(5)

    if (error) {
      console.error('❌ Database error:', error)
      return
    }

    console.log('✅ Database connection successful!')
    console.log(`Found ${data.length} products:`)
    
    data.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   ID: ${product.id}`)
      console.log(`   Active: ${product.is_active}`)
      console.log(`   Images: ${JSON.stringify(product.images)}`)
    })

  } catch (error) {
    console.error('❌ Connection failed:', error.message)
  }
}

testConnection()
