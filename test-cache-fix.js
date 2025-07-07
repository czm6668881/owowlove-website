// 测试缓存修复
const BASE_URL = 'http://localhost:3000';

async function testCacheFix() {
  console.log('🔧 测试缓存修复...\n');
  
  try {
    // 1. 获取当前产品列表
    console.log('1️⃣ 获取当前产品列表...');
    const listResponse = await fetch(`${BASE_URL}/api/admin/products`);
    
    if (listResponse.ok) {
      const listResult = await listResponse.json();
      console.log('✅ 获取列表成功! 产品数量:', listResult.data.length);
      
      console.log('当前产品列表:');
      listResult.data.forEach((product, index) => {
        console.log(`${index + 1}. ID: ${product.id}, 名称: ${product.nameEn}`);
      });
    } else {
      console.log('❌ 获取列表失败');
      return;
    }
    
    // 2. 创建一个新产品
    console.log('\n2️⃣ 创建新产品...');
    const createData = {
      nameEn: 'Cache Fix Test Product',
      descriptionEn: 'Testing cache fix',
      category: 'test',
      isActive: true,
      variants: [
        {
          size: 'One Size',
          color: 'Red',
          price: 19.99,
          stock: 5,
          sku: 'CACHE-TEST-001'
        }
      ],
      tags: [],
      images: [],
      seoTitle: 'Cache Test',
      seoDescription: 'Cache Test Description',
      seoKeywords: ['cache', 'test']
    };
    
    const createResponse = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createData)
    });
    
    console.log('创建响应状态:', createResponse.status);
    
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      const newProductId = createResult.data.id;
      console.log('✅ 创建成功! 新产品ID:', newProductId);
      
      // 3. 立即尝试获取这个新产品
      console.log('\n3️⃣ 立即获取新创建的产品...');
      const getResponse = await fetch(`${BASE_URL}/api/admin/products/${newProductId}`);
      console.log('获取新产品响应状态:', getResponse.status);
      
      if (getResponse.ok) {
        const getResult = await getResponse.json();
        console.log('✅ 获取新产品成功!');
        console.log('产品名称:', getResult.data.nameEn);
      } else {
        const errorText = await getResponse.text();
        console.log('❌ 获取新产品失败:', errorText);
      }
      
      // 4. 再次获取产品列表，看看数量是否增加
      console.log('\n4️⃣ 再次获取产品列表...');
      const listResponse2 = await fetch(`${BASE_URL}/api/admin/products`);
      
      if (listResponse2.ok) {
        const listResult2 = await listResponse2.json();
        console.log('✅ 获取列表成功! 新产品数量:', listResult2.data.length);
        
        // 检查新产品是否在列表中
        const newProduct = listResult2.data.find(p => p.id === newProductId);
        if (newProduct) {
          console.log('✅ 新产品在列表中找到');
        } else {
          console.log('❌ 新产品在列表中未找到');
        }
      }
      
      // 5. 尝试删除新产品
      console.log('\n5️⃣ 删除新产品...');
      const deleteResponse = await fetch(`${BASE_URL}/api/admin/products/${newProductId}`, {
        method: 'DELETE'
      });
      
      console.log('删除响应状态:', deleteResponse.status);
      
      if (deleteResponse.ok) {
        console.log('✅ 删除成功!');
        
        // 验证删除
        const verifyResponse = await fetch(`${BASE_URL}/api/admin/products/${newProductId}`);
        console.log('验证删除响应状态:', verifyResponse.status);
        
        if (verifyResponse.status === 404) {
          console.log('✅ 验证删除成功 - 产品不再存在');
        } else {
          console.log('❌ 验证删除失败 - 产品仍然存在');
        }
      } else {
        const errorText = await deleteResponse.text();
        console.log('❌ 删除失败:', errorText);
      }
      
    } else {
      const errorText = await createResponse.text();
      console.log('❌ 创建失败:', errorText);
    }
    
    console.log('\n🎉 缓存测试完成!');
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testCacheFix();
