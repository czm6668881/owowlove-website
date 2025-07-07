// 测试删除操作的持久性
const BASE_URL = 'http://localhost:3000';
const fs = require('fs');
const path = require('path');

async function testDeletePersistence() {
  console.log('🔍 测试删除操作的持久性...\n');
  
  try {
    // 1. 检查当前产品数据文件
    const dataFile = path.join(process.cwd(), 'data', 'products.json');
    console.log('1️⃣ 检查产品数据文件...');
    console.log('文件路径:', dataFile);
    
    if (fs.existsSync(dataFile)) {
      const fileContent = fs.readFileSync(dataFile, 'utf-8');
      const products = JSON.parse(fileContent);
      console.log('✅ 文件存在，当前产品数量:', products.length);
      
      console.log('当前产品列表:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ID: ${product.id}, 名称: ${product.nameEn}`);
      });
    } else {
      console.log('❌ 产品数据文件不存在');
      return;
    }
    
    // 2. 通过API获取产品列表
    console.log('\n2️⃣ 通过API获取产品列表...');
    const listResponse = await fetch(`${BASE_URL}/api/admin/products`);
    
    if (listResponse.ok) {
      const listResult = await listResponse.json();
      console.log('✅ API返回产品数量:', listResult.data.length);
      
      if (listResult.data.length > 0) {
        // 选择第一个产品进行删除测试
        const targetProduct = listResult.data[0];
        console.log(`选择删除产品: ID=${targetProduct.id}, 名称=${targetProduct.nameEn}`);
        
        // 3. 删除产品
        console.log('\n3️⃣ 删除产品...');
        const deleteResponse = await fetch(`${BASE_URL}/api/admin/products/${targetProduct.id}`, {
          method: 'DELETE'
        });
        
        console.log('删除响应状态:', deleteResponse.status);
        
        if (deleteResponse.ok) {
          console.log('✅ API删除成功');
          
          // 4. 立即检查文件是否更新
          console.log('\n4️⃣ 检查文件是否立即更新...');
          setTimeout(() => {
            try {
              const updatedFileContent = fs.readFileSync(dataFile, 'utf-8');
              const updatedProducts = JSON.parse(updatedFileContent);
              console.log('文件中的产品数量:', updatedProducts.length);
              
              const deletedProductExists = updatedProducts.find(p => p.id === targetProduct.id);
              if (deletedProductExists) {
                console.log('❌ 问题：产品仍在文件中存在');
              } else {
                console.log('✅ 产品已从文件中删除');
              }
              
              // 5. 通过API再次验证
              console.log('\n5️⃣ 通过API再次验证...');
              fetch(`${BASE_URL}/api/admin/products`)
                .then(response => response.json())
                .then(result => {
                  console.log('API返回的新产品数量:', result.data.length);
                  
                  const apiProductExists = result.data.find(p => p.id === targetProduct.id);
                  if (apiProductExists) {
                    console.log('❌ 问题：产品仍在API中存在');
                  } else {
                    console.log('✅ 产品已从API中删除');
                  }
                  
                  // 6. 模拟刷新 - 清除缓存并重新获取
                  console.log('\n6️⃣ 模拟页面刷新（清除缓存）...');
                  
                  // 等待一秒后再次检查
                  setTimeout(() => {
                    fetch(`${BASE_URL}/api/admin/products`)
                      .then(response => response.json())
                      .then(refreshResult => {
                        console.log('刷新后API返回的产品数量:', refreshResult.data.length);
                        
                        const refreshProductExists = refreshResult.data.find(p => p.id === targetProduct.id);
                        if (refreshProductExists) {
                          console.log('❌ 问题确认：刷新后产品恢复了！');
                          console.log('这说明删除操作没有正确持久化');
                        } else {
                          console.log('✅ 刷新后产品仍然被删除');
                        }
                        
                        console.log('\n🎯 测试完成');
                      })
                      .catch(error => {
                        console.error('刷新测试出错:', error);
                      });
                  }, 1000);
                })
                .catch(error => {
                  console.error('API验证出错:', error);
                });
              
            } catch (error) {
              console.error('读取文件出错:', error);
            }
          }, 500);
          
        } else {
          const errorText = await deleteResponse.text();
          console.log('❌ 删除失败:', errorText);
        }
      } else {
        console.log('❌ 没有产品可以删除');
      }
    } else {
      console.log('❌ 获取产品列表失败');
    }
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testDeletePersistence();
