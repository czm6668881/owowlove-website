// 最终收藏功能测试
console.log('🎯 最终收藏功能测试')

// 清除现有收藏
localStorage.removeItem('favorites')
console.log('✅ 已清除现有收藏数据')

// 等待页面加载
setTimeout(() => {
  console.log('🔍 开始测试...')
  
  // 查找心形图标
  const hearts = document.querySelectorAll('.lucide-heart')
  console.log(`找到 ${hearts.length} 个心形图标`)
  
  if (hearts.length > 0) {
    const firstHeart = hearts[0]
    const button = firstHeart.closest('button')
    
    if (button) {
      console.log('✅ 找到收藏按钮')
      
      // 记录初始状态
      const initialClass = firstHeart.className
      const initialTitle = button.title
      const initialStorage = localStorage.getItem('favorites')
      
      console.log('📋 初始状态:', {
        heartClass: initialClass,
        title: initialTitle,
        localStorage: initialStorage
      })
      
      // 点击按钮
      console.log('🖱️ 点击收藏按钮...')
      button.click()
      
      // 检查变化
      setTimeout(() => {
        const newClass = firstHeart.className
        const newTitle = button.title
        const newStorage = localStorage.getItem('favorites')
        
        console.log('📋 点击后状态:', {
          heartClass: newClass,
          title: newTitle,
          localStorage: newStorage
        })
        
        // 检查是否有变化
        const classChanged = initialClass !== newClass
        const titleChanged = initialTitle !== newTitle
        const storageChanged = initialStorage !== newStorage
        const hasPinkFill = newClass.includes('fill-pink-600')
        
        console.log('🔍 变化检测:', {
          classChanged,
          titleChanged,
          storageChanged,
          hasPinkFill
        })
        
        if (classChanged || titleChanged || storageChanged || hasPinkFill) {
          console.log('🎉 收藏功能正常工作！')
          
          // 测试取消收藏
          console.log('🔄 测试取消收藏...')
          button.click()
          
          setTimeout(() => {
            const finalClass = firstHeart.className
            const finalStorage = localStorage.getItem('favorites')
            
            console.log('📋 最终状态:', {
              heartClass: finalClass,
              localStorage: finalStorage
            })
            
            if (finalClass !== newClass || finalStorage !== newStorage) {
              console.log('✅ 取消收藏也正常工作！')
              console.log('🎊 收藏功能完全修复成功！')
            } else {
              console.log('⚠️ 取消收藏可能有问题')
            }
          }, 500)
          
        } else {
          console.log('❌ 收藏功能仍然有问题，没有检测到任何变化')
        }
      }, 500)
      
    } else {
      console.log('❌ 心形图标不在按钮内')
    }
  } else {
    console.log('❌ 没有找到心形图标')
  }
}, 3000)
