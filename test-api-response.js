const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('🔍 测试产品API...');
    
    const response = await fetch('http://localhost:3001/api/products');
    const data = await response.json();
    
    console.log('📊 API响应状态:', response.status);
    console.log('📊 API响应数据:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      console.log('\n📋 产品详情:');
      data.data.forEach((product, index) => {
        console.log(`\n产品 ${index + 1}:`);
        console.log(`  名称: ${product.name}`);
        console.log(`  ID: ${product.id}`);
        console.log(`  激活状态: ${product.is_active}`);
        console.log(`  价格: ${product.price || '未设置'}`);
        console.log(`  图片数量: ${product.images?.length || 0}`);
        console.log(`  Variants数量: ${product.variants?.length || 0}`);
        
        if (product.images && product.images.length > 0) {
          console.log(`  图片URLs:`);
          product.images.forEach((img, imgIndex) => {
            const url = typeof img === 'string' ? img : img.url;
            console.log(`    ${imgIndex + 1}. ${url}`);
          });
        }
        
        if (product.variants && product.variants.length > 0) {
          console.log(`  Variants:`);
          product.variants.forEach((variant, varIndex) => {
            console.log(`    ${varIndex + 1}. ${variant.size} - ${variant.color} - $${variant.price}`);
          });
        }
      });
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testAPI();
