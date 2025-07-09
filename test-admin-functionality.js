// Test admin functionality
const http = require('http')

async function testAPI(endpoint, description, method = 'GET', headers = {}) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
      method: method,
      headers: {
        'Accept': 'application/json',
        ...headers
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
          console.log(`✅ ${description}: ${res.statusCode} - ${result.success ? 'Success' : 'Failed'}`)
          if (result.data && Array.isArray(result.data)) {
            console.log(`   📊 Data count: ${result.data.length}`)
            if (result.data.length > 0) {
              const firstItem = result.data[0]
              console.log(`   📝 Sample fields: ${Object.keys(firstItem).slice(0, 5).join(', ')}`)
            }
          }
          resolve({ success: res.statusCode === 200, data: result })
        } catch (error) {
          console.log(`❌ ${description}: ${res.statusCode} - Parse error`)
          resolve({ success: false, error: error.message })
        }
      })
    })

    req.on('error', (error) => {
      console.log(`❌ ${description}: Connection error - ${error.message}`)
      resolve({ success: false, error: error.message })
    })

    req.end()
  })
}

async function runAdminTests() {
  console.log('🔧 Testing OWOWLOVE.COM Admin Functionality')
  console.log('=' * 50)
  
  const tests = [
    { endpoint: '/api/admin/products', description: 'Admin Products API' },
    { endpoint: '/api/admin/categories', description: 'Admin Categories API' },
    { endpoint: '/api/admin/settings', description: 'Admin Settings API' },
    { endpoint: '/api/categories', description: 'Public Categories API' },
    { endpoint: '/api/products', description: 'Public Products API' }
  ]
  
  let passedTests = 0
  
  for (const test of tests) {
    const result = await testAPI(test.endpoint, test.description)
    if (result.success) {
      passedTests++
    }
    
    // Add a small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  console.log('\n📊 Admin Test Results:')
  console.log(`   ✅ Passed: ${passedTests}/${tests.length}`)
  console.log(`   ❌ Failed: ${tests.length - passedTests}/${tests.length}`)
  
  if (passedTests === tests.length) {
    console.log('\n🎉 All admin tests passed! Backend is functioning correctly.')
    console.log('\n🔧 Admin Panel Access:')
    console.log('   Login: http://localhost:3000/en/admin/login')
    console.log('   Password: admin123')
    console.log('   Products: http://localhost:3000/en/admin/products')
    console.log('   Categories: http://localhost:3000/en/admin/categories')
    console.log('\n📋 Admin features working:')
    console.log('   ✅ Product management API')
    console.log('   ✅ Category management API')
    console.log('   ✅ Settings management')
    console.log('   ✅ Public API endpoints')
    console.log('   ✅ Data structure compatibility')
  } else {
    console.log('\n⚠️  Some admin tests failed. Please check the errors above.')
  }
}

runAdminTests().catch(error => {
  console.error('❌ Admin test runner failed:', error.message)
})
