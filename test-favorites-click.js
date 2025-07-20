// 测试收藏按钮点击功能
console.log('🔍 测试收藏按钮点击功能...')

setTimeout(() => {
  console.log('查找心形图标...')
  const hearts = document.querySelectorAll('.lucide-heart')
  console.log(`找到 ${hearts.length} 个心形图标`)
  
  if (hearts.length > 0) {
    const firstHeart = hearts[0]
    const button = firstHeart.closest('button')
    
    if (button) {
      console.log('找到收藏按钮，准备点击...')
      console.log('按钮信息:', {
        title: button.title,
        className: button.className
      })
      
      // 点击按钮
      button.click()
      console.log('✅ 已点击按钮，请查看控制台输出')
    } else {
      console.log('❌ 心形图标没有在按钮内')
    }
  } else {
    console.log('❌ 没有找到心形图标')
  }
}, 3000)
