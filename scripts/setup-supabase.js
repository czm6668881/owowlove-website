#!/usr/bin/env node
/**
 * OWOWLOVE.COM Supabase Setup Script
 * Quick setup script for Supabase integration
 */

const readline = require('readline')
const fs = require('fs')
const path = require('path')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function main() {
  console.log('🚀 OWOWLOVE.COM Supabase Setup')
  console.log('=====================================')
  console.log('')
  
  console.log('Please provide your Supabase project details:')
  console.log('(You can find these in your Supabase project settings)')
  console.log('')
  
  // Get Supabase credentials
  const supabaseUrl = await question('Supabase Project URL: ')
  const anonKey = await question('Supabase Anon Key: ')
  const serviceKey = await question('Supabase Service Role Key: ')
  
  console.log('')
  console.log('📝 Creating environment file...')
  
  // Create .env.local file
  const envContent = `# OWOWLOVE.COM Supabase Configuration
# Generated on ${new Date().toISOString()}

# JWT Secret for authentication
JWT_SECRET=owowlove-secret-2025

# Admin Authentication
ADMIN_PASSWORD=owowlove2025

# Next.js Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}

# SEO Settings
NEXT_PUBLIC_SITE_NAME=OWOWLOVE
NEXT_PUBLIC_SITE_DESCRIPTION=Premium Sexy Cosplay Costumes for Women and Girls
NEXT_PUBLIC_SITE_KEYWORDS=sexy cosplay,women,girl,animal,costume,bunny

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=owowlove@163.com

# Admin Configuration
ADMIN_EMAIL=owowlove@163.com
`

  fs.writeFileSync('.env.local', envContent)
  console.log('✅ Environment file created: .env.local')
  
  console.log('')
  console.log('🗄️ Next steps:')
  console.log('1. Run the database migration scripts in Supabase SQL Editor')
  console.log('2. Execute: npm run dev')
  console.log('3. Test the application at http://localhost:3000')
  console.log('')
  console.log('📋 Database setup:')
  console.log('- Copy content from supabase/migrations/001_initial_schema.sql')
  console.log('- Paste and run in Supabase SQL Editor')
  console.log('- Copy content from supabase/migrations/002_security_policies.sql')
  console.log('- Paste and run in Supabase SQL Editor')
  console.log('')
  console.log('🎉 Setup complete! Your OWOWLOVE.COM is ready for Supabase!')
  
  rl.close()
}

main().catch(console.error)
