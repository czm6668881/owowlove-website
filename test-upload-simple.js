const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testImageUpload() {
    console.log('🧪 测试图片上传功能...\n');
    
    // 创建一个简单的测试图片文件
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    
    // 如果测试图片不存在，创建一个简单的图片文件
    if (!fs.existsSync(testImagePath)) {
        // 创建一个简单的JPEG文件头（最小可用的JPEG）
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
        console.log('✅ 创建了测试图片文件');
    }
    
    // 测试两个上传端点
    const endpoints = [
        { url: 'http://localhost:3001/api/admin/upload-image', field: 'image' },
        { url: 'http://localhost:3001/api/admin/upload', field: 'file' }
    ];
    
    for (const endpoint of endpoints) {
        console.log(`\n🔄 测试端点: ${endpoint.url}`);
        
        try {
            const formData = new FormData();
            formData.append(endpoint.field, fs.createReadStream(testImagePath), {
                filename: 'test-image.jpg',
                contentType: 'image/jpeg'
            });
            
            const response = await fetch(endpoint.url, {
                method: 'POST',
                body: formData,
                headers: formData.getHeaders()
            });
            
            const result = await response.json();
            
            console.log(`📊 状态码: ${response.status}`);
            console.log(`📝 响应:`, JSON.stringify(result, null, 2));
            
            if (result.success) {
                console.log('✅ 上传成功');
                
                // 测试图片是否可以访问
                const imageUrl = `http://localhost:3001${result.url || result.data?.url}`;
                console.log(`🔗 测试图片访问: ${imageUrl}`);
                
                try {
                    const imageResponse = await fetch(imageUrl);
                    console.log(`📸 图片访问状态: ${imageResponse.status}`);
                    
                    if (imageResponse.ok) {
                        console.log('✅ 图片可以正常访问');
                    } else {
                        console.log('❌ 图片无法访问');
                    }
                } catch (imageError) {
                    console.log(`❌ 图片访问错误: ${imageError.message}`);
                }
            } else {
                console.log('❌ 上传失败');
            }
            
        } catch (error) {
            console.log(`❌ 请求错误: ${error.message}`);
        }
    }
    
    // 清理测试文件
    if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
        console.log('\n🧹 清理了测试文件');
    }
}

// 检查服务器是否运行
async function checkServer() {
    try {
        const response = await fetch('http://localhost:3001/');
        return response.ok;
    } catch (error) {
        return false;
    }
}

async function main() {
    console.log('🔍 检查服务器状态...');
    const serverRunning = await checkServer();
    
    if (!serverRunning) {
        console.log('❌ 服务器未运行在 localhost:3001');
        console.log('请先运行: npm run dev');
        return;
    }
    
    console.log('✅ 服务器正在运行');
    await testImageUpload();
}

main().catch(console.error);
