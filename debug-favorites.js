// 全面调试收藏功能
// 在浏览器控制台中运行

console.log('🔍 开始全面调试收藏功能...')

// 1. 检查React Context是否正确加载
function checkReactContext() {
  console.log('\n📋 1. 检查React Context状态')
  
  // 检查是否有React DevTools
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('✅ React DevTools 可用')
  } else {
    console.log('⚠️ React DevTools 不可用')
  }
  
  // 检查页面是否有React组件
  const reactElements = document.querySelectorAll('[data-reactroot], [data-react-checksum]')
  console.log(`找到 ${reactElements.length} 个React根元素`)
}

// 2. 检查收藏按钮
function checkFavoriteButtons() {
  console.log('\n🖱️ 2. 检查收藏按钮')
  
  // 查找所有可能的收藏按钮
  const heartButtons = document.querySelectorAll('.lucide-heart')
  const titleButtons = document.querySelectorAll('button[title*="favorite"], button[title*="收藏"]')
  const allButtons = document.querySelectorAll('button')
  
  console.log(`找到 ${heartButtons.length} 个心形图标`)
  console.log(`找到 ${titleButtons.length} 个带收藏标题的按钮`)
  console.log(`总共 ${allButtons.length} 个按钮`)
  
  // 检查每个心形图标的父按钮
  const favoriteButtons = []
  heartButtons.forEach((heart, index) => {
    const button = heart.closest('button')
    if (button) {
      favoriteButtons.push(button)
      console.log(`心形图标 ${index + 1}:`, {
        title: button.title,
        className: button.className,
        onclick: button.onclick ? 'has onclick' : 'no onclick',
        eventListeners: getEventListeners ? getEventListeners(button) : 'getEventListeners not available'
      })
    }
  })
  
  return favoriteButtons
}

// 3. 检查localStorage
function checkLocalStorage() {
  console.log('\n💾 3. 检查localStorage')
  
  const favorites = localStorage.getItem('favorites')
  console.log('favorites in localStorage:', favorites)
  
  if (favorites) {
    try {
      const parsed = JSON.parse(favorites)
      console.log('解析后的收藏数据:', parsed)
      console.log('收藏数量:', parsed.length)
    } catch (error) {
      console.error('解析localStorage数据失败:', error)
    }
  } else {
    console.log('localStorage中没有收藏数据')
  }
}

// 4. 模拟点击测试
function testButtonClick(button, index) {
  console.log(`\n🧪 4. 测试按钮 ${index + 1} 点击`)
  
  // 记录点击前状态
  const beforeState = {
    heartClass: button.querySelector('.lucide-heart')?.className,
    buttonTitle: button.title,
    localStorage: localStorage.getItem('favorites')
  }
  
  console.log('点击前状态:', beforeState)
  
  // 创建并触发点击事件
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  })
  
  console.log('触发点击事件...')
  button.dispatchEvent(clickEvent)
  
  // 等待状态更新
  setTimeout(() => {
    const afterState = {
      heartClass: button.querySelector('.lucide-heart')?.className,
      buttonTitle: button.title,
      localStorage: localStorage.getItem('favorites')
    }
    
    console.log('点击后状态:', afterState)
    
    // 检查是否有变化
    const hasChanged = 
      beforeState.heartClass !== afterState.heartClass ||
      beforeState.buttonTitle !== afterState.buttonTitle ||
      beforeState.localStorage !== afterState.localStorage
    
    if (hasChanged) {
      console.log('✅ 按钮点击有效果！')
    } else {
      console.log('❌ 按钮点击无效果')
    }
  }, 500)
}

// 5. 检查控制台错误
function checkConsoleErrors() {
  console.log('\n🚨 5. 检查控制台错误')
  
  // 重写console.error来捕获错误
  const originalError = console.error
  const errors = []
  
  console.error = function(...args) {
    errors.push(args)
    originalError.apply(console, args)
  }
  
  setTimeout(() => {
    console.error = originalError
    if (errors.length > 0) {
      console.log('发现的错误:', errors)
    } else {
      console.log('没有发现控制台错误')
    }
  }, 1000)
}

// 6. 检查网络请求
function checkNetworkRequests() {
  console.log('\n🌐 6. 检查网络请求')
  
  // 检查是否有相关的API调用
  const originalFetch = window.fetch
  const requests = []
  
  window.fetch = function(...args) {
    requests.push(args[0])
    return originalFetch.apply(this, args)
  }
  
  setTimeout(() => {
    window.fetch = originalFetch
    console.log('捕获的请求:', requests)
  }, 2000)
}

// 主测试函数
async function runFullDiagnostic() {
  console.log('🚀 开始全面诊断...')
  
  // 等待页面完全加载
  if (document.readyState !== 'complete') {
    console.log('等待页面加载完成...')
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve()
      } else {
        window.addEventListener('load', resolve)
      }
    })
  }
  
  // 等待React组件挂载
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  checkReactContext()
  const favoriteButtons = checkFavoriteButtons()
  checkLocalStorage()
  checkConsoleErrors()
  checkNetworkRequests()
  
  // 如果找到收藏按钮，测试第一个
  if (favoriteButtons.length > 0) {
    console.log('\n🎯 测试第一个收藏按钮...')
    testButtonClick(favoriteButtons[0], 0)
  } else {
    console.log('\n❌ 没有找到可测试的收藏按钮')
  }
  
  console.log('\n📊 诊断完成！请查看上方的详细信息。')
}

// 运行诊断
runFullDiagnostic().catch(error => {
  console.error('诊断过程中出现错误:', error)
})
