const fs = require('fs');
const path = require('path');

console.log('🔍 检查文件系统权限...\n');

const publicDir = path.join(process.cwd(), 'public');
const uploadsDir = path.join(publicDir, 'uploads');

console.log('📂 目录信息:');
console.log(`工作目录: ${process.cwd()}`);
console.log(`Public目录: ${publicDir}`);
console.log(`Uploads目录: ${uploadsDir}`);

// 检查目录是否存在
console.log('\n📁 目录存在性检查:');
console.log(`Public目录存在: ${fs.existsSync(publicDir) ? '✅' : '❌'}`);
console.log(`Uploads目录存在: ${fs.existsSync(uploadsDir) ? '✅' : '❌'}`);

// 如果uploads目录不存在，尝试创建
if (!fs.existsSync(uploadsDir)) {
    console.log('\n🛠️ 尝试创建uploads目录...');
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log('✅ 成功创建uploads目录');
    } catch (error) {
        console.log('❌ 创建uploads目录失败:', error.message);
    }
}

// 检查权限
function checkPermissions(dir, label) {
    console.log(`\n🔐 ${label}权限检查:`);
    
    if (!fs.existsSync(dir)) {
        console.log('❌ 目录不存在');
        return;
    }
    
    try {
        // 检查读取权限
        fs.accessSync(dir, fs.constants.R_OK);
        console.log('✅ 读取权限: OK');
    } catch (error) {
        console.log('❌ 读取权限: FAILED -', error.message);
    }
    
    try {
        // 检查写入权限
        fs.accessSync(dir, fs.constants.W_OK);
        console.log('✅ 写入权限: OK');
    } catch (error) {
        console.log('❌ 写入权限: FAILED -', error.message);
    }
    
    try {
        // 测试实际写入
        const testFile = path.join(dir, 'test-write.txt');
        fs.writeFileSync(testFile, 'test content');
        console.log('✅ 实际写入测试: OK');
        
        // 清理测试文件
        fs.unlinkSync(testFile);
        console.log('✅ 文件删除测试: OK');
    } catch (error) {
        console.log('❌ 实际写入测试: FAILED -', error.message);
    }
    
    try {
        // 获取目录统计信息
        const stats = fs.statSync(dir);
        console.log('📊 目录信息:');
        console.log(`  - 创建时间: ${stats.birthtime}`);
        console.log(`  - 修改时间: ${stats.mtime}`);
        console.log(`  - 是否为目录: ${stats.isDirectory()}`);
        console.log(`  - 权限模式: ${stats.mode.toString(8)}`);
    } catch (error) {
        console.log('❌ 获取目录信息失败:', error.message);
    }
}

checkPermissions(publicDir, 'Public目录');
checkPermissions(uploadsDir, 'Uploads目录');

// 检查现有文件
console.log('\n📋 现有文件列表:');
try {
    if (fs.existsSync(uploadsDir)) {
        const files = fs.readdirSync(uploadsDir);
        if (files.length === 0) {
            console.log('📁 uploads目录为空');
        } else {
            console.log(`📁 uploads目录包含 ${files.length} 个文件:`);
            files.slice(0, 5).forEach(file => {
                const filePath = path.join(uploadsDir, file);
                const stats = fs.statSync(filePath);
                console.log(`  - ${file} (${stats.size} bytes, ${stats.mtime.toISOString()})`);
            });
            if (files.length > 5) {
                console.log(`  ... 还有 ${files.length - 5} 个文件`);
            }
        }
    }
} catch (error) {
    console.log('❌ 读取文件列表失败:', error.message);
}

// 测试创建一个临时图片文件
console.log('\n🧪 测试图片文件创建:');
try {
    const testImagePath = path.join(uploadsDir, 'test-image.jpg');
    
    // 创建一个简单的JPEG文件头
    const jpegHeader = Buffer.from([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
        0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
        0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
        0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
        0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
        0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
        0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
        0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0xAA, 0xFF, 0xD9
    ]);
    
    fs.writeFileSync(testImagePath, jpegHeader);
    console.log('✅ 成功创建测试图片文件');
    
    // 验证文件
    const stats = fs.statSync(testImagePath);
    console.log(`📊 测试文件信息: ${stats.size} bytes`);
    
    // 清理
    fs.unlinkSync(testImagePath);
    console.log('✅ 成功删除测试文件');
    
} catch (error) {
    console.log('❌ 测试图片文件创建失败:', error.message);
}

console.log('\n✅ 权限检查完成');
