'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  CreditCard, 
  RefreshCw, 
  Edit, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Wallet,
  Smartphone
} from 'lucide-react'
import { PaymentMethod } from '@/lib/types/payment'
import { useAdminAuth } from '@/contexts/admin-auth-context'

export default function AdminPaymentMethodsPage() {
  const { isAuthenticated } = useAdminAuth()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadPaymentMethods()
    }
  }, [isAuthenticated])

  const loadPaymentMethods = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/admin/payment/methods')
      const result = await response.json()

      if (result.success) {
        setPaymentMethods(result.data || [])
      } else {
        setError(result.error || 'Failed to load payment methods')
      }
    } catch (error) {
      console.error('Error loading payment methods:', error)
      setError('Failed to load payment methods')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMethod = async (updates: Partial<PaymentMethod>) => {
    if (!selectedMethod) return

    try {
      setIsUpdating(true)
      setError('')

      const response = await fetch('/api/admin/payment/methods', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedMethod.id,
          ...updates
        })
      })

      const result = await response.json()

      if (result.success) {
        // Refresh payment methods
        await loadPaymentMethods()
        // Close dialog
        setSelectedMethod(null)
      } else {
        setError(result.error || 'Update failed')
      }
    } catch (error) {
      console.error('Error updating payment method:', error)
      setError('Failed to update payment method')
    } finally {
      setIsUpdating(false)
    }
  }

  const getPaymentIcon = (methodName: string) => {
    switch (methodName) {
      case 'alipay':
        return <Wallet className="h-5 w-5 text-blue-600" />
      case 'wechat':
        return <Smartphone className="h-5 w-5 text-green-600" />
      case 'credit_card':
        return <CreditCard className="h-5 w-5 text-purple-600" />
      default:
        return <Wallet className="h-5 w-5 text-gray-600" />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            需要管理员权限才能访问此页面
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">支付方式管理</h1>
            <p className="text-muted-foreground">管理可用的支付方式和配置</p>
          </div>
          <Button onClick={loadPaymentMethods} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总支付方式</p>
                  <p className="text-2xl font-bold">{paymentMethods.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">已启用</p>
                  <p className="text-2xl font-bold">
                    {paymentMethods.filter(m => m.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <XCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">已禁用</p>
                  <p className="text-2xl font-bold">
                    {paymentMethods.filter(m => !m.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Payment Methods Table */}
        <Card>
          <CardHeader>
            <CardTitle>支付方式列表</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <span className="ml-2">加载中...</span>
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                暂无支付方式
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>图标</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>显示名称</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentMethods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell>
                        {getPaymentIcon(method.name)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {method.name}
                      </TableCell>
                      <TableCell>
                        {method.display_name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={method.is_active ? 'default' : 'secondary'}>
                          {method.is_active ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              启用
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              禁用
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {method.sort_order}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedMethod(method)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>编辑支付方式</DialogTitle>
                              <DialogDescription>
                                修改支付方式的配置和状态
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedMethod && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>内部名称</Label>
                                    <Input 
                                      value={selectedMethod.name} 
                                      disabled 
                                      className="bg-muted"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="display-name">显示名称</Label>
                                    <Input
                                      id="display-name"
                                      value={selectedMethod.display_name}
                                      onChange={(e) => setSelectedMethod({
                                        ...selectedMethod,
                                        display_name: e.target.value
                                      })}
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="sort-order">排序顺序</Label>
                                    <Input
                                      id="sort-order"
                                      type="number"
                                      value={selectedMethod.sort_order}
                                      onChange={(e) => setSelectedMethod({
                                        ...selectedMethod,
                                        sort_order: parseInt(e.target.value) || 0
                                      })}
                                    />
                                  </div>
                                  <div className="flex items-center space-x-2 pt-6">
                                    <Switch
                                      id="is-active"
                                      checked={selectedMethod.is_active}
                                      onCheckedChange={(checked) => setSelectedMethod({
                                        ...selectedMethod,
                                        is_active: checked
                                      })}
                                    />
                                    <Label htmlFor="is-active">启用此支付方式</Label>
                                  </div>
                                </div>

                                <div className="flex space-x-2 pt-4">
                                  <Button 
                                    onClick={() => handleUpdateMethod({
                                      display_name: selectedMethod.display_name,
                                      sort_order: selectedMethod.sort_order,
                                      is_active: selectedMethod.is_active
                                    })}
                                    disabled={isUpdating}
                                    className="flex-1"
                                  >
                                    {isUpdating ? '更新中...' : '保存更改'}
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => setSelectedMethod(null)}
                                    className="flex-1"
                                  >
                                    取消
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
