'use client'

import { CustomerReviewsCarousel } from '@/components/customer-reviews/customer-reviews-carousel'

export default function TestBuyerReviewsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">买家秀测试页面</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">买家秀设计特点</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ 黑色背景，突出产品图片</li>
            <li>✅ 紧凑的产品图片展示（4:5比例，更节省空间）</li>
            <li>✅ 粉色五星评分系统（统一显示5星）</li>
            <li>✅ 客户姓名显示（已去掉蓝色验证标识）</li>
            <li>✅ 评论文字内容（更小字体，最多2行显示）</li>
            <li>✅ 白色圆角卡片设计</li>
            <li>✅ 明显的白色左右导航箭头（更大尺寸）</li>
            <li>✅ 响应式设计（桌面4张，平板2张，手机1张）</li>
            <li>✅ 整体区域更紧凑（减少上下边距）</li>
          </ul>
        </div>

        {/* 买家秀轮播组件 */}
        <CustomerReviewsCarousel />
        
        <div className="text-center mt-8">
          <p className="text-gray-600">
            买家秀功能已按照您提供的设计图片重新设计！现在采用黑色背景的卡片式轮播展示。
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>• 桌面端显示4张卡片</p>
            <p>• 平板端显示2张卡片</p>
            <p>• 手机端显示1张卡片</p>
            <p>• 点击左右箭头可以切换显示</p>
          </div>
        </div>
      </div>
    </div>
  )
}
