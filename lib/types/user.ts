export interface User {
  id: string
  email: string
  password: string // 加密后的密码
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  
  // 地址信息
  addresses: UserAddress[]
  defaultAddressId?: string
  
  // 账户状态
  isActive: boolean
  isEmailVerified: boolean
  
  // 偏好设置
  preferences: UserPreferences
  
  // 统计信息
  totalOrders: number
  totalSpent: number
  
  // 时间戳
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface UserAddress {
  id: string
  type: 'shipping' | 'billing' | 'both'
  firstName: string
  lastName: string
  company?: string
  street1: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
}

export interface UserPreferences {
  language: 'en' | 'zh'
  currency: 'USD' | 'CNY'
  emailNotifications: boolean
  smsNotifications: boolean
  marketingEmails: boolean
}

// 用户注册请求
export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  acceptTerms: boolean
}

// 用户登录请求
export interface LoginRequest {
  email: string
  password: string
  rememberMe?: boolean
}

// 用户登录响应
export interface LoginResponse {
  success: boolean
  token?: string
  user?: PublicUser
  error?: string
}

// 公开用户信息（不包含敏感数据）
export interface PublicUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  isActive: boolean
  isEmailVerified: boolean
  preferences: UserPreferences
  totalOrders: number
  totalSpent: number
  createdAt: string
  lastLoginAt?: string
}

// 用户更新请求
export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  preferences?: Partial<UserPreferences>
}

// 密码修改请求
export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

// 密码重置请求
export interface ResetPasswordRequest {
  email: string
}

// 用户认证上下文类型
export interface UserContextType {
  user: PublicUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterRequest) => Promise<boolean>
  logout: () => void
  updateUser: (data: UpdateUserRequest) => Promise<boolean>
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>
}

// 用户统计信息
export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  verifiedUsers: number
  totalOrders: number
  totalRevenue: number
}

// Order related types
export interface OrderItem {
  id: string
  productId: string
  productName: string
  variantId: string
  size: string
  color: string
  quantity: number
  price: number
  imageUrl?: string
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: ShippingAddress
  paymentMethod: string
  orderDate: string
  estimatedDelivery?: string
  trackingNumber?: string
  notes?: string
}
