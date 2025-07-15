'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  PaymentMethod, 
  PaymentTransaction, 
  PaymentContextType,
  CreatePaymentRequest,
  CreatePaymentResponse,
  PaymentStatusResponse,
  RefundRequest,
  RefundResponse
} from '@/lib/types/payment'

// Create context
const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

// Payment provider
export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | undefined>()
  const [currentTransaction, setCurrentTransaction] = useState<PaymentTransaction | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Load payment methods on mount
  useEffect(() => {
    loadPaymentMethods()
  }, [])

  const loadPaymentMethods = async (): Promise<void> => {
    // 如果已经有数据，不重复加载
    if (availablePaymentMethods.length > 0) {
      return
    }

    try {
      setIsLoading(true)
      setError(undefined)

      // 直接使用默认方法，避免API调用延迟
      const defaultMethods = [
        {
          id: 'credit_card',
          name: 'credit_card',
          display_name: '信用卡',
          icon: 'credit-card-icon',
          is_active: true,
          sort_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'alipay',
          name: 'alipay',
          display_name: '支付宝',
          icon: 'alipay-icon',
          is_active: true,
          sort_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'wechat',
          name: 'wechat',
          display_name: '微信支付',
          icon: 'wechat-icon',
          is_active: true,
          sort_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]

      setAvailablePaymentMethods(defaultMethods)
    } catch (error) {
      console.warn('Payment methods initialization failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectPaymentMethod = (method: PaymentMethod): void => {
    setSelectedPaymentMethod(method)
    setError(undefined)
  }

  const createPayment = async (request: CreatePaymentRequest): Promise<CreatePaymentResponse> => {
    try {
      setIsLoading(true)
      setError(undefined)

      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      const result = await response.json()

      if (result.success) {
        // If we have transaction data, store it
        if (result.transaction_id) {
          const transaction: PaymentTransaction = {
            id: result.transaction_id,
            order_id: request.order_id,
            user_id: '', // Will be filled by backend
            payment_method_id: selectedPaymentMethod?.id || '',
            amount: request.amount,
            currency: request.currency || 'CNY',
            provider: request.payment_method,
            status: 'pending',
            payment_url: result.payment_url,
            qr_code_url: result.qr_code_url,
            payment_data: result.payment_data || {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setCurrentTransaction(transaction)
        }
      } else {
        setError(result.error || 'Payment creation failed')
      }

      return result
    } catch (error) {
      console.error('Error creating payment:', error)
      const errorMessage = 'Failed to create payment'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const checkPaymentStatus = async (transaction_id: string): Promise<PaymentStatusResponse> => {
    try {
      setIsLoading(true)
      setError(undefined)

      const response = await fetch(`/api/payment/status/${transaction_id}`)
      const result = await response.json()

      if (result.success && result.transaction) {
        setCurrentTransaction(result.transaction)
      } else if (!result.success) {
        setError(result.error || 'Failed to check payment status')
      }

      return result
    } catch (error) {
      console.error('Error checking payment status:', error)
      const errorMessage = 'Failed to check payment status'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const processRefund = async (request: RefundRequest): Promise<RefundResponse> => {
    try {
      setIsLoading(true)
      setError(undefined)

      const response = await fetch('/api/payment/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      })

      const result = await response.json()

      if (!result.success) {
        setError(result.error || 'Refund processing failed')
      }

      return result
    } catch (error) {
      console.error('Error processing refund:', error)
      const errorMessage = 'Failed to process refund'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = (): void => {
    setError(undefined)
  }

  const value: PaymentContextType = {
    availablePaymentMethods,
    selectedPaymentMethod,
    currentTransaction,
    isLoading,
    error,
    loadPaymentMethods,
    selectPaymentMethod,
    createPayment,
    checkPaymentStatus,
    processRefund,
    clearError
  }

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  )
}

// Hook to use payment context
export function usePayment() {
  const context = useContext(PaymentContext)
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider')
  }
  return context
}
