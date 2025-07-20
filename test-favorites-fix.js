// 收藏功能修复测试脚本
// 在浏览器控制台中运行此脚本来测试收藏功能

console.log('🔧 测试收藏功能修复...')

// 等待页面完全加载
function waitForPageLoad() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve()
    } else {
      window.addEventListener('load', resolve)
    }
  })
}

// 等待React组件挂载
function waitForReactMount() {
  return new Promise((resolve) => {
    const checkMount = () => {
      const favoriteButtons = document.querySelectorAll('button[title*="favorite"], button[title*="收藏"]')
      const heartIcons = document.querySelectorAll('.lucide-heart')
      
      if (favoriteButtons.length > 0 || heartIcons.length > 0) {
        resolve()
      } else {
        setTimeout(checkMount, 100)
      }
    }
    checkMount()
  })
}

// 测试收藏功能
async function testFavoriteFunction() {
  console.log('\n⏳ 等待页面和组件加载...')
  
  await waitForPageLoad()
  await waitForReactMount()
  
  console.log('\n📋 检查收藏按钮')
  
  // 查找收藏按钮
  let favoriteButtons = document.querySelectorAll('button[title*="favorite"], button[title*="收藏"]')
  
  if (favoriteButtons.length === 0) {
    // 尝试查找包含心形图标的按钮
    const allButtons = document.querySelectorAll('button')
    favoriteButtons = Array.from(allButtons).filter(btn => 
      btn.querySelector('.lucide-heart') || 
      btn.querySelector('svg') ||
      btn.innerHTML.includes('heart')
    )
  }
  
  console.log(`找到 ${favoriteButtons.length} 个可能的收藏按钮`)
  
  if (favoriteButtons.length === 0) {
    console.log('❌ 未找到收藏按钮')
    return false
  }
  
  // 测试第一个收藏按钮
  const firstButton = favoriteButtons[0]
  console.log('🖱️ 测试点击收藏按钮...')
  
  // 记录点击前的状态
  const beforeClick = {
    buttonHTML: firstButton.innerHTML,
    title: firstButton.title,
    classList: Array.from(firstButton.classList)
  }
  
  console.log('点击前状态:', beforeClick)
  
  // 模拟点击
  firstButton.click()
  
  // 等待状态更新
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // 记录点击后的状态
  const afterClick = {
    buttonHTML: firstButton.innerHTML,
    title: firstButton.title,
    classList: Array.from(firstButton.classList)
  }
  
  console.log('点击后状态:', afterClick)
  
  // 检查是否有变化
  const hasChanged = 
    beforeClick.buttonHTML !== afterClick.buttonHTML ||
    beforeClick.title !== afterClick.title
  
  if (hasChanged) {
    console.log('✅ 收藏功能正常工作！状态已改变')
    
    // 检查localStorage
    const favorites = localStorage.getItem('favorites')
    console.log('localStorage中的收藏:', favorites)
    
    return true
  } else {
    console.log('❌ 收藏功能仍然有问题，状态未改变')
    
    // 检查可能的错误
    console.log('🔍 检查可能的问题...')
    
    // 检查是否有JavaScript错误
    console.log('检查控制台是否有错误信息')
    
    // 检查React Context是否正常
    console.log('检查React Context状态...')
    
    return false
  }
}

// 运行测试
testFavoriteFunction().then(success => {
  if (success) {
    console.log('\n🎉 收藏功能修复成功！')
  } else {
    console.log('\n❌ 收藏功能仍需进一步调试')
  }
}).catch(error => {
  console.error('\n💥 测试过程中出现错误:', error)
})
