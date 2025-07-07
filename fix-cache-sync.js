// 修复缓存同步问题
const BASE_URL = 'http://localhost:3000';

async function fixCacheSync() {
  console.log('🔧 修复缓存同步问题...\n');
  
  try {
    // 1. 创建一个API端点来清除缓存
    console.log('1️⃣ 尝试清除服务器缓存...');
    
    // 通过创建一个新产品来触发缓存更新
    const testData = {
      nameEn: 'Cache Sync Test',
      descriptionEn: 'Testing cache synchronization',
      category: 'test',
      isActive: true,
      variants: [{
        size: 'One Size',
        color: 'Test',
        price: 1.00,
        stock: 1,
        sku: 'CACHE-SYNC-001'
      }],
      tags: [],
      images: [],
      seoTitle: 'Cache Sync',
      seoDescription: 'Cache Sync Test',
      seoKeywords: ['cache', 'sync']
    };
    
    const createResponse = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log('✅ 创建测试产品成功，ID:', createResult.data.id);
      
      // 2. 立即删除这个产品
      console.log('\n2️⃣ 立即删除测试产品...');
      const deleteResponse = await fetch(`${BASE_URL}/api/admin/products/${createResult.data.id}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        console.log('✅ 删除测试产品成功');
      } else {
        console.log('❌ 删除测试产品失败');
      }
      
      // 3. 获取最新的产品列表
      console.log('\n3️⃣ 获取最新产品列表...');
      const listResponse = await fetch(`${BASE_URL}/api/admin/products`);
      
      if (listResponse.ok) {
        const listResult = await listResponse.json();
        console.log('✅ 当前产品数量:', listResult.data.length);
        
        console.log('当前产品列表:');
        listResult.data.forEach((product, index) => {
          console.log(`${index + 1}. ID: ${product.id}, 名称: ${product.nameEn}`);
        });
        
        // 4. 如果还有多余的产品，尝试删除一个
        if (listResult.data.length > 1) {
          console.log('\n4️⃣ 尝试删除一个现有产品...');
          const targetProduct = listResult.data.find(p => p.id !== '2'); // 不删除ID为2的产品
          
          if (targetProduct) {
            console.log(`选择删除产品: ID=${targetProduct.id}, 名称=${targetProduct.nameEn}`);
            
            const deleteResponse2 = await fetch(`${BASE_URL}/api/admin/products/${targetProduct.id}`, {
              method: 'DELETE'
            });
            
            console.log('删除响应状态:', deleteResponse2.status);
            
            if (deleteResponse2.ok) {
              console.log('✅ 删除成功');
              
              // 验证删除
              setTimeout(() => {
                fetch(`${BASE_URL}/api/admin/products`)
                  .then(response => response.json())
                  .then(result => {
                    console.log('\n5️⃣ 验证删除结果...');
                    console.log('删除后产品数量:', result.data.length);
                    
                    const deletedProductExists = result.data.find(p => p.id === targetProduct.id);
                    if (deletedProductExists) {
                      console.log('❌ 产品仍然存在，删除失败');
                    } else {
                      console.log('✅ 产品已成功删除');
                    }
                    
                    console.log('\n🎯 缓存同步修复完成');
                  })
                  .catch(error => {
                    console.error('验证删除时出错:', error);
                  });
              }, 1000);
              
            } else {
              const errorText = await deleteResponse2.text();
              console.log('❌ 删除失败:', errorText);
            }
          }
        } else {
          console.log('\n✅ 产品数量正常，无需删除');
        }
        
      } else {
        console.log('❌ 获取产品列表失败');
      }
      
    } else {
      const errorText = await createResponse.text();
      console.log('❌ 创建测试产品失败:', errorText);
    }
    
  } catch (error) {
    console.error('修复过程中出错:', error);
  }
}

// 运行修复
fixCacheSync();
