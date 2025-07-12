const http = require('http')

function testAPI() {
  console.log('🔄 Testing API endpoint...')
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/products',
    method: 'GET'
  }

  const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`)
    console.log(`📋 Headers:`, res.headers)
    
    let data = ''
    
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data)
        console.log('✅ API Response:')
        console.log('Success:', jsonData.success)
        console.log('Data length:', jsonData.data?.length || 0)
        
        if (jsonData.data && jsonData.data.length > 0) {
          console.log('\n📦 First product:')
          const firstProduct = jsonData.data[0]
          console.log('Name:', firstProduct.name)
          console.log('Images:', firstProduct.images)
          console.log('Images type:', typeof firstProduct.images)
          console.log('Images length:', firstProduct.images?.length || 0)
          
          if (firstProduct.images && firstProduct.images.length > 0) {
            console.log('First image:', firstProduct.images[0])
            console.log('First image type:', typeof firstProduct.images[0])
          }
        }
      } catch (e) {
        console.error('❌ Failed to parse JSON:', e.message)
        console.log('Raw response:', data.substring(0, 500))
      }
    })
  })

  req.on('error', (e) => {
    console.error('❌ Request error:', e.message)
  })

  req.end()
}

testAPI()
