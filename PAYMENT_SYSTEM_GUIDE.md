# OWOWLOVE.COM 支付系统使用指南

## 🚀 系统概述

OWOWLOVE.COM 支付系统是一个完整的电商支付解决方案，支持多种支付方式，包括支付宝、微信支付和信用卡支付。

### 主要特性
- ✅ 多支付方式支持（支付宝、微信支付、信用卡）
- ✅ 安全的支付流程和数据加密
- ✅ 实时支付状态跟踪
- ✅ 自动退款处理
- ✅ 管理员支付管理界面
- ✅ 支付记录和审计日志
- ✅ Webhook 支付通知处理

## 📋 系统架构

### 数据库表结构
```sql
-- 支付方式配置表
payment_methods
- id: UUID (主键)
- name: 支付方式名称 (alipay, wechat, credit_card)
- display_name: 显示名称
- is_active: 是否启用
- config: 配置信息 (JSON)
- sort_order: 排序

-- 支付交易表
payment_transactions
- id: UUID (主键)
- order_id: 订单ID
- user_id: 用户ID
- payment_method_id: 支付方式ID
- amount: 支付金额
- currency: 货币类型
- provider: 支付提供商
- status: 支付状态
- payment_url: 支付链接
- qr_code_url: 二维码链接
- created_at: 创建时间

-- 退款记录表
payment_refunds
- id: UUID (主键)
- transaction_id: 交易ID
- amount: 退款金额
- reason: 退款原因
- status: 退款状态
- processed_at: 处理时间

-- Webhook 日志表
payment_webhooks
- id: UUID (主键)
- provider: 支付提供商
- event_type: 事件类型
- payload: 载荷数据
- processed: 是否已处理
```

### API 端点

#### 用户端 API
- `GET /api/payment/methods` - 获取可用支付方式
- `POST /api/payment/create` - 创建支付
- `GET /api/payment/status/{transaction_id}` - 查询支付状态
- `GET /api/payment/transactions` - 获取用户支付记录
- `POST /api/payment/refund` - 申请退款

#### 管理员 API
- `GET /api/admin/payment/transactions` - 获取所有支付记录
- `GET /api/admin/payment/methods` - 获取支付方式配置
- `PUT /api/admin/payment/methods` - 更新支付方式配置

#### Webhook API
- `POST /api/payment/webhook/{provider}` - 处理支付通知

## 🛠️ 配置说明

### 环境变量配置

```env
# 支付宝配置
ALIPAY_APP_ID=your_app_id
ALIPAY_PRIVATE_KEY=your_private_key
ALIPAY_PUBLIC_KEY=alipay_public_key
ALIPAY_GATEWAY_URL=https://openapi.alipay.com/gateway.do
ALIPAY_NOTIFY_URL=https://yourdomain.com/api/payment/webhook/alipay
ALIPAY_RETURN_URL=https://yourdomain.com/payment/success

# 微信支付配置
WECHAT_APP_ID=your_app_id
WECHAT_MCH_ID=your_merchant_id
WECHAT_API_KEY=your_api_key
WECHAT_NOTIFY_URL=https://yourdomain.com/api/payment/webhook/wechat

# Stripe 配置
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 数据库迁移

运行以下 SQL 文件来设置数据库：
1. `supabase/migrations/003_payment_system.sql` - 创建支付相关表
2. `supabase/migrations/004_payment_security_policies.sql` - 设置安全策略

## 💳 支付流程

### 用户支付流程
1. 用户添加商品到购物车
2. 点击结账按钮
3. 系统创建订单
4. 跳转到支付页面
5. 选择支付方式
6. 创建支付交易
7. 跳转到支付提供商页面或显示二维码
8. 用户完成支付
9. 系统接收 Webhook 通知
10. 更新订单和支付状态

### 支付状态说明
- `pending` - 等待支付
- `processing` - 支付处理中
- `completed` - 支付成功
- `failed` - 支付失败
- `cancelled` - 支付取消
- `refunded` - 已退款

## 🔧 开发指南

### 前端组件使用

```tsx
import { PaymentProvider, usePayment } from '@/contexts/payment-context'
import { PaymentMethodSelector } from '@/components/payment/payment-method-selector'
import { PaymentProcessor } from '@/components/payment/payment-processor'

// 在应用根部添加 PaymentProvider
<PaymentProvider>
  <App />
</PaymentProvider>

// 在组件中使用支付功能
function CheckoutPage() {
  const { createPayment, selectedPaymentMethod } = usePayment()
  
  const handlePayment = async () => {
    const result = await createPayment({
      order_id: 'order_123',
      payment_method: 'alipay',
      amount: 99.99
    })
    
    if (result.success) {
      // 处理成功
    }
  }
}
```

### 后端服务使用

```typescript
import { PaymentService } from '@/lib/services/payment'

// 创建支付
const result = await PaymentService.createPaymentTransaction({
  order_id: 'order_123',
  payment_method: 'alipay',
  amount: 99.99,
  currency: 'CNY'
})

// 查询支付状态
const status = await PaymentService.checkPaymentStatus('transaction_id')

// 处理退款
const refund = await PaymentService.processRefund({
  transaction_id: 'transaction_id',
  amount: 50.00,
  reason: '用户申请退款'
})
```

## 🔐 安全考虑

### 数据安全
- 所有支付数据都经过加密存储
- 敏感信息（如支付密钥）存储在环境变量中
- 使用 HTTPS 进行所有支付相关通信

### 权限控制
- 用户只能查看自己的支付记录
- 管理员可以查看所有支付记录
- 支付操作需要用户身份验证

### Webhook 安全
- 验证 Webhook 签名确保来源可信
- 记录所有 Webhook 请求用于审计
- 防止重复处理相同的 Webhook

## 📊 监控和日志

### 支付监控
- 实时支付状态监控
- 支付成功率统计
- 异常支付告警

### 日志记录
- 所有支付操作都有详细日志
- Webhook 处理日志
- 错误和异常日志

## 🚨 故障排除

### 常见问题

1. **支付创建失败**
   - 检查支付方式配置
   - 验证订单金额和状态
   - 查看错误日志

2. **支付状态不更新**
   - 检查 Webhook 配置
   - 验证支付提供商通知
   - 查看 Webhook 日志

3. **退款失败**
   - 确认交易状态为已完成
   - 检查退款金额是否超过原金额
   - 验证支付提供商配置

### 调试工具
- 管理员支付管理界面
- 支付交易详情查看
- Webhook 日志查看
- 支付状态手动刷新

## 📞 技术支持

如需技术支持，请联系开发团队并提供：
- 错误描述和重现步骤
- 相关的交易ID或订单ID
- 错误日志和截图
- 系统环境信息

---

*最后更新: 2025-01-15*
*版本: 1.0.0*
