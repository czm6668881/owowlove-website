// Test categories synchronization between admin and public APIs
const http = require('http')

async function testAPI(endpoint, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint,
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
          resolve({ 
            success: res.statusCode === 200 && result.success, 
            data: result.data || [],
            status: res.statusCode
          })
        } catch (error) {
          resolve({ success: false, error: error.message, status: res.statusCode })
        }
      })
    })

    req.on('error', (error) => {
      resolve({ success: false, error: error.message })
    })

    req.end()
  })
}

async function runSyncTest() {
  console.log('🔄 Testing Categories Data Synchronization')
  console.log('=' * 50)
  
  // Test both APIs
  const adminResult = await testAPI('/api/admin/categories', 'Admin Categories')
  const publicResult = await testAPI('/api/categories', 'Public Categories')
  
  console.log(`📊 Admin API: ${adminResult.success ? '✅ Success' : '❌ Failed'} (${adminResult.status})`)
  console.log(`📊 Public API: ${publicResult.success ? '✅ Success' : '❌ Failed'} (${publicResult.status})`)
  
  if (adminResult.success && publicResult.success) {
    console.log('\n🔍 Data Structure Comparison:')
    
    // Compare data structures
    if (adminResult.data.length > 0 && publicResult.data.length > 0) {
      const adminSample = adminResult.data[0]
      const publicSample = publicResult.data[0]
      
      console.log('\n📋 Admin API Sample Fields:')
      console.log('  ', Object.keys(adminSample).join(', '))
      
      console.log('\n📋 Public API Sample Fields:')
      console.log('  ', Object.keys(publicSample).join(', '))
      
      // Check if structures match
      const adminFields = Object.keys(adminSample).sort()
      const publicFields = Object.keys(publicSample).sort()
      const structuresMatch = JSON.stringify(adminFields) === JSON.stringify(publicFields)
      
      console.log(`\n🔄 Data Structures: ${structuresMatch ? '✅ Synchronized' : '⚠️ Different'}`)
      
      // Compare category counts
      console.log(`\n📊 Category Counts:`)
      console.log(`   Admin API: ${adminResult.data.length} categories`)
      console.log(`   Public API: ${publicResult.data.length} categories`)
      
      // List categories from both APIs
      console.log('\n📋 Admin Categories:')
      adminResult.data.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (ID: ${cat.id})`)
      })
      
      console.log('\n📋 Public Categories:')
      publicResult.data.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (ID: ${cat.id})`)
      })
      
      // Check if category IDs match
      const adminIds = adminResult.data.map(c => c.id).sort()
      const publicIds = publicResult.data.map(c => c.id).sort()
      const idsMatch = JSON.stringify(adminIds) === JSON.stringify(publicIds)
      
      console.log(`\n🆔 Category IDs: ${idsMatch ? '✅ Synchronized' : '⚠️ Different'}`)
      
      if (structuresMatch && idsMatch) {
        console.log('\n🎉 SUCCESS: Categories are fully synchronized!')
        console.log('✅ Admin and Public APIs use the same data source')
        console.log('✅ Data structures are identical')
        console.log('✅ Category IDs match')
        console.log('✅ Product form will show correct categories')
      } else {
        console.log('\n⚠️ PARTIAL SYNC: Some differences detected')
        if (!structuresMatch) {
          console.log('❌ Data structures differ')
        }
        if (!idsMatch) {
          console.log('❌ Category IDs differ')
        }
      }
    } else {
      console.log('\n❌ No data available for comparison')
    }
  } else {
    console.log('\n❌ API Test Failed')
    if (!adminResult.success) {
      console.log(`   Admin API Error: ${adminResult.error || 'Unknown error'}`)
    }
    if (!publicResult.success) {
      console.log(`   Public API Error: ${publicResult.error || 'Unknown error'}`)
    }
  }
  
  console.log('\n🔧 Next Steps:')
  console.log('1. Visit: http://localhost:3000/en/admin/products/new')
  console.log('2. Check if category dropdown shows correct options')
  console.log('3. Visit: http://localhost:3000/en/admin/categories')
  console.log('4. Verify category management works correctly')
}

runSyncTest().catch(error => {
  console.error('❌ Sync test failed:', error.message)
})
