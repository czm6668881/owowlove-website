// 验证数据库设置并启动网站
const { spawn } = require('child_process')

console.log('🧪 验证数据库设置...')
console.log('=' * 40)

// Run the test script
const testProcess = spawn('node', ['test-supabase-connection.js'], {
  stdio: 'pipe'
})

let testOutput = ''
testProcess.stdout.on('data', (data) => {
  testOutput += data.toString()
})

testProcess.stderr.on('data', (data) => {
  testOutput += data.toString()
})

testProcess.on('close', (code) => {
  console.log(testOutput)
  
  // Count successful tables
  const accessibleCount = (testOutput.match(/✅.*accessible/g) || []).length
  const totalTables = 6
  
  if (accessibleCount === totalTables) {
    console.log('\n🎉 数据库设置完全成功！')
    console.log(`✅ 所有 ${totalTables} 个表都已创建并可访问`)
    console.log('\n📊 创建的表:')
    console.log('   ✅ categories - 产品分类')
    console.log('   ✅ products - 产品目录')
    console.log('   ✅ users - 用户账户')
    console.log('   ✅ orders - 订单管理')
    console.log('   ✅ favorites - 用户收藏')
    console.log('   ✅ contact_messages - 联系消息')
    
    console.log('\n🚀 正在启动网站...')
    
    // Start the development server
    const devProcess = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    })
    
    devProcess.on('error', (error) => {
      console.error('❌ 启动失败:', error.message)
      console.log('\n💡 请手动启动:')
      console.log('   npm run dev')
    })
    
  } else if (accessibleCount > 0) {
    console.log(`\n⚠️  部分设置成功 (${accessibleCount}/${totalTables} 个表)`)
    console.log('💡 请检查SQL执行是否完整，或重新执行SQL脚本')
    
  } else {
    console.log('\n❌ 数据库表尚未创建')
    console.log('\n📋 请按照以下步骤操作:')
    console.log('1. 确保已打开 Supabase SQL 编辑器')
    console.log('2. 复制 FINAL_SETUP.sql 的全部内容')
    console.log('3. 粘贴到 SQL 编辑器中')
    console.log('4. 点击 "Run" 按钮执行')
    console.log('5. 执行完成后重新运行: node verify-and-start.js')
    
    console.log('\n🔗 快速链接:')
    console.log('   https://supabase.com/dashboard/project/zzexacrffmxmqrqamcxo/sql/new')
  }
})

testProcess.on('error', (error) => {
  console.error('❌ 验证过程出错:', error.message)
})
