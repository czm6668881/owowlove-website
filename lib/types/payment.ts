// Payment system type definitions

export interface PaymentMethod {
  id: string
  name: string // 'alipay', 'wechat', 'credit_card', 'paypal'
  display_name: string // '支付宝', '微信支付', '信用卡', 'PayPal'
  icon: string
  is_active: boolean
  config: Record<string, any>
  sort_order: number
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: string
  order_id: string
  user_id: string
  payment_method_id: string
  
  // Transaction details
  amount: number
  currency: string
  
  // Payment provider details
  provider: string // 'alipay', 'wechat', 'stripe', etc.
  provider_transaction_id?: string
  provider_order_id?: string
  
  // Status tracking
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  
  // Payment flow data
  payment_url?: string
  qr_code_url?: string
  payment_data: Record<string, any>
  
  // Timestamps
  paid_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface PaymentRefund {
  id: string
  transaction_id: string
  order_id: string
  user_id: string
  
  // Refund details
  amount: number
  reason?: string
  
  // Provider details
  provider_refund_id?: string
  
  // Status
  status: 'pending' | 'processing' | 'completed' | 'failed'
  
  // Timestamps
  processed_at?: string
  created_at: string
  updated_at: string
}

export interface PaymentWebhook {
  id: string
  provider: string
  event_type: string
  transaction_id?: string
  payload: Record<string, any>
  processed: boolean
  error_message?: string
  created_at: string
}

// Payment request/response types
export interface CreatePaymentRequest {
  order_id: string
  payment_method: string
  amount: number
  currency?: string
  return_url?: string
  cancel_url?: string
}

export interface CreatePaymentResponse {
  success: boolean
  transaction_id?: string
  payment_url?: string
  qr_code_url?: string
  payment_data?: Record<string, any>
  error?: string
}

export interface PaymentStatusResponse {
  success: boolean
  status?: PaymentTransaction['status']
  transaction?: PaymentTransaction
  error?: string
}

export interface RefundRequest {
  transaction_id: string
  amount?: number // If not provided, full refund
  reason?: string
}

export interface RefundResponse {
  success: boolean
  refund_id?: string
  error?: string
}

// Payment provider interfaces
export interface PaymentProvider {
  name: string
  createPayment(request: CreatePaymentRequest): Promise<CreatePaymentResponse>
  verifyPayment(transaction_id: string): Promise<PaymentStatusResponse>
  processRefund(request: RefundRequest): Promise<RefundResponse>
  handleWebhook(payload: any): Promise<{ success: boolean; transaction_id?: string }>
}

// Alipay specific types
export interface AlipayConfig {
  app_id: string
  private_key: string
  public_key: string
  gateway_url: string
  notify_url: string
  return_url: string
}

export interface AlipayPaymentData {
  trade_no?: string
  out_trade_no: string
  total_amount: string
  subject: string
  body?: string
  timeout_express?: string
}

// WeChat Pay specific types
export interface WechatConfig {
  app_id: string
  mch_id: string
  api_key: string
  cert_path?: string
  key_path?: string
  notify_url: string
}

export interface WechatPaymentData {
  appid: string
  mch_id: string
  nonce_str: string
  sign: string
  body: string
  out_trade_no: string
  total_fee: number
  spbill_create_ip: string
  notify_url: string
  trade_type: string
}

// Stripe specific types
export interface StripeConfig {
  public_key: string
  secret_key: string
  webhook_secret: string
}

export interface StripePaymentData {
  payment_intent_id: string
  client_secret: string
  amount: number
  currency: string
}

// Payment context type
export interface PaymentContextType {
  availablePaymentMethods: PaymentMethod[]
  selectedPaymentMethod?: PaymentMethod
  currentTransaction?: PaymentTransaction
  isLoading: boolean
  error?: string
  
  // Actions
  loadPaymentMethods: () => Promise<void>
  selectPaymentMethod: (method: PaymentMethod) => void
  createPayment: (request: CreatePaymentRequest) => Promise<CreatePaymentResponse>
  checkPaymentStatus: (transaction_id: string) => Promise<PaymentStatusResponse>
  processRefund: (request: RefundRequest) => Promise<RefundResponse>
  clearError: () => void
}
