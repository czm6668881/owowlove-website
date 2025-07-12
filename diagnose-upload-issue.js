const fs = require('fs');
const path = require('path');

console.log('🔍 诊断图片上传问题...\n');

// 检查目录结构
const publicDir = path.join(process.cwd(), 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const productImagesDir = path.join(publicDir, 'product-images');

console.log('📁 目录检查:');
console.log(`工作目录: ${process.cwd()}`);
console.log(`Public目录: ${publicDir} - ${fs.existsSync(publicDir) ? '✅ 存在' : '❌ 不存在'}`);
console.log(`Uploads目录: ${uploadsDir} - ${fs.existsSync(uploadsDir) ? '✅ 存在' : '❌ 不存在'}`);
console.log(`Product-images目录: ${productImagesDir} - ${fs.existsSync(productImagesDir) ? '✅ 存在' : '❌ 不存在'}`);

// 检查目录权限
function checkPermissions(dir) {
    try {
        if (!fs.existsSync(dir)) {
            return '目录不存在';
        }
        
        const stats = fs.statSync(dir);
        const testFile = path.join(dir, 'test-write.txt');
        
        // 测试写入权限
        try {
            fs.writeFileSync(testFile, 'test');
            fs.unlinkSync(testFile);
            return '✅ 可读写';
        } catch (writeError) {
            return `❌ 写入失败: ${writeError.message}`;
        }
    } catch (error) {
        return `❌ 检查失败: ${error.message}`;
    }
}

console.log('\n🔐 权限检查:');
console.log(`Public目录权限: ${checkPermissions(publicDir)}`);
console.log(`Uploads目录权限: ${checkPermissions(uploadsDir)}`);
console.log(`Product-images目录权限: ${checkPermissions(productImagesDir)}`);

// 列出现有文件
function listFiles(dir, label) {
    console.log(`\n📋 ${label}:`);
    if (!fs.existsSync(dir)) {
        console.log('目录不存在');
        return;
    }
    
    try {
        const files = fs.readdirSync(dir);
        if (files.length === 0) {
            console.log('目录为空');
        } else {
            files.slice(0, 10).forEach(file => {
                const filePath = path.join(dir, file);
                const stats = fs.statSync(filePath);
                console.log(`  ${file} (${stats.size} bytes, ${stats.mtime.toISOString()})`);
            });
            if (files.length > 10) {
                console.log(`  ... 还有 ${files.length - 10} 个文件`);
            }
        }
    } catch (error) {
        console.log(`读取失败: ${error.message}`);
    }
}

listFiles(uploadsDir, 'Uploads目录文件');
listFiles(productImagesDir, 'Product-images目录文件');

// 测试创建目录
console.log('\n🛠️ 测试创建目录:');
const testDir = path.join(publicDir, 'test-upload');
try {
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
        console.log('✅ 成功创建测试目录');
        
        // 测试写入文件
        const testFile = path.join(testDir, 'test.txt');
        fs.writeFileSync(testFile, 'test content');
        console.log('✅ 成功写入测试文件');
        
        // 清理
        fs.unlinkSync(testFile);
        fs.rmdirSync(testDir);
        console.log('✅ 成功清理测试文件');
    } else {
        console.log('测试目录已存在');
    }
} catch (error) {
    console.log(`❌ 测试失败: ${error.message}`);
}

// 检查环境变量
console.log('\n🌍 环境信息:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || '未设置'}`);
console.log(`Platform: ${process.platform}`);
console.log(`Node版本: ${process.version}`);

// 检查Next.js配置
console.log('\n⚙️ Next.js配置检查:');
try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
    if (fs.existsSync(nextConfigPath)) {
        console.log('✅ next.config.mjs 存在');
        const configContent = fs.readFileSync(nextConfigPath, 'utf8');
        if (configContent.includes('images')) {
            console.log('✅ 包含图片配置');
        } else {
            console.log('⚠️ 未找到图片配置');
        }
    } else {
        console.log('❌ next.config.mjs 不存在');
    }
} catch (error) {
    console.log(`配置检查失败: ${error.message}`);
}

console.log('\n✅ 诊断完成');
