require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateDescriptions() {
  console.log('🔧 更新产品描述...');
  
  // 产品描述映射
  const descriptions = {
    'Cow Bikini': 'Adorable cow-themed bikini set featuring playful black and white pattern. Perfect for costume parties, themed events, or adding fun to your swimwear collection. Made with comfortable, high-quality materials.',
    'Sexy knight uniform': 'Elegant and alluring knight-inspired costume featuring medieval design elements. Perfect for role-playing, costume parties, or themed events. Crafted with attention to detail and comfortable fit.',
    'Spider Succubus': 'Mysterious and captivating spider succubus costume combining dark elegance with supernatural allure. Features intricate web-inspired details and dramatic silhouette. Perfect for Halloween or fantasy-themed events.'
  };
  
  try {
    for (const [name, description] of Object.entries(descriptions)) {
      console.log(`📝 更新 "${name}" 的描述...`);
      
      const { error } = await supabase
        .from('products')
        .update({ description })
        .eq('name', name);
      
      if (error) {
        console.error(`❌ 更新 "${name}" 失败:`, error);
      } else {
        console.log(`✅ "${name}" 描述已更新`);
      }
    }
    
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
        console.log(`• ${product.name}: "${product.description}"`);
      });
    }
    
  } catch (error) {
    console.error('💥 更新失败:', error);
  }
}

updateDescriptions();
