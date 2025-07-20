// 最终收藏功能测试
console.log('🎯 最终收藏功能测试开始...')

setTimeout(() => {
  console.log('🔍 查找收藏按钮...')
  
  // 查找心形图标
  const hearts = document.querySelectorAll('.lucide-heart')
  console.log(`找到 ${hearts.length} 个心形图标`)
  
  if (hearts.length > 0) {
    const firstHeart = hearts[0]
    const button = firstHeart.closest('button')
    
    if (button) {
      console.log('✅ 找到收藏按钮')
      console.log('📋 按钮信息:', {
        title: button.title,
        heartClass: firstHeart.className
      })
      
      // 检查localStorage初始状态
      const initialFavorites = localStorage.getItem('favorites')
      console.log('📱 初始localStorage:', initialFavorites)
      
      // 点击按钮
      console.log('🖱️ 点击收藏按钮...')
      button.click()
      
      // 等待状态更新
      setTimeout(() => {
        const afterFavorites = localStorage.getItem('favorites')
        const newHeartClass = firstHeart.className
        const newTitle = button.title
        
        console.log('📱 点击后localStorage:', afterFavorites)
        console.log('💖 点击后心形样式:', newHeartClass)
        console.log('📝 点击后按钮标题:', newTitle)
        
        // 检查是否有变化
        const hasChanged = 
          initialFavorites !== afterFavorites ||
          newHeartClass.includes('fill-pink-600')
        
        if (hasChanged) {
          console.log('🎉 收藏功能正常工作！')
          
          // 再次点击测试取消收藏
          console.log('🔄 测试取消收藏...')
          button.click()
          
          setTimeout(() => {
            const finalFavorites = localStorage.getItem('favorites')
            const finalHeartClass = firstHeart.className
            
            console.log('📱 最终localStorage:', finalFavorites)
            console.log('💖 最终心形样式:', finalHeartClass)
            
            if (finalFavorites !== afterFavorites) {
              console.log('✅ 取消收藏也正常工作！')
              console.log('🎊 收藏功能完全修复成功！')
            } else {
              console.log('⚠️ 取消收藏可能有问题')
            }
          }, 300)
          
        } else {
          console.log('❌ 收藏功能仍然有问题')
        }
      }, 300)
      
    } else {
      console.log('❌ 心形图标不在按钮内')
    }
  } else {
    console.log('❌ 没有找到心形图标')
  }
}, 2000)
