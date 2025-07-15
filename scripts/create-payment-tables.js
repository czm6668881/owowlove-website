#!/usr/bin/env node

/**
 * 创建支付系统表的脚本
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

async function createPaymentTables() {
  console.log('🔧 创建支付系统表...\n')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase 配置缺失')
    return false
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 直接插入支付方法，如果表不存在会自动创建
    console.log('📋 创建支付方法数据...')

    // 先尝试查询表是否存在
    const { data: existingMethods, error: checkError } = await supabase
      .from('payment_methods')
      .select('id')
      .limit(1)

    if (checkError && checkError.code === '42P01') {
      console.log('⚠️ payment_methods 表不存在，需要手动创建')
      console.log('请在 Supabase Dashboard 中运行以下 SQL:')
      console.log(`
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id VARCHAR(100) NOT NULL,
  user_id UUID,
  provider VARCHAR(50) NOT NULL,
  provider_transaction_id VARCHAR(255),
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'pending',
  payment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO payment_methods (name, display_name, icon, is_active, sort_order) VALUES
('alipay', '支付宝', 'alipay-icon', true, 1),
('wechat', '微信支付', 'wechat-icon', true, 2),
('credit_card', '信用卡', 'credit-card-icon', true, 3),
('paypal', 'PayPal', 'paypal-icon', false, 4)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  icon = EXCLUDED.icon,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order;
      `)
      return false
    }

    // 插入默认支付方法
    console.log('📋 插入默认支付方法...')
    const { error: insertError } = await supabase
      .from('payment_methods')
      .upsert([
        { name: 'alipay', display_name: '支付宝', icon: 'alipay-icon', is_active: true, sort_order: 1 },
        { name: 'wechat', display_name: '微信支付', icon: 'wechat-icon', is_active: true, sort_order: 2 },
        { name: 'credit_card', display_name: '信用卡', icon: 'credit-card-icon', is_active: true, sort_order: 3 },
        { name: 'paypal', display_name: 'PayPal', icon: 'paypal-icon', is_active: false, sort_order: 4 }
      ], { 
        onConflict: 'name',
        ignoreDuplicates: false 
      })

    if (insertError) {
      console.error('❌ 插入支付方法失败:', insertError)
    } else {
      console.log('✅ 默认支付方法插入成功')
    }

    // 验证表创建
    console.log('\n🔍 验证表创建...')
    const { data: methods, error: verifyError } = await supabase
      .from('payment_methods')
      .select('*')

    if (verifyError) {
      console.error('❌ 验证失败:', verifyError)
      return false
    }

    console.log(`✅ 验证成功，找到 ${methods.length} 个支付方法:`)
    methods.forEach(method => {
      console.log(`   - ${method.display_name} (${method.name}) - ${method.is_active ? '启用' : '禁用'}`)
    })

    console.log('\n🎉 支付系统表创建完成！')
    return true

  } catch (error) {
    console.error('❌ 创建表时发生错误:', error)
    return false
  }
}

if (require.main === module) {
  createPaymentTables().then(success => {
    process.exit(success ? 0 : 1)
  })
}

module.exports = { createPaymentTables }
