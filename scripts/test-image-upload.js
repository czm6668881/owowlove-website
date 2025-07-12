#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkImageUploadSetup() {
  console.log('🔍 Checking Image Upload Setup...\n');

  // Check directories
  console.log('📁 Checking upload directories:');
  checkDirectory('public/product-images');
  checkDirectory('public/uploads');

  // Check API files
  console.log('\n📄 Checking API files:');
  checkFile('app/api/admin/upload/route.ts');
  checkFile('app/api/admin/upload-image/route.ts');
  checkFile('app/api/image/[filename]/route.ts');

  // Check existing images
  console.log('\n🖼️ Checking existing images:');
  listImages('public/product-images');
  listImages('public/uploads');

  // Check permissions
  console.log('\n🔐 Checking directory permissions:');
  checkPermissions('public/product-images');
  checkPermissions('public/uploads');

  console.log('\n✅ Image upload setup check complete!');
  console.log('\n💡 To test image upload:');
  console.log('   1. Open http://localhost:3000/simple-upload-test.html');
  console.log('   2. Select an image file');
  console.log('   3. Click "Upload Image"');
  console.log('   4. Check the console for detailed logs');
}

function checkDirectory(dirPath) {
  const fullPath = path.join(__dirname, '..', dirPath);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    console.log(`✅ ${dirPath}: ${files.length} files`);
  } else {
    console.log(`❌ ${dirPath}: Directory not found`);
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created directory: ${dirPath}`);
    } catch (error) {
      console.log(`❌ Failed to create directory: ${error.message}`);
    }
  }
}

function checkFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath}: Found`);
  } else {
    console.log(`❌ ${filePath}: Not found`);
  }
}

function listImages(dirPath) {
  const fullPath = path.join(__dirname, '..', dirPath);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(fullPath, a));
        const statB = fs.statSync(path.join(fullPath, b));
        return statB.mtime - statA.mtime;
      });

    if (files.length > 0) {
      console.log(`📸 ${dirPath}: ${files.length} images`);
      console.log(`   Latest: ${files.slice(0, 3).join(', ')}`);
    } else {
      console.log(`📸 ${dirPath}: No images found`);
    }
  }
}

function checkPermissions(dirPath) {
  const fullPath = path.join(__dirname, '..', dirPath);
  if (fs.existsSync(fullPath)) {
    try {
      fs.accessSync(fullPath, fs.constants.R_OK | fs.constants.W_OK);
      console.log(`✅ ${dirPath}: Read/Write permissions OK`);
    } catch (error) {
      console.log(`❌ ${dirPath}: Permission error - ${error.message}`);
    }
  }
}

// Run the check
if (require.main === module) {
  checkImageUploadSetup();
}

module.exports = { checkImageUploadSetup };
