// 收藏功能测试脚本
// 在浏览器控制台中运行此脚本来测试收藏功能

console.log('🧪 开始测试收藏功能...')

// 测试1: 检查收藏按钮是否存在
function testFavoriteButtonsExist() {
  console.log('\n📋 测试1: 检查收藏按钮')
  
  const favoriteButtons = document.querySelectorAll('button[title*="favorite"], button[title*="收藏"]')
  const heartIcons = document.querySelectorAll('.lucide-heart')
  
  console.log(`找到 ${favoriteButtons.length} 个收藏按钮`)
  console.log(`找到 ${heartIcons.length} 个心形图标`)
  
  if (favoriteButtons.length > 0) {
    console.log('✅ 收藏按钮存在')
    return true
  } else {
    console.log('❌ 未找到收藏按钮')
    return false
  }
}

// 测试2: 模拟点击收藏按钮
function testFavoriteButtonClick() {
  console.log('\n🖱️ 测试2: 模拟点击收藏按钮')
  
  const favoriteButtons = document.querySelectorAll('button[title*="favorite"], button[title*="收藏"]')
  
  if (favoriteButtons.length === 0) {
    // 尝试查找包含心形图标的按钮
    const heartButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
      btn.querySelector('.lucide-heart') || btn.querySelector('svg')
    )
    
    if (heartButtons.length > 0) {
      console.log(`找到 ${heartButtons.length} 个可能的收藏按钮`)
      const firstButton = heartButtons[0]
      
      console.log('尝试点击第一个收藏按钮...')
      firstButton.click()
      
      setTimeout(() => {
        console.log('✅ 点击完成，请检查收藏状态是否改变')
      }, 100)
      
      return true
    } else {
      console.log('❌ 未找到可点击的收藏按钮')
      return false
    }
  } else {
    console.log('点击第一个收藏按钮...')
    favoriteButtons[0].click()
    
    setTimeout(() => {
      console.log('✅ 点击完成，请检查收藏状态是否改变')
    }, 100)
    
    return true
  }
}

// 测试3: 检查localStorage中的收藏数据
function testFavoritesStorage() {
  console.log('\n💾 测试3: 检查收藏数据存储')
  
  const favoritesData = localStorage.getItem('favorites')
  
  if (favoritesData) {
    try {
      const favorites = JSON.parse(favoritesData)
      console.log(`✅ 找到收藏数据: ${favorites.length} 个商品`)
      console.log('收藏列表:', favorites)
      return true
    } catch (error) {
      console.log('❌ 收藏数据格式错误:', error)
      return false
    }
  } else {
    console.log('⚠️ 暂无收藏数据')
    return false
  }
}

// 测试4: 检查收藏图标状态
function testFavoriteIconState() {
  console.log('\n🎨 测试4: 检查收藏图标状态')
  
  const heartIcons = document.querySelectorAll('.lucide-heart')
  let filledHearts = 0
  let emptyHearts = 0
  
  heartIcons.forEach(icon => {
    const isFilled = icon.classList.contains('fill-pink-600') || 
                    icon.classList.contains('fill-red-500') ||
                    icon.style.fill !== '' && icon.style.fill !== 'none'
    
    if (isFilled) {
      filledHearts++
    } else {
      emptyHearts++
    }
  })
  
  console.log(`✅ 已收藏图标: ${filledHearts} 个`)
  console.log(`⚪ 未收藏图标: ${emptyHearts} 个`)
  
  return { filled: filledHearts, empty: emptyHearts }
}

// 运行所有测试
function runAllTests() {
  console.log('🚀 开始完整测试...')
  
  const test1 = testFavoriteButtonsExist()
  const test3 = testFavoritesStorage()
  const test4 = testFavoriteIconState()
  
  console.log('\n📊 测试结果总结:')
  console.log(`收藏按钮: ${test1 ? '✅' : '❌'}`)
  console.log(`数据存储: ${test3 ? '✅' : '⚠️'}`)
  console.log(`图标状态: ✅`)
  
  console.log('\n🎯 手动测试步骤:')
  console.log('1. 点击任意商品的心形图标')
  console.log('2. 观察图标是否变为粉色填充')
  console.log('3. 检查右上角收藏数量是否增加')
  console.log('4. 再次点击同一图标，观察是否取消收藏')
  
  // 提供手动测试函数
  window.testFavoriteClick = testFavoriteButtonClick
  console.log('\n💡 提示: 运行 testFavoriteClick() 来模拟点击收藏按钮')
}

// 自动运行测试
runAllTests()
