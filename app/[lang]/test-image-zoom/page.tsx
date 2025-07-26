'use client'

import { CustomerReviewsCarousel } from '@/components/customer-reviews/customer-reviews-carousel'

export default function TestImageZoomPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">买家秀图片缩放功能测试</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">新增功能特点</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ 点击买家秀图片可以放大查看</li>
            <li>✅ 模态框显示完整的图片和评论内容</li>
            <li>✅ 支持多张图片的导航切换</li>
            <li>✅ 显示完整的评论文字（不截断）</li>
            <li>✅ 显示星级评分、客户信息、产品信息</li>
            <li>✅ 响应式设计，适配桌面和移动设备</li>
            <li>✅ 点击关闭按钮或背景可关闭模态框</li>
            <li>✅ 保持原有的轮播功能不变</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">使用说明</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>在下方的买家秀轮播中，点击任意一张图片</li>
            <li>图片会在模态框中放大显示</li>
            <li>右侧显示完整的评论内容和客户信息</li>
            <li>如果有多张图片，可以点击底部的圆点切换</li>
            <li>点击右上角的 X 按钮或点击背景可关闭</li>
          </ol>
        </div>
        
        {/* 买家秀轮播组件 */}
        <CustomerReviewsCarousel />
      </div>
    </div>
  )
}
