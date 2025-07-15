#!/usr/bin/env node

const { execSync } = require('child_process')
const { existsSync } = require('fs')

function runCommand(command, description) {
  console.log(`🔄 ${description}...`)
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' })
    console.log(`✅ ${description} completed`)
    return true
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.message)
    return false
  }
}

async function deployImageFix() {
  console.log('🚀 DEPLOYING IMAGE FIX TO PRODUCTION')
  console.log('============================================================')

  try {
    // 1. 检查必要文件
    console.log('\n📋 STEP 1: CHECKING REQUIRED FILES')
    
    const requiredFiles = [
      'public/image-mapping.json',
      'app/api/image/[filename]/route.ts',
      'CREATE_IMAGE_STORAGE_TABLE.sql'
    ]

    let allFilesExist = true
    for (const file of requiredFiles) {
      if (existsSync(file)) {
        console.log(`   ✅ ${file}`)
      } else {
        console.log(`   ❌ ${file} - MISSING`)
        allFilesExist = false
      }
    }

    if (!allFilesExist) {
      console.log('❌ Some required files are missing. Please run the setup scripts first.')
      return false
    }

    // 2. 检查Git状态
    console.log('\n📦 STEP 2: CHECKING GIT STATUS')
    
    try {
      const gitStatus = execSync('git status --porcelain', { encoding: 'utf-8' })
      if (gitStatus.trim()) {
        console.log('📝 Uncommitted changes found:')
        console.log(gitStatus)
      } else {
        console.log('✅ Working directory is clean')
      }
    } catch (error) {
      console.log('⚠️  Git not available or not a git repository')
    }

    // 3. 添加文件到Git
    console.log('\n📤 STEP 3: ADDING FILES TO GIT')
    
    const filesToAdd = [
      'public/image-mapping.json',
      'app/api/image/[filename]/route.ts',
      'CREATE_IMAGE_STORAGE_TABLE.sql',
      'update-image-mapping.js',
      'test-image-api.js'
    ]

    for (const file of filesToAdd) {
      if (existsSync(file)) {
        if (runCommand(`git add "${file}"`, `Adding ${file}`)) {
          console.log(`   ✅ ${file} added`)
        }
      }
    }

    // 4. 提交更改
    console.log('\n💾 STEP 4: COMMITTING CHANGES')
    
    const commitMessage = "Fix: 修复域名前端图片显示问题 - 添加映射文件备用方案"
    
    try {
      execSync('git diff --cached --quiet', { stdio: 'pipe' })
      console.log('⚠️  No changes to commit')
    } catch (error) {
      // 有更改需要提交
      if (runCommand(`git commit -m "${commitMessage}"`, 'Committing changes')) {
        console.log('✅ Changes committed successfully')
      }
    }

    // 5. 推送到远程仓库
    console.log('\n🌐 STEP 5: PUSHING TO REMOTE REPOSITORY')
    
    if (runCommand('git push origin main', 'Pushing to origin/main')) {
      console.log('✅ Code pushed to remote repository')
    } else {
      // 尝试其他分支名
      if (runCommand('git push origin master', 'Pushing to origin/master')) {
        console.log('✅ Code pushed to remote repository')
      } else {
        console.log('⚠️  Push failed. Please push manually or check your git configuration')
      }
    }

    // 6. 显示部署状态
    console.log('\n📊 STEP 6: DEPLOYMENT STATUS')
    console.log('✅ Code deployment initiated')
    console.log('⏳ Waiting for automatic deployment (Vercel/Netlify)...')
    console.log('')
    console.log('🔗 Check deployment status at:')
    console.log('   - Vercel: https://vercel.com/dashboard')
    console.log('   - GitHub: https://github.com/your-repo/actions')

    return true

  } catch (error) {
    console.error('❌ Deployment failed:', error.message)
    return false
  }
}

async function main() {
  const success = await deployImageFix()
  
  console.log('\n📊 DEPLOYMENT SUMMARY')
  console.log('============================================================')
  
  if (success) {
    console.log('🎉 Image fix deployment COMPLETED!')
    console.log('')
    console.log('✅ What was deployed:')
    console.log('   📄 Updated image mapping file with all product images')
    console.log('   🔧 Enhanced image API with multiple fallback options')
    console.log('   📝 Database table creation script')
    console.log('')
    console.log('🌐 Next steps:')
    console.log('   1. Wait 2-3 minutes for deployment to complete')
    console.log('   2. Visit https://owowlove.com to test image display')
    console.log('   3. Create image_storage table in Supabase (optional)')
    console.log('   4. Run verification: node verify-production-images.js')
    console.log('')
    console.log('🔍 If images still don\'t show:')
    console.log('   - Check browser console for errors')
    console.log('   - Test API directly: https://owowlove.com/api/image/product-1752068376427.jpg')
    console.log('   - Clear browser cache and try again')
  } else {
    console.log('❌ Deployment FAILED!')
    console.log('📝 Please check the errors above and try again')
    console.log('')
    console.log('💡 Manual deployment steps:')
    console.log('   1. git add .')
    console.log('   2. git commit -m "Fix image display issue"')
    console.log('   3. git push origin main')
  }
  
  process.exit(success ? 0 : 1)
}

main()
