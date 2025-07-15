const fs = require('fs');
const path = require('path');

console.log('🔍 详细诊断图片显示问题...\n');

// 1. 检查产品数据
console.log('📊 1. 检查产品数据...');
const productsPath = path.join(process.cwd(), 'data', 'products.json');
if (fs.existsSync(productsPath)) {
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  console.log(`   ✅ data/products.json 存在，包含 ${products.length} 个产品`);
  
  products.forEach((product, index) => {
    console.log(`\n   产品 ${index + 1}: ${product.nameEn || product.name}`);
    console.log(`      ID: ${product.id}`);
    console.log(`      激活状态: ${product.isActive}`);
    console.log(`      图片数量: ${product.images?.length || 0}`);
    
    if (product.images && product.images.length > 0) {
      product.images.forEach((img, imgIndex) => {
        const imageUrl = typeof img === 'string' ? img : img.url;
        console.log(`      图片 ${imgIndex + 1}: ${imageUrl}`);
      });
    }
  });
} else {
  console.log('   ❌ data/products.json 不存在');
}

// 2. 检查图片文件
console.log('\n📁 2. 检查图片文件...');
const uploadsPath = path.join(process.cwd(), 'public', 'uploads');
if (fs.existsSync(uploadsPath)) {
  const files = fs.readdirSync(uploadsPath).filter(f => f.startsWith('product-'));
  console.log(`   ✅ public/uploads 目录存在，包含 ${files.length} 个产品图片文件`);
  
  files.slice(0, 5).forEach(file => {
    const filePath = path.join(uploadsPath, file);
    const stats = fs.statSync(filePath);
    console.log(`      ${file} (${Math.round(stats.size / 1024)}KB)`);
  });
  
  if (files.length > 5) {
    console.log(`      ... 还有 ${files.length - 5} 个文件`);
  }
} else {
  console.log('   ❌ public/uploads 目录不存在');
}

// 3. 测试API端点
console.log('\n🌐 3. 测试API端点...');

async function testAPI() {
  try {
    // 测试产品API
    console.log('   测试产品API...');
    const productsResponse = await fetch('http://localhost:3001/api/products');
    const productsData = await productsResponse.json();
    
    if (productsData.success) {
      console.log(`   ✅ 产品API正常，返回 ${productsData.data.length} 个产品`);
      
      // 检查第一个产品的图片
      if (productsData.data.length > 0) {
        const firstProduct = productsData.data[0];
        console.log(`\n   检查第一个产品: ${firstProduct.name}`);
        console.log(`      图片数据:`, JSON.stringify(firstProduct.images, null, 2));
        
        if (firstProduct.images && firstProduct.images.length > 0) {
          const firstImageUrl = typeof firstProduct.images[0] === 'string' 
            ? firstProduct.images[0] 
            : firstProduct.images[0].url;
          
          console.log(`      第一张图片URL: ${firstImageUrl}`);
          
          // 测试图片API
          let testImageUrl = '';
          if (firstImageUrl.startsWith('/api/image/')) {
            testImageUrl = `http://localhost:3001${firstImageUrl}`;
          } else if (firstImageUrl.startsWith('/uploads/')) {
            const filename = firstImageUrl.split('/').pop();
            testImageUrl = `http://localhost:3001/api/image/${filename}`;
          } else {
            const filename = firstImageUrl.split('/').pop();
            testImageUrl = `http://localhost:3001/api/image/${filename}`;
          }
          
          console.log(`      测试图片API: ${testImageUrl}`);
          
          try {
            const imageResponse = await fetch(testImageUrl);
            console.log(`      图片API状态: ${imageResponse.status} ${imageResponse.statusText}`);
            console.log(`      Content-Type: ${imageResponse.headers.get('content-type')}`);
            
            if (imageResponse.ok) {
              console.log('      ✅ 图片API正常工作');
            } else {
              console.log('      ❌ 图片API返回错误');
            }
          } catch (imageError) {
            console.log(`      ❌ 图片API请求失败: ${imageError.message}`);
          }
        }
      }
    } else {
      console.log(`   ❌ 产品API错误: ${productsData.error}`);
    }
  } catch (error) {
    console.log(`   ❌ API测试失败: ${error.message}`);
  }
}

// 4. 检查前端代码
console.log('\n📝 4. 检查关键前端文件...');

