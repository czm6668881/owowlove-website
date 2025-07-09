// Test Supabase connection
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

// Read environment variables from .env.local
let supabaseUrl, supabaseAnonKey, supabaseServiceKey

try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const envLines = envContent.split('\n')

  for (const line of envLines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1]
    } else if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1]
    } else if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      supabaseServiceKey = line.split('=')[1]
    }
  }
} catch (error) {
  console.error('❌ Could not read .env.local file:', error.message)
  process.exit(1)
}

console.log('🔍 Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? 'Present' : 'Missing')
console.log('Service Key:', supabaseServiceKey ? 'Present' : 'Missing')

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  try {
    console.log('\n📡 Testing basic connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('categories').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Basic connection successful!')
    
    // Test admin connection
    console.log('\n🔑 Testing admin connection...')
    const { data: adminData, error: adminError } = await supabaseAdmin.from('users').select('count', { count: 'exact', head: true })
    
    if (adminError) {
      console.error('❌ Admin connection failed:', adminError.message)
      return false
    }
    
    console.log('✅ Admin connection successful!')
    
    // Test table existence
    console.log('\n📋 Checking table structure...')
    const tables = ['categories', 'products', 'users', 'orders', 'favorites', 'contact_messages']
    
    for (const table of tables) {
      try {
        const { error } = await supabaseAdmin.from(table).select('*').limit(1)
        if (error) {
          console.log(`❌ Table '${table}' not accessible:`, error.message)
        } else {
          console.log(`✅ Table '${table}' exists and accessible`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}' error:`, err.message)
      }
    }
    
    return true
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase is properly configured!')
  } else {
    console.log('\n💡 You may need to run the database migrations in Supabase SQL Editor')
    console.log('   1. Go to your Supabase project dashboard')
    console.log('   2. Click "SQL Editor" in the left sidebar')
    console.log('   3. Run the contents of supabase/migrations/001_initial_schema.sql')
    console.log('   4. Run the contents of supabase/migrations/002_security_policies.sql')
  }
  process.exit(success ? 0 : 1)
})
