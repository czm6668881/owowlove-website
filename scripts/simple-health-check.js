#!/usr/bin/env node

/**
 * 简化的健康检查脚本
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Simple Health Check Starting...');

// 检查图片文件
function checkImageFiles() {
  console.log('\n📁 Checking image files...');
  
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('❌ Uploads directory not found:', uploadsDir);
    return false;
  }
  
  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );
  
  console.log(`✅ Found ${imageFiles.length} image files in uploads directory`);
  
  // 检查特定的产品图片
  const testImages = [
    'product-1752080189101.jpeg',
    'product-1752068376427.jpg'
  ];
  
  let foundCount = 0;
  testImages.forEach(filename => {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✅ ${filename} - Size: ${stats.size} bytes`);
      foundCount++;
    } else {
      console.log(`❌ ${filename} - Not found`);
    }
  });
  
  return foundCount > 0;
}

// 检查配置文件
function checkConfiguration() {
  console.log('\n⚙️ Checking configuration...');
  
  // 检查 next.config.mjs
  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  if (fs.existsSync(nextConfigPath)) {
    console.log('✅ next.config.mjs found');
    
    const config = fs.readFileSync(nextConfigPath, 'utf8');
    if (config.includes('owowlove.com')) {
      console.log('✅ Production domain configured in next.config.mjs');
    } else {
      console.log('❌ Production domain not found in next.config.mjs');
    }
  } else {
    console.log('❌ next.config.mjs not found');
  }
  
  // 检查API路由文件
  const apiImagePath = path.join(process.cwd(), 'app', 'api', 'image', '[filename]', 'route.ts');
  if (fs.existsSync(apiImagePath)) {
    console.log('✅ Image API route file found');
  } else {
    console.log('❌ Image API route file not found');
  }
  
  // 检查Footer组件
  const footerPath = path.join(process.cwd(), 'components', 'footer.tsx');
  if (fs.existsSync(footerPath)) {
    console.log('✅ Footer component found');
    
    const footer = fs.readFileSync(footerPath, 'utf8');
    if (footer.includes('/en/shipping-info')) {
      console.log('✅ Footer links updated correctly');
    } else {
      console.log('❌ Footer links not updated');
    }
  } else {
    console.log('❌ Footer component not found');
  }
}

// 检查环境变量
function checkEnvironment() {
  console.log('\n🔧 Environment variables:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`PORT: ${process.env.PORT || 'not set'}`);
  console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? 'set' : 'not set'}`);
  console.log(`SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? 'set' : 'not set'}`);
}

// 主函数
function main() {
  console.log('🚀 Starting simple health check...\n');
  
  // 1. 检查图片文件
  const filesOk = checkImageFiles();
  
  // 2. 检查配置
  checkConfiguration();
  
  // 3. 检查环境
  checkEnvironment();
  
  // 总结
  console.log('\n📊 Health Check Summary:');
  console.log(`📁 Image Files: ${filesOk ? '✅ OK' : '❌ FAIL'}`);
  
  console.log(`\n🎯 Overall Status: ${filesOk ? '✅ READY FOR DEPLOYMENT' : '❌ ISSUES DETECTED'}`);
  
  if (!filesOk) {
    console.log('\n🔧 Recommended actions:');
    console.log('- Check image file uploads and permissions');
    console.log('- Verify public/uploads directory exists');
    console.log('- Ensure product images are properly uploaded');
  }
  
  return filesOk;
}

// 运行健康检查
try {
  const result = main();
  process.exit(result ? 0 : 1);
} catch (err) {
  console.error('💥 Health check failed:', err);
  process.exit(1);
}
