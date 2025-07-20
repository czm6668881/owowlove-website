'use client'

import Link from 'next/link'
import { Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  // 使用字符串拼接避免Cloudflare Email Obfuscation
  const getEmail = () => {
    const parts = ['owowlove', '@', '163', '.', 'com']
    return parts.join('')
  }
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-pink-400">OWOWLOVE</h3>
            <p className="text-gray-300 text-sm">
              Premium sexy cosplay and lingerie collection. Discover our exclusive designs for confident women.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/en" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/en/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/en/shipping-info" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/en/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/en/contact" className="text-gray-300 hover:text-pink-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-pink-400" />
                <span className="text-gray-300">{getEmail()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-pink-400" />
                <span className="text-gray-300">Ships from China</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-pink-400" />
                <span className="text-gray-300">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 OWOWLOVE.COM. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/en/contact" className="text-gray-400 hover:text-pink-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/en/contact" className="text-gray-400 hover:text-pink-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
