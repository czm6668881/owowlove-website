const fs = require('fs');
const path = require('path');

console.log('🔍 检查和修复产品数据中的域名URL...');

// 检查和修复 data/products.json
const productsPath = path.join(process.cwd(), 'data', 'products.json');
if (fs.existsSync(productsPath)) {
  console.log('📊 检查 data/products.json...');
  
  const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  let hasChanges = false;
  
  products.forEach((product, index) => {
    console.log(`\n产品 ${index + 1}: ${product.nameEn || product.name}`);
    
    if (product.images && product.images.length > 0) {
      product.images.forEach((img, imgIndex) => {
        let originalUrl = '';
        let newUrl = '';
        
        if (typeof img === 'string') {
          originalUrl = img;
          
          // 检查是否包含域名
          if (originalUrl.includes('owowlove.com') || originalUrl.includes('vercel.app') || originalUrl.startsWith('http')) {
            const filename = originalUrl.split('/').pop() || '';
            if (filename) {
              newUrl = `/uploads/${filename}`;
              product.images[imgIndex] = newUrl;
              hasChanges = true;
              console.log(`  🔧 修复图片 ${imgIndex + 1}: ${originalUrl} -> ${newUrl}`);
            }
          } else {
            console.log(`  ✅ 图片 ${imgIndex + 1} 格式正常: ${originalUrl}`);
          }
        } else if (img && typeof img === 'object' && img.url) {
          originalUrl = img.url;
          
          // 检查是否包含域名
          if (originalUrl.includes('owowlove.com') || originalUrl.includes('vercel.app') || originalUrl.startsWith('http')) {
            const filename = originalUrl.split('/').pop() || '';
            if (filename) {
              newUrl = `/uploads/${filename}`;
              img.url = newUrl;
              hasChanges = true;
              console.log(`  🔧 修复图片 ${imgIndex + 1}: ${originalUrl} -> ${newUrl}`);
            }
          } else {
            console.log(`  ✅ 图片 ${imgIndex + 1} 格式正常: ${originalUrl}`);
          }
        }
      });
    }
  });
  
  if (hasChanges) {
    // 备份原文件
    const backupPath = productsPath + '.backup.' + Date.now();
    fs.writeFileSync(backupPath, fs.readFileSync(productsPath));
    console.log(`\n💾 原文件已备份到: ${backupPath}`);
    
    // 保存修复后的数据
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    console.log('✅ 产品数据已修复并保存');
  } else {
    console.log('\n✅ 没有发现需要修复的域名URL');
  }
} else {
  console.log('❌ data/products.json 不存在');
}

// 检查 Supabase 数据库中的产品
console.log('\n🔍 检查 Supabase 数据库中的产品...');

async function checkSupabaseProducts() {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log(`📊 数据库中有 ${data.data.length} 个产品`);
      
      data.data.forEach((product, index) => {
        console.log(`\n产品 ${index + 1}: ${product.name}`);
        console.log(`  ID: ${product.id}`);
        console.log(`  激活状态: ${product.is_active}`);
        
        if (product.images && product.images.length > 0) {
          product.images.forEach((img, imgIndex) => {
            const imageUrl = typeof img === 'string' ? img : img.url;
            if (imageUrl && (imageUrl.includes('owowlove.com') || imageUrl.includes('vercel.app') || imageUrl.startsWith('http'))) {
              console.log(`  ⚠️ 发现域名URL: ${imageUrl}`);
            } else {
              console.log(`  ✅ 图片 ${imgIndex + 1}: ${imageUrl}`);
            }
          });
        } else {
          console.log('  ❌ 没有图片');
        }
      });
    } else {
      console.log('❌ 无法获取数据库产品数据');
    }
  } catch (error) {
    console.error('❌ 检查数据库时出错:', error.message);
  }
}

// 如果服务器正在运行，检查数据库
if (process.argv.includes('--check-db')) {
  checkSupabaseProducts();
}

console.log('\n🎯 修复完成！请刷新页面查看效果。');
