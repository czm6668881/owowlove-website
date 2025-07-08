#!/usr/bin/env node
/**
 * OWOWLOVE.COM Supabase Setup Script
 * Quick setup wizard for Supabase integration
 */

const readline = require('readline')
const fs = require('fs')
const path = require('path')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
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

NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceKey}
`

  fs.writeFileSync('.env.local', envContent)
  console.log('✅ Environment file created: .env.local')
  
  // Update .gitignore to include .env.local
  const gitignorePath = '.gitignore'
  let gitignoreContent = ''
  
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8')
  }
  
  if (!gitignoreContent.includes('.env.local')) {
    gitignoreContent += '\n# Environment variables\n.env.local\n'
    fs.writeFileSync(gitignorePath, gitignoreContent)
    console.log('✅ Updated .gitignore')
  }
  
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
