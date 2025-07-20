'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Package, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link 
            href="/en" 
            className="inline-flex items-center text-pink-600 hover:text-pink-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Refunds</h1>
          <p className="text-xl text-gray-600 mb-2">Easy returns and hassle-free refunds</p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. If you're not happy with your order, 
            we're here to help with our simple return and refund process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Return Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2 text-pink-600" />
                  Return Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>30-Day Return Window:</strong> You have 30 days from the date of delivery to return your items.
                  </p>
                  <p>
                    <strong>Item Condition:</strong> Items must be unworn, unwashed, and in original condition with all tags attached.
                  </p>
                  <p>
                    <strong>Original Packaging:</strong> Please return items in their original packaging when possible.
                  </p>
                  <p>
                    <strong>Proof of Purchase:</strong> Please include your order number or receipt with your return.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How to Return */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-pink-600" />
                  How to Return Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Contact Us</h4>
                      <p className="text-sm text-gray-600">
                        Email us at owowlove@163.com with your order number and reason for return.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Get Return Authorization</h4>
                      <p className="text-sm text-gray-600">
                        We'll provide you with a return authorization number and return address.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Ship Your Return</h4>
                      <p className="text-sm text-gray-600">
                        Package your items securely and ship to the provided return address.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Receive Your Refund</h4>
                      <p className="text-sm text-gray-600">
                        Once we receive and process your return, your refund will be issued within 5-7 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Refund Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-pink-600" />
                  Refund Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>Processing Time:</strong> Refunds are processed within 5-7 business days after we receive your return.
                  </p>
                  <p>
                    <strong>Refund Method:</strong> Refunds will be issued to the original payment method used for the purchase.
                  </p>
                  <p>
                    <strong>Shipping Costs:</strong> Original shipping costs are non-refundable unless the return is due to our error.
                  </p>
                  <p>
                    <strong>Return Shipping:</strong> Customers are responsible for return shipping costs unless the item was defective or incorrect.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-pink-600">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-gray-600">owowlove@163.com</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-gray-600">Monday - Friday<br />9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
                <Link href="/en/contact">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Important Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-600">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-orange-800 font-medium">
                      Please contact us before returning any items to ensure a smooth return process.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-blue-800 font-medium">
                      Items returned without authorization may experience processing delays.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/en/shipping-info" className="block text-sm text-pink-600 hover:text-pink-700">
                  Shipping Information
                </Link>
                <Link href="/en/contact" className="block text-sm text-pink-600 hover:text-pink-700">
                  Contact Us
                </Link>
                <Link href="/en/track-order" className="block text-sm text-pink-600 hover:text-pink-700">
                  Track Your Order
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
