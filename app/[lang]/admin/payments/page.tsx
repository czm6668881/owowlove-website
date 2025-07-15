'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
  Eye, 
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { PaymentTransaction } from '@/lib/types/payment'
import { useAdminAuth } from '@/contexts/admin-auth-context'

export default function AdminPaymentsPage() {
  const { isAuthenticated } = useAdminAuth()
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [isProcessingRefund, setIsProcessingRefund] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions()
    }
  }, [isAuthenticated])

  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch('/api/admin/payment/transactions')
      const result = await response.json()

      if (result.success) {
        setTransactions(result.data || [])
      } else {
        setError(result.error || 'Failed to load transactions')
      }
    } catch (error) {
      console.error('Error loading transactions:', error)
      setError('Failed to load payment transactions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefund = async () => {
    if (!selectedTransaction) return

    try {
      setIsProcessingRefund(true)
      setError('')

      const amount = refundAmount ? parseFloat(refundAmount) : selectedTransaction.amount

      const response = await fetch('/api/payment/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transaction_id: selectedTransaction.id,
          amount: amount,
          reason: refundReason || '管理员发起退款'
        })
      })

      const result = await response.json()

      if (result.success) {
        // Refresh transactions
        await loadTransactions()
        // Close dialog
        setSelectedTransaction(null)
        setRefundAmount('')
        setRefundReason('')
      } else {
        setError(result.error || 'Refund failed')
      }
    } catch (error) {
      console.error('Error processing refund:', error)
      setError('Failed to process refund')
    } finally {
      setIsProcessingRefund(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'refunded':
        return <RotateCcw className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'pending':
      case 'processing':
        return 'secondary'
      case 'failed':
      case 'cancelled':
        return 'destructive'
      case 'refunded':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
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
            <h1 className="text-3xl font-bold">支付管理</h1>
            <p className="text-muted-foreground">管理所有支付交易和退款</p>
          </div>
          <Button onClick={loadTransactions} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总交易数</p>
                  <p className="text-2xl font-bold">{transactions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">成功支付</p>
                  <p className="text-2xl font-bold">
                    {transactions.filter(t => t.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">待处理</p>
                  <p className="text-2xl font-bold">
                    {transactions.filter(t => t.status === 'pending' || t.status === 'processing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <RotateCcw className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">已退款</p>
                  <p className="text-2xl font-bold">
                    {transactions.filter(t => t.status === 'refunded').length}
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

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>支付交易记录</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin" />
                <span className="ml-2">加载中...</span>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                暂无支付记录
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易ID</TableHead>
                    <TableHead>订单ID</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead>支付方式</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-sm">
                        {transaction.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {transaction.order_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        ¥{transaction.amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {transaction.provider}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{transaction.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(transaction.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedTransaction(transaction)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>交易详情</DialogTitle>
                                <DialogDescription>
                                  查看和管理支付交易
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedTransaction && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <Label>交易ID</Label>
                                      <p className="font-mono">{selectedTransaction.id}</p>
                                    </div>
                                    <div>
                                      <Label>订单ID</Label>
                                      <p className="font-mono">{selectedTransaction.order_id}</p>
                                    </div>
                                    <div>
                                      <Label>金额</Label>
                                      <p>¥{selectedTransaction.amount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <Label>支付方式</Label>
                                      <p>{selectedTransaction.provider}</p>
                                    </div>
                                    <div>
                                      <Label>状态</Label>
                                      <Badge variant={getStatusVariant(selectedTransaction.status)}>
                                        {getStatusIcon(selectedTransaction.status)}
                                        <span className="ml-1">{selectedTransaction.status}</span>
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>创建时间</Label>
                                      <p>{formatDate(selectedTransaction.created_at)}</p>
                                    </div>
                                  </div>

                                  {selectedTransaction.status === 'completed' && (
                                    <div className="border-t pt-4">
                                      <h4 className="font-medium mb-2">退款操作</h4>
                                      <div className="space-y-2">
                                        <div>
                                          <Label htmlFor="refund-amount">退款金额 (留空为全额退款)</Label>
                                          <Input
                                            id="refund-amount"
                                            type="number"
                                            step="0.01"
                                            max={selectedTransaction.amount}
                                            value={refundAmount}
                                            onChange={(e) => setRefundAmount(e.target.value)}
                                            placeholder={`最大: ¥${selectedTransaction.amount.toFixed(2)}`}
                                          />
                                        </div>
                                        <div>
                                          <Label htmlFor="refund-reason">退款原因</Label>
                                          <Input
                                            id="refund-reason"
                                            value={refundReason}
                                            onChange={(e) => setRefundReason(e.target.value)}
                                            placeholder="请输入退款原因"
                                          />
                                        </div>
                                        <Button 
                                          onClick={handleRefund}
                                          disabled={isProcessingRefund}
                                          variant="destructive"
                                          className="w-full"
                                        >
                                          <RotateCcw className="h-4 w-4 mr-2" />
                                          {isProcessingRefund ? '处理中...' : '确认退款'}
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
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
