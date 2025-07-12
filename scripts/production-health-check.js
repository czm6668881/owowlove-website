#!/usr/bin/env node

/**
 * 生产环境健康检查脚本
 * 检查图片文件、API路由和配置
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DOMAIN = process.env.DOMAIN || 'owowlove.com';
const PROTOCOL = process.env.PROTOCOL || 'https';
const PORT = process.env.PORT || (PROTOCOL === 'https' ? 443 : 3000);

console.log('🔍 Production Health Check Starting...');
console.log(`🌍 Domain: ${DOMAIN}`);
console.log(`🔗 Protocol: ${PROTOCOL}`);
console.log(`🚪 Port: ${PORT}`);

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
  
  testImages.forEach(filename => {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      console.log(`✅ ${filename} - Size: ${stats.size} bytes`);
    } else {
      console.log(`❌ ${filename} - Not found`);
    }
  });
  
  return imageFiles.length > 0;
}

// 检查API路由
function checkApiRoute(filename) {
  return new Promise((resolve) => {
    const url = `${PROTOCOL}://${DOMAIN}${PORT !== 80 && PORT !== 443 ? `:${PORT}` : ''}/api/image/${filename}`;
    console.log(`🔍 Testing API route: ${url}`);
    
    const client = PROTOCOL === 'https' ? https : http;
    
    const req = client.get(url, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);
      
      if (res.statusCode === 200) {
        console.log(`✅ API route working for ${filename}`);
        resolve(true);
      } else {
        console.log(`❌ API route failed for ${filename} - Status: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log(`❌ API route error for ${filename}:`, err.message);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log(`⏰ API route timeout for ${filename}`);
      req.destroy();
      resolve(false);
    });
  });
}

// 检查页面加载
function checkPageLoad() {
  return new Promise((resolve) => {
    const url = `${PROTOCOL}://${DOMAIN}${PORT !== 80 && PORT !== 443 ? `:${PORT}` : ''}/en`;
    console.log(`🔍 Testing page load: ${url}`);
    
    const client = PROTOCOL === 'https' ? https : http;
    
    const req = client.get(url, (res) => {
      console.log(`📊 Page Status: ${res.statusCode}`);
      
      if (res.statusCode === 200) {
        console.log(`✅ Page loads successfully`);
        resolve(true);
      } else {
        console.log(`❌ Page load failed - Status: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log(`❌ Page load error:`, err.message);
      resolve(false);
    });
    
    req.setTimeout(15000, () => {
      console.log(`⏰ Page load timeout`);
      req.destroy();
      resolve(false);
    });
  });
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
  
  // 检查环境变量
  console.log('\n🔧 Environment variables:');
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`PORT: ${process.env.PORT || 'not set'}`);
  console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? 'set' : 'not set'}`);
  console.log(`SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? 'set' : 'not set'}`);
}

// 主函数
async function main() {
  console.log('🚀 Starting comprehensive health check...\n');
  
  // 1. 检查图片文件
  const filesOk = checkImageFiles();
  
  // 2. 检查配置
  checkConfiguration();
  
  // 3. 检查页面加载
  console.log('\n🌐 Checking page load...');
  const pageOk = await checkPageLoad();
  
  // 4. 检查API路由
  console.log('\n🔗 Checking API routes...');
  const testImages = [
    'product-1752080189101.jpeg',
    'product-1752068376427.jpg'
  ];
  
  const apiResults = [];
  for (const filename of testImages) {
    const result = await checkApiRoute(filename);
    apiResults.push(result);
  }
  
  const apiOk = apiResults.some(result => result);
  
  // 总结
  console.log('\n📊 Health Check Summary:');
  console.log(`📁 Image Files: ${filesOk ? '✅ OK' : '❌ FAIL'}`);
  console.log(`🌐 Page Load: ${pageOk ? '✅ OK' : '❌ FAIL'}`);
  console.log(`🔗 API Routes: ${apiOk ? '✅ OK' : '❌ FAIL'}`);
  
  const overallHealth = filesOk && pageOk && apiOk;
  console.log(`\n🎯 Overall Health: ${overallHealth ? '✅ HEALTHY' : '❌ ISSUES DETECTED'}`);
  
  if (!overallHealth) {
    console.log('\n🔧 Recommended actions:');
    if (!filesOk) console.log('- Check image file uploads and permissions');
    if (!pageOk) console.log('- Check server status and deployment');
    if (!apiOk) console.log('- Check API routes and file paths');
  }
  
  process.exit(overallHealth ? 0 : 1);
}

// 运行健康检查
main().catch(err => {
  console.error('💥 Health check failed:', err);
  process.exit(1);
});
