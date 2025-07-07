'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Truck, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react'
import { useUserAuth } from '@/contexts/user-auth-context'
import { Order } from '@/lib/types/user'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useUserAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState('all')

  // Mock orders data - in real app this would come from API
  useEffect(() => {
    if (isAuthenticated && user) {
      // Mock data for demonstration
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          userId: user.id,
          items: [
            {
              id: '1',
              productId: 'prod-1',
              productName: 'Sexy Lace Lingerie Set',
              variantId: 'var-1',
              size: 'M',
              color: 'Black',
              quantity: 1,
              price: 49.99,
              imageUrl: '/images/products/lingerie-1.jpg'
            }
          ],
          subtotal: 49.99,
          shipping: 9.99,
          tax: 5.00,
          total: 64.98,
          status: 'delivered',
          shippingAddress: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address1: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US'
          },
          paymentMethod: 'Credit Card',
          orderDate: '2025-01-01T10:00:00Z',
          estimatedDelivery: '2025-01-05T10:00:00Z',
          trackingNumber: 'TRK123456789'
        },
        {
          id: 'ORD-002',
          userId: user.id,
          items: [
            {
              id: '2',
              productId: 'prod-2',
              productName: 'Cosplay Outfit - Maid',
              variantId: 'var-2',
              size: 'S',
              color: 'Pink',
              quantity: 1,
              price: 79.99,
              imageUrl: '/images/products/cosplay-1.jpg'
            }
          ],
          subtotal: 79.99,
          shipping: 9.99,
          tax: 8.00,
          total: 97.98,
          status: 'shipped',
          shippingAddress: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            address1: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'US'
          },
          paymentMethod: 'PayPal',
          orderDate: '2025-01-03T14:30:00Z',
          estimatedDelivery: '2025-01-08T14:30:00Z',
          trackingNumber: 'TRK987654321'
        }
      ]
      setOrders(mockOrders)
    }
  }, [isAuthenticated, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'processing':
        return <Package className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true
    return order.status === activeTab
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/en/profile" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-2">Track and manage your orders</p>
          </div>

          {/* Order Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-6">
                      {activeTab === 'all' 
                        ? "You haven't placed any orders yet." 
                        : `No ${activeTab} orders found.`}
                    </p>
                    <Link href="/en">
                      <Button className="bg-pink-600 hover:bg-pink-700">
                        Start Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                            <CardDescription>
                              Placed on {formatDate(order.orderDate)}
                            </CardDescription>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Order Items */}
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.productName}</h4>
                                  <p className="text-sm text-gray-600">
                                    Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium">${item.price.toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Summary */}
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center text-sm">
                              <span>Subtotal:</span>
                              <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Shipping:</span>
                              <span>${order.shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Tax:</span>
                              <span>${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center font-medium text-lg border-t pt-2 mt-2">
                              <span>Total:</span>
                              <span>${order.total.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Tracking Info */}
                          {order.trackingNumber && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                              <p className="text-blue-700">{order.trackingNumber}</p>
                              {order.estimatedDelivery && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Estimated delivery: {formatDate(order.estimatedDelivery)}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex space-x-3">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm">
                                Reorder
                              </Button>
                            )}
                            {(order.status === 'pending' || order.status === 'processing') && (
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                Cancel Order
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  )
}
