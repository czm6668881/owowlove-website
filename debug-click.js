// 调试点击事件
console.log('🔍 调试点击事件...')

setTimeout(() => {
  // 查找心形图标
  const hearts = document.querySelectorAll('.lucide-heart')
  console.log(`找到 ${hearts.length} 个心形图标`)
  
  if (hearts.length > 0) {
    const firstHeart = hearts[0]
    const button = firstHeart.closest('button')
    
    if (button) {
      console.log('✅ 找到收藏按钮')
      console.log('按钮详情:', {
        tagName: button.tagName,
        className: button.className,
        title: button.title,
        disabled: button.disabled,
        onclick: button.onclick ? 'has onclick' : 'no onclick'
      })
      
      // 检查是否有事件监听器
      console.log('检查事件监听器...')
      
      // 手动触发点击事件
      console.log('🖱️ 手动触发点击事件...')
      
      // 方法1: 直接调用click()
      console.log('方法1: button.click()')
      button.click()
      
      setTimeout(() => {
        // 方法2: 创建并分发点击事件
        console.log('方法2: dispatchEvent')
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        })
        button.dispatchEvent(clickEvent)
        
        setTimeout(() => {
          // 方法3: 模拟鼠标事件序列
          console.log('方法3: 鼠标事件序列')
          const mouseDown = new MouseEvent('mousedown', { bubbles: true })
          const mouseUp = new MouseEvent('mouseup', { bubbles: true })
          const click = new MouseEvent('click', { bubbles: true })
          
          button.dispatchEvent(mouseDown)
          button.dispatchEvent(mouseUp)
          button.dispatchEvent(click)
          
          console.log('✅ 所有点击测试完成，请查看控制台输出')
        }, 500)
      }, 500)
      
    } else {
      console.log('❌ 心形图标不在按钮内')
    }
  } else {
    console.log('❌ 没有找到心形图标')
  }
}, 2000)
