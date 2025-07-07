// 测试所有产品管理功能
const BASE_URL = 'http://localhost:3000';

async function testAllFunctions() {
  console.log('🧪 开始测试所有产品管理功能...\n');
  
  let createdProductId = null;
  
  try {
    // 1. 测试创建产品
    console.log('1️⃣ 测试创建产品...');
    const createData = {
      nameEn: 'Test Product for All Functions',
      descriptionEn: 'Testing all product management functions',
      category: 'test',
      isActive: true,
      variants: [
        {
          size: 'S',
          color: 'Red',
          price: 25.99,
          stock: 10,
          sku: 'S-Red-TEST'
        },
        {
          size: 'M',
          color: 'Blue',
          price: 29.99,
          stock: 15,
          sku: 'M-Blue-TEST'
        }
      ],
      tags: [],
      images: [],
      seoTitle: 'Test Product',
      seoDescription: 'Test Description',
      seoKeywords: ['test']
    };
    
    const createResponse = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createData)
    });
    
    console.log('创建响应状态:', createResponse.status);
    
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      createdProductId = createResult.data.id;
      console.log('✅ 创建成功! 产品ID:', createdProductId);
      console.log('变体数量:', createResult.data.variants.length);
    } else {
      const errorText = await createResponse.text();
      console.log('❌ 创建失败:', errorText);
      return;
    }
    
    // 2. 测试获取产品列表
    console.log('\n2️⃣ 测试获取产品列表...');
    const listResponse = await fetch(`${BASE_URL}/api/admin/products`);
    console.log('列表响应状态:', listResponse.status);
    
    if (listResponse.ok) {
      const listResult = await listResponse.json();
      console.log('✅ 获取列表成功! 产品数量:', listResult.data.length);
      
      // 验证我们创建的产品是否在列表中
      const ourProduct = listResult.data.find(p => p.id === createdProductId);
      if (ourProduct) {
        console.log('✅ 创建的产品在列表中找到');
      } else {
        console.log('❌ 创建的产品在列表中未找到');
      }
    } else {
      console.log('❌ 获取列表失败');
    }
    
    // 3. 测试获取单个产品
    console.log('\n3️⃣ 测试获取单个产品...');
    const getResponse = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`);
    console.log('获取单个产品响应状态:', getResponse.status);
    
    if (getResponse.ok) {
      const getResult = await getResponse.json();
      console.log('✅ 获取单个产品成功!');
      console.log('产品名称:', getResult.data.nameEn);
      console.log('变体数量:', getResult.data.variants.length);
    } else {
      console.log('❌ 获取单个产品失败');
    }
    
    // 4. 测试编辑产品
    console.log('\n4️⃣ 测试编辑产品...');
    const editData = {
      nameEn: 'Test Product for All Functions - EDITED',
      descriptionEn: 'Testing all product management functions - EDITED',
      category: 'test',
      isActive: true,
      variants: [
        {
          size: 'S',
          color: 'Red',
          price: 27.99,  // 修改价格
          stock: 12,     // 修改库存
          sku: 'S-Red-TEST'
        },
        {
          size: 'M',
          color: 'Blue',
          price: 32.99,  // 修改价格
          stock: 18,     // 修改库存
          sku: 'M-Blue-TEST'
        },
        {
          size: 'L',     // 新增变体
          color: 'Green',
          price: 35.99,
          stock: 8,
          sku: 'L-Green-TEST'
        }
      ],
      tags: [],
      images: [],
      seoTitle: 'Test Product - EDITED',
      seoDescription: 'Test Description - EDITED',
      seoKeywords: ['test', 'edited']
    };
    
    const editResponse = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}/update-all`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    });
    
    console.log('编辑响应状态:', editResponse.status);
    
    if (editResponse.ok) {
      const editResult = await editResponse.json();
      console.log('✅ 编辑成功!');
      console.log('新产品名称:', editResult.data.nameEn);
      console.log('新变体数量:', editResult.data.variants.length);
      
      // 验证变体数据
      editResult.data.variants.forEach((variant, index) => {
        console.log(`变体 ${index + 1}: ${variant.size}-${variant.color} ¥${variant.price} (库存:${variant.stock})`);
      });
    } else {
      const errorText = await editResponse.text();
      console.log('❌ 编辑失败:', errorText);
    }
    
    // 5. 测试删除产品
    console.log('\n5️⃣ 测试删除产品...');
    const deleteResponse = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
      method: 'DELETE'
    });
    
    console.log('删除响应状态:', deleteResponse.status);
    
    if (deleteResponse.ok) {
      const deleteResult = await deleteResponse.json();
      console.log('✅ 删除成功!');
      console.log('删除结果:', deleteResult.message);
      
      // 验证产品是否真的被删除
      const verifyResponse = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`);
      if (verifyResponse.status === 404) {
        console.log('✅ 验证删除成功 - 产品不再存在');
      } else {
        console.log('❌ 验证删除失败 - 产品仍然存在');
      }
    } else {
      const errorText = await deleteResponse.text();
      console.log('❌ 删除失败:', errorText);
    }
    
    console.log('\n🎉 所有功能测试完成!');
    
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
testAllFunctions();
