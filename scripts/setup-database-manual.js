// Manual database setup guide
const fs = require('fs')
const path = require('path')

console.log('🚀 OWOWLOVE.COM 数据库设置指南')
console.log('=' * 50)

console.log('\n📋 您需要在Supabase控制台中手动执行以下SQL脚本：')

console.log('\n1️⃣ 第一步：打开Supabase控制台')
console.log('   - 访问：https://supabase.com/dashboard')
console.log('   - 登录您的账号')
console.log('   - 选择项目：zzexacrffmxmqrqamcxo')

console.log('\n2️⃣ 第二步：打开SQL编辑器')
console.log('   - 点击左侧菜单 "SQL Editor"')
console.log('   - 点击 "New query" 创建新查询')

console.log('\n3️⃣ 第三步：执行第一个迁移脚本')
console.log('   复制以下内容到SQL编辑器中并点击 "Run"：')
console.log('\n' + '='.repeat(60))

try {
  const schema = fs.readFileSync('supabase/migrations/001_initial_schema.sql', 'utf8')
  console.log(schema)
} catch (error) {
  console.error('❌ 无法读取 001_initial_schema.sql')
}

console.log('\n' + '='.repeat(60))

console.log('\n4️⃣ 第四步：执行第二个迁移脚本')
console.log('   复制以下内容到SQL编辑器中并点击 "Run"：')
console.log('\n' + '='.repeat(60))

try {
  const policies = fs.readFileSync('supabase/migrations/002_security_policies.sql', 'utf8')
  console.log(policies)
} catch (error) {
  console.error('❌ 无法读取 002_security_policies.sql')
}

console.log('\n' + '='.repeat(60))

console.log('\n5️⃣ 第五步：验证设置')
console.log('   执行完成后，运行以下命令验证：')
console.log('   node test-supabase-connection.js')

console.log('\n✅ 完成后您的网站将拥有完整的数据库功能！')
