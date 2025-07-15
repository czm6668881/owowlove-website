#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndAddDescriptions() {
  console.log('🔍 检查和添加产品描述...');
  
  try {
    // 获取所有产品
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, description, price')
      .eq('is_active', true);
    
    if (error) {
      console.error('❌ 获取产品失败:', error);
      return;
    }
    
    console.log(`📦 找到 ${products.length} 个活跃产品`);
    
    // 检查每个产品的描述
    for (const product of products) {
      console.log(`\n🔍 检查产品: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   当前描述: '${product.description || ''}'`);
      console.log(`   描述长度: ${product.description ? product.description.length : 0} 字符`);
      
      // 如果描述为空或只有空白字符，添加默认描述
      if (!product.description || product.description.trim() === '') {
        let newDescription = '';
        
        // 根据产品名称生成合适的描述
        if (product.name.toLowerCase().includes('cow') && product.name.toLowerCase().includes('bikini')) {
          newDescription = 'Adorable cow-themed bikini set featuring playful black and white pattern. Perfect for costume parties, themed events, or adding fun to your swimwear collection. Made with comfortable, high-quality materials.';
        } else if (product.name.toLowerCase().includes('knight') && product.name.toLowerCase().includes('uniform')) {
          newDescription = 'Elegant and alluring knight-inspired costume featuring medieval design elements. Perfect for role-playing, costume parties, or themed events. Crafted with attention to detail and comfortable fit.';
        } else if (product.name.toLowerCase().includes('spider') && product.name.toLowerCase().includes('succubus')) {
          newDescription = 'Mysterious and captivating spider succubus costume combining dark elegance with supernatural allure. Features intricate web-inspired details and dramatic silhouette. Perfect for Halloween or fantasy-themed events.';
        } else {
          // 通用描述
          newDescription = `Beautiful and stylish ${product.name.toLowerCase()} featuring premium quality materials and elegant design. Perfect for special occasions and adding sophistication to your wardrobe.`;
        }
        
        console.log(`   🔧 添加新描述: "${newDescription}"`);
        
        // 更新数据库
        const { error: updateError } = await supabase
          .from('products')
          .update({ description: newDescription })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`   ❌ 更新失败:`, updateError);
        } else {
          console.log(`   ✅ 描述已更新`);
        }
      } else {
        console.log(`   ✅ 已有描述，无需更新`);
      }
    }
    
    console.log('\n📊 总结:');
    console.log(`   检查了 ${products.length} 个产品`);
    console.log('   所有产品现在都有描述了');
    
    // 验证更新结果
    console.log('\n🔍 验证更新结果...');
    const { data: updatedProducts, error: verifyError } = await supabase
      .from('products')
      .select('id, name, description')
      .eq('is_active', true);
    
    if (verifyError) {
      console.error('❌ 验证失败:', verifyError);
      return;
    }
    
    console.log('\n📋 更新后的产品描述:');
    updatedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   描述: "${product.description}"`);
      console.log(`   长度: ${product.description ? product.description.length : 0} 字符`);
      console.log('');
    });
    
  } catch (error) {
    console.error('💥 脚本执行失败:', error);
  }
}

// 运行脚本
checkAndAddDescriptions().catch(console.error);
