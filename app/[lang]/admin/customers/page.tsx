'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Search,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  Eye,
  Edit,
  Plus,
  Trash2,
  Save,
  X
} from 'lucide-react'

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  totalOrders: number
  totalSpent: number
  status: 'active' | 'inactive'
  createdAt: string
  lastOrderAt?: string
}

const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    totalOrders: 3,
    totalSpent: 189.97,
    status: 'active',
    createdAt: '2024-12-15T10:30:00Z',
    lastOrderAt: '2025-01-01T10:30:00Z'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    totalOrders: 1,
    totalSpent: 45.99,
    status: 'active',
    createdAt: '2024-12-20T09:15:00Z',
    lastOrderAt: '2025-01-02T09:15:00Z'
  },
  {
    id: '3',
    name: 'Jessica Brown',
    email: 'jessica@example.com',
    totalOrders: 0,
    totalSpent: 0,
    status: 'inactive',
    createdAt: '2024-11-10T14:22:00Z'
  }
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    status: 'active'
  })

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm))
    
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const addCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert('Please fill in name and email fields')
      return
    }

    const customer: Customer = {
      id: Date.now().toString(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      totalOrders: 0,
      totalSpent: 0,
      status: newCustomer.status as 'active' | 'inactive',
      createdAt: new Date().toISOString()
    }

    setCustomers([customer, ...customers])
    setNewCustomer({ name: '', email: '', phone: '', status: 'active' })
    setShowAddForm(false)
    alert('Customer added successfully!')
  }

  const deleteCustomer = (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      setCustomers(customers.filter(customer => customer.id !== customerId))
      alert('Customer deleted successfully!')
    }
  }

  const deleteAllCustomers = () => {
    if (confirm('Are you sure you want to delete ALL customers? This action cannot be undone.')) {
      if (confirm('This will permanently delete all ' + customers.length + ' customers. Are you absolutely sure?')) {
        setCustomers([])
        alert('All customers have been deleted!')
      }
    }
  }

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const averageOrderValue = totalRevenue / customers.reduce((sum, customer) => sum + customer.totalOrders, 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-2">Manage your customer base and relationships</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
          {customers.length > 0 && (
            <Button
              variant="outline"
              onClick={deleteAllCustomers}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
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
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{activeCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">${averageOrderValue.toFixed(2)}</p>
              </div>
              <ShoppingBag className="w-8 h-8 text-orange-600" />
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
                  placeholder="Search customers..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Customer Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Add New Customer</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Name *</Label>
                <Input
                  id="customerName"
                  value={newCustomer.name || ''}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={newCustomer.email || ''}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={newCustomer.phone || ''}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="customerStatus">Status</Label>
                <select
                  id="customerStatus"
                  value={newCustomer.status || 'active'}
                  onChange={(e) => setNewCustomer({...newCustomer, status: e.target.value as 'active' | 'inactive'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button onClick={addCustomer}>
                <Save className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                      {customer.phone && (
                        <>
                          <span>•</span>
                          <Phone className="w-4 h-4" />
                          <span>{customer.phone}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <h4 className="font-medium mb-2">Order Statistics</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>Total Orders: {customer.totalOrders}</div>
                    <div>Total Spent: ${customer.totalSpent.toFixed(2)}</div>
                    {customer.lastOrderAt && (
                      <div>Last Order: {formatDate(customer.lastOrderAt)}</div>
                    )}
                  </div>
                </div>
                
                {customer.address && (
                  <div>
                    <h4 className="font-medium mb-2">Address</h4>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-start space-x-1">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                          <div>{customer.address.street}</div>
                          <div>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</div>
                          <div>{customer.address.country}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Account Info</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined: {formatDate(customer.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View Orders
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit Customer
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteCustomer(customer.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Customers will appear here when they create accounts or place orders.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
