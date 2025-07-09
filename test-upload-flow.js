// Test the complete upload flow
const http = require('http')
const fs = require('fs')
const path = require('path')

// Create a simple test image (1x1 pixel PNG)
const createTestImage = () => {
  // Base64 encoded 1x1 transparent PNG
  const base64Data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
  return Buffer.from(base64Data, 'base64');
};

async function testUploadFlow() {
  return new Promise((resolve) => {
    const boundary = '----formdata-test-' + Date.now();
    const testImageBuffer = createTestImage();
    
    // Create multipart form data
    const formData = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="image"; filename="test.png"',
      'Content-Type: image/png',
      '',
      testImageBuffer.toString('binary'),
      `--${boundary}--`
    ].join('\r\n');
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/upload-image',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': Buffer.byteLength(formData, 'binary')
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('🚀 Upload Test Result:');
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Success: ${result.success}`);
          
          if (result.success) {
            console.log(`   URL: ${result.url}`);
            console.log(`   Filename: ${result.filename}`);
            
            // Test if the uploaded image is accessible
            testImageAccess(result.url).then(accessResult => {
              console.log(`   Accessibility: ${accessResult.success ? '✅ Accessible' : '❌ Not accessible'}`);
              resolve({ uploadSuccess: true, accessSuccess: accessResult.success, url: result.url });
            });
          } else {
            console.log(`   Error: ${result.error}`);
            resolve({ uploadSuccess: false, error: result.error });
          }
        } catch (error) {
          console.log(`   Parse Error: ${error.message}`);
          resolve({ uploadSuccess: false, error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   Request Error: ${error.message}`);
      resolve({ uploadSuccess: false, error: error.message });
    });

    req.write(formData, 'binary');
    req.end();
  });
}

async function testImageAccess(imagePath) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: imagePath,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      resolve({
        success: res.statusCode === 200,
        status: res.statusCode,
        contentType: res.headers['content-type']
      });
    });

    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });

    req.end();
  });
}

async function runCompleteTest() {
  console.log('🧪 Testing Complete Upload Flow');
  console.log('=' * 40);
  
  // Test upload
  const uploadResult = await testUploadFlow();
  
  if (uploadResult.uploadSuccess && uploadResult.accessSuccess) {
    console.log('\n✅ UPLOAD FLOW WORKING CORRECTLY');
    console.log('   - Image uploads successfully');
    console.log('   - Uploaded image is accessible');
    console.log('   - API returns correct URL format');
    
    console.log('\n🔍 If images still don\'t show in the form:');
    console.log('   1. Check browser console for JavaScript errors');
    console.log('   2. Verify React state is updating correctly');
    console.log('   3. Check if there are any CSS issues hiding the images');
    console.log('   4. Ensure the img src attribute is set correctly');
    
  } else {
    console.log('\n❌ UPLOAD FLOW HAS ISSUES');
    if (!uploadResult.uploadSuccess) {
      console.log(`   - Upload failed: ${uploadResult.error}`);
    }
    if (!uploadResult.accessSuccess) {
      console.log('   - Uploaded image is not accessible');
    }
  }
  
  console.log('\n📋 Manual Test Steps:');
  console.log('1. Open: http://localhost:3000/en/admin/products/new');
  console.log('2. Upload an image using the file input');
  console.log('3. Check browser console for debug messages');
  console.log('4. Look for "Debug: X images in state" message');
  console.log('5. Verify the image appears in the preview section');
}

runCompleteTest().catch(error => {
  console.error('❌ Test failed:', error.message);
});
