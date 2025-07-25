'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SimpleLoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = () => {
    setIsLoading(true)
    window.location.href = '/api/auth/google'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">OWOWLOVE Login</h1>
        
        {/* 传统登录表单 */}
        <form className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Sign In
          </button>
        </form>

        {/* 分隔线 */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Google登录按钮 */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {/* 测试链接 */}
        <div className="mt-6 space-y-2 text-center text-sm">
          <p>
            <Link href="/en/login" className="text-pink-600 hover:text-pink-700">
              ← 返回原登录页面
            </Link>
          </p>
          <p>
            <Link href="/en/test-google-oauth" className="text-blue-600 hover:text-blue-700">
              Google OAuth 测试页面
            </Link>
          </p>
          <p>
            <a 
              href="/api/auth/google" 
              className="text-green-600 hover:text-green-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              直接访问 Google OAuth API
            </a>
          </p>
        </div>

        {/* 调试信息 */}
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <h3 className="font-semibold mb-2">调试信息:</h3>
          <ul className="space-y-1">
            <li>• 当前环境: {process.env.NODE_ENV}</li>
            <li>• Google OAuth 路由: /api/auth/google</li>
            <li>• 回调路由: /api/auth/google/callback</li>
            <li>• 按钮状态: {isLoading ? '加载中' : '就绪'}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