// 检查主页文件
const mainPagePath = path.join(process.cwd(), 'app', '[lang]', 'page.tsx');
if (fs.existsSync(mainPagePath)) {
  console.log('   ✅ app/[lang]/page.tsx 存在');
  
  const content = fs.readFileSync(mainPagePath, 'utf8');
  
  // 检查关键函数
  if (content.includes('getProductImage')) {
    console.log('   ✅ getProductImage 函数存在');
  } else {
    console.log('   ❌ getProductImage 函数不存在');
  }
  
  if (content.includes('filteredProducts.map')) {
    console.log('   ✅ 产品渲染逻辑存在');
  } else {
    console.log('   ❌ 产品渲染逻辑不存在');
  }
} else {
  console.log('   ❌ app/[lang]/page.tsx 不存在');
}

// 检查产品图片组件
const productImagePath = path.join(process.cwd(), 'components', 'product', 'product-image.tsx');
if (fs.existsSync(productImagePath)) {
  console.log('   ✅ components/product/product-image.tsx 存在');
} else {
  console.log('   ❌ components/product/product-image.tsx 不存在');
}

// 5. 生成测试HTML
console.log('\n🧪 5. 生成测试页面...');
const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>图片测试页面</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ccc; }
        .image-test { margin: 10px 0; }
        img { max-width: 200px; height: 150px; object-fit: cover; border: 1px solid #ddd; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <h1>图片加载测试页面</h1>
    
    <div class="test-section">
        <h2>1. 直接文件访问测试</h2>
        <div class="image-test">
            <p>测试: /uploads/product-1752401587935.jpeg</p>
            <img src="/uploads/product-1752401587935.jpeg" 
                 onload="this.nextSibling.innerHTML='<span class=success>✅ 加载成功</span>'"
                 onerror="this.nextSibling.innerHTML='<span class=error>❌ 加载失败</span>'">
            <span>加载中...</span>
        </div>
    </div>
    
    <div class="test-section">
        <h2>2. API路由测试</h2>
        <div class="image-test">
            <p>测试: /api/image/product-1752401587935.jpeg</p>
            <img src="/api/image/product-1752401587935.jpeg" 
                 onload="this.nextSibling.innerHTML='<span class=success>✅ 加载成功</span>'"
                 onerror="this.nextSibling.innerHTML='<span class=error>❌ 加载失败</span>'">
            <span>加载中...</span>
        </div>
    </div>
    
    <div class="test-section">
        <h2>3. 占位符测试</h2>
        <div class="image-test">
            <p>测试: /placeholder.svg</p>
            <img src="/placeholder.svg" 
                 onload="this.nextSibling.innerHTML='<span class=success>✅ 加载成功</span>'"
                 onerror="this.nextSibling.innerHTML='<span class=error>❌ 加载失败</span>'">
            <span>加载中...</span>
        </div>
    </div>
    
    <div class="test-section">
        <h2>4. 产品API测试</h2>
        <button onclick="testProductAPI()">测试产品API</button>
        <div id="api-result">点击按钮测试</div>
    </div>
    
    <script>
        async function testProductAPI() {
            const resultDiv = document.getElementById('api-result');
            resultDiv.innerHTML = '测试中...';
            
            try {
                const response = await fetch('/api/products');
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = \`
                        <div class="success">✅ API正常</div>
                        <div>产品数量: \${data.data.length}</div>
                        <pre>\${JSON.stringify(data.data[0], null, 2)}</pre>
                    \`;
                } else {
                    resultDiv.innerHTML = \`<div class="error">❌ API错误: \${data.error}</div>\`;
                }
            } catch (error) {
                resultDiv.innerHTML = \`<div class="error">❌ 请求失败: \${error.message}</div>\`;
            }
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'image-test.html'), testHtml);
console.log('   ✅ 测试页面已生成: http://localhost:3001/image-test.html');

console.log('\n🎯 诊断完成！');
console.log('\n📋 下一步操作:');
console.log('1. 访问测试页面: http://localhost:3001/image-test.html');
console.log('2. 访问调试页面: http://localhost:3001/debug-products');
console.log('3. 访问主页: http://localhost:3001');
console.log('4. 检查浏览器控制台的错误信息');

// 运行API测试
if (process.argv.includes('--test-api')) {
  console.log('\n🧪 运行API测试...');
  testAPI();
}
