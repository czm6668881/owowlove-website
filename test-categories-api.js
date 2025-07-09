// Test categories API data structure
const http = require('http')

async function testCategoriesAPI() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/categories',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          console.log('🔍 Admin Categories API Response:')
          console.log('Status:', res.statusCode)
          console.log('Success:', result.success)
          console.log('Data count:', result.data?.length || 0)
          
          if (result.data && result.data.length > 0) {
            console.log('\n📋 Sample category structure:')
            const sample = result.data[0]
            console.log('Fields:', Object.keys(sample))
            console.log('Sample data:', JSON.stringify(sample, null, 2))
            
            console.log('\n📊 All categories:')
            result.data.forEach((cat, index) => {
              console.log(`${index + 1}. ID: ${cat.id}`)
              console.log(`   Name: ${cat.name || 'N/A'}`)
              console.log(`   NameEn: ${cat.nameEn || 'N/A'}`)
              console.log(`   Description: ${cat.description || 'N/A'}`)
              console.log(`   Active: ${cat.isActive || cat.is_active || 'N/A'}`)
              console.log('')
            })
          }
          
          resolve(result)
        } catch (error) {
          console.error('❌ Parse error:', error.message)
          resolve({ success: false, error: error.message })
        }
      })
    })

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message)
      resolve({ success: false, error: error.message })
    })

    req.end()
  })
}

async function testPublicCategoriesAPI() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/categories',
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }

    const req = http.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          console.log('\n🌐 Public Categories API Response:')
          console.log('Status:', res.statusCode)
          console.log('Success:', result.success)
          console.log('Data count:', result.data?.length || 0)
          
          if (result.data && result.data.length > 0) {
            console.log('\n📋 Sample public category structure:')
            const sample = result.data[0]
            console.log('Fields:', Object.keys(sample))
            console.log('Sample data:', JSON.stringify(sample, null, 2))
          }
          
          resolve(result)
        } catch (error) {
          console.error('❌ Parse error:', error.message)
          resolve({ success: false, error: error.message })
        }
      })
    })

    req.on('error', (error) => {
      console.error('❌ Request error:', error.message)
      resolve({ success: false, error: error.message })
    })

    req.end()
  })
}

async function runTest() {
  console.log('🧪 Testing Categories API Data Structure')
  console.log('=' * 50)
  
  const adminResult = await testCategoriesAPI()
  const publicResult = await testPublicCategoriesAPI()
  
  console.log('\n📊 Comparison Summary:')
  console.log(`Admin API: ${adminResult.success ? 'Success' : 'Failed'}`)
  console.log(`Public API: ${publicResult.success ? 'Success' : 'Failed'}`)
  
  if (adminResult.success && publicResult.success) {
    console.log('\n🔍 Data Structure Analysis:')
    console.log('Admin categories use file system data structure')
    console.log('Public categories use Supabase data structure')
    console.log('\n💡 Recommendation: Sync both APIs to use the same data source')
  }
}

runTest().catch(error => {
  console.error('❌ Test failed:', error.message)
})
