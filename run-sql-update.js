const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateDescriptions() {
  console.log('🔧 开始更新产品描述...');
  
  try {
    // 更新 Cow Bikini
    console.log('📝 更新 Cow Bikini...');
    const { error: error1 } = await supabase
      .from('products')
      .update({ 
        description: 'Adorable cow-themed bikini set featuring playful black and white pattern. Perfect for costume parties, themed events, or adding fun to your swimwear collection. Made with comfortable, high-quality materials.' 
      })
      .eq('name', 'Cow Bikini');
    
    if (error1) {
      console.error('❌ 更新 Cow Bikini 失败:', error1);
    } else {
      console.log('✅ Cow Bikini 描述已更新');
    }

    // 更新 Sexy knight uniform
    console.log('📝 更新 Sexy knight uniform...');
    const { error: error2 } = await supabase
      .from('products')
      .update({ 
        description: 'Elegant and alluring knight-inspired costume featuring medieval design elements. Perfect for role-playing, costume parties, or themed events. Crafted with attention to detail and comfortable fit.' 
      })
      .eq('name', 'Sexy knight uniform');
    
    if (error2) {
      console.error('❌ 更新 Sexy knight uniform 失败:', error2);
    } else {
      console.log('✅ Sexy knight uniform 描述已更新');
    }

    // 更新 Spider Succubus
    console.log('📝 更新 Spider Succubus...');
    const { error: error3 } = await supabase
      .from('products')
      .update({ 
        description: 'Mysterious and captivating spider succubus costume combining dark elegance with supernatural allure. Features intricate web-inspired details and dramatic silhouette. Perfect for Halloween or fantasy-themed events.' 
      })
      .eq('name', 'Spider Succubus');
    
    if (error3) {
      console.error('❌ 更新 Spider Succubus 失败:', error3);
    } else {
      console.log('✅ Spider Succubus 描述已更新');
    }

    // 验证更新结果
    console.log('\n🔍 验证更新结果...');
    const { data, error } = await supabase
      .from('products')
      .select('name, description')
      .eq('is_active', true);
    
    if (error) {
      console.error('❌ 验证失败:', error);
    } else {
      console.log('\n📋 当前产品描述:');
      data.forEach(product => {
        console.log(`\n• ${product.name}:`);
        console.log(`  "${product.description}"`);
        console.log(`  长度: ${product.description ? product.description.length : 0} 字符`);
      });
    }
    
    console.log('\n🎉 产品描述更新完成！');
    
  } catch (error) {
    console.error('💥 更新过程中出错:', error);
  }
}

updateDescriptions();
