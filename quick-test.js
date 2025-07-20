// 快速测试收藏功能
// 在浏览器控制台中运行

console.log('🚀 快速测试收藏功能...')

// 等待2秒让页面完全加载
setTimeout(() => {
  console.log('🔍 查找收藏按钮...')
  
  // 查找所有可能的收藏按钮
  const buttons = Array.from(document.querySelectorAll('button')).filter(btn => 
    btn.querySelector('.lucide-heart') || 
    btn.title.includes('favorite') ||
    btn.title.includes('收藏')
  )
  
  console.log(`找到 ${buttons.length} 个收藏按钮`)
  
  if (buttons.length > 0) {
    const firstButton = buttons[0]
    console.log('🖱️ 点击第一个收藏按钮...')
    
    // 点击按钮
    firstButton.click()
    
    // 检查控制台输出
    console.log('✅ 点击完成，请查看上方的调试信息')
    console.log('📱 检查localStorage:', localStorage.getItem('favorites'))
  } else {
    console.log('❌ 未找到收藏按钮')
  }
}, 2000)
