'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  User,
  Trash2
} from 'lucide-react'

interface OrderItem {
  id: string
  productId: string
  productName: string
  variantId: string
  size: string
  color: string
  price: number
  quantity: number
  sku: string
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: OrderItem[]
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2025-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    status: 'processing',
    total: 89.97,
    items: [
      {
        id: '1',
        productId: '2',
        productName: 'Sexy Crotchless net',
        variantId: '1751283590892',
        size: '均码',
        color: 'Black',
        price: 19.99,
        quantity: 2,
        sku: '均码-Black-1751283590892'
      }
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: '2025-01-01T10:30:00Z',
    updatedAt: '2025-01-01T14:20:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-002',
    customerName: 'Emma Wilson',
    customerEmail: 'emma@example.com',
    status: 'shipped',
    total: 45.99,
    items: [
      {
        id: '2',
        productId: '2',
        productName: 'Sexy Crotchless net',
        variantId: '1751283590892',
        size: '均码',
        color: 'Black',
        price: 19.99,
        quantity: 1,
        sku: '均码-Black-1751283590892'
      }
    ],
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    createdAt: '2025-01-02T09:15:00Z',
    updatedAt: '2025-01-02T16:45:00Z'
  }
]

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

const statusIcons = {
  pending: Calendar,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ))
  }

  const deleteOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      setOrders(orders.filter(order => order.id !== orderId))
      alert('Order deleted successfully!')
    }
  }

  const deleteAllOrders = async () => {
    if (confirm('Are you sure you want to delete ALL orders? This action cannot be undone and will remove all order data.')) {
      if (confirm('This will permanently delete all ' + orders.length + ' orders. Are you absolutely sure?')) {
        setOrders([])
        alert('All orders have been deleted!')
      }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-2">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex space-x-2">
          {orders.length > 0 && (
            <Button
              variant="outline"
              onClick={deleteAllOrders}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Orders
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'processing').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shipped</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'shipped').length}
                </p>
              </div>
              <Truck className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders, customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const StatusIcon = statusIcons[order.status]
          
          return (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{order.customerName}</span>
                        <span>•</span>
                        <span>{order.customerEmail}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={statusColors[order.status]}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <span className="font-semibold text-lg">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium mb-2">Order Items</h4>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="text-sm text-gray-600">
                          {item.quantity}x {item.productName} ({item.size}, {item.color}) - ${item.price.toFixed(2)}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Shipping Address</h4>
                    <div className="text-sm text-gray-600">
                      <div>{order.shippingAddress.street}</div>
                      <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</div>
                      <div>{order.shippingAddress.country}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Created: {formatDate(order.createdAt)} • Updated: {formatDate(order.updatedAt)}
                  </div>
                  
                  <div className="flex space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className="px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteOrder(order.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Orders will appear here when customers make purchases.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
