# 🚀 Stripe 支付快速开始指南

## 📋 前提条件

1. **Stripe 账户**: 在 [stripe.com](https://stripe.com) 注册账户
2. **Node.js**: 确保已安装 Node.js 16+
3. **项目运行**: 确保项目能正常启动

## ⚡ 快速设置 (5分钟)

### 1. 安装依赖
```bash
npm run stripe:install
```

### 2. 获取 Stripe 密钥
1. 访问 [Stripe Dashboard](https://dashboard.stripe.com/)
2. 登录您的账户
3. 转到 **Developers** > **API keys**
4. 复制以下密钥：
   - **Publishable key** (pk_test_...)
   - **Secret key** (sk_test_...)

### 3. 配置环境变量
运行自动设置脚本：
```bash
npm run stripe:setup
```

或手动添加到 `.env.local`:
```env
STRIPE_PUBLIC_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

### 4. 验证配置
```bash
npm run stripe:check
```

### 5. 测试集成
```bash
npm run dev
```
然后访问: http://localhost:3000/stripe-test

## 💳 测试卡号

| 卡号 | 结果 | 用途 |
|------|------|------|
| `4242 4242 4242 4242` | ✅ 成功 | 基本测试 |
| `4000 0000 0000 0002` | ❌ 失败 | 测试失败场景 |
| `4000 0025 0000 3155` | 🔐 需要验证 | 测试3D Secure |

**其他信息:**
- 过期日期: 任何未来日期 (如: `12/25`)
- CVC: 任何3位数字 (如: `123`)
- 姓名: 任何名字

## 🛠️ 使用方式

### 在结账流程中使用

1. **用户选择信用卡支付**
2. **系统创建支付意图**
3. **用户填写卡片信息**
4. **完成支付**

### 代码示例

```typescript
// 创建支付意图
const response = await fetch('/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    order_id: 'order_123',
    payment_method: 'credit_card',
    amount: 29.99,
    currency: 'USD'
  })
})

const result = await response.json()
// result.payment_data.client_secret 用于前端支付
```

## 🔧 API 端点

- `POST /api/payment/stripe/create-intent` - 创建支付意图
- `POST /api/payment/stripe/confirm` - 确认支付
- `POST /api/payment/stripe/create-payment-method` - 创建支付方式
- `GET /api/payment/stripe/config` - 获取配置
- `POST /api/payment/webhook/stripe` - Webhook处理

## 🔐 Webhook 设置 (可选)

1. 在 Stripe Dashboard 中创建 Webhook
2. 端点 URL: `https://yourdomain.com/api/payment/webhook/stripe`
3. 选择事件:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. 复制 Webhook Secret 到环境变量

## 🚨 故障排除

### 常见问题

**Q: 支付创建失败**
```bash
# 检查配置
npm run stripe:check

# 查看日志
npm run dev
```

**Q: 测试卡不工作**
- 确保使用正确的测试卡号
- 检查过期日期是未来日期
- 确认在测试模式下

**Q: Webhook 不工作**
- 检查 URL 是否可访问
- 验证 Webhook Secret
- 查看 Stripe Dashboard 日志

### 调试工具

1. **浏览器控制台** - 查看前端错误
2. **服务器日志** - 查看后端错误
3. **Stripe Dashboard** - 查看支付日志

## 📱 生产部署

### 切换到生产模式

1. **获取生产密钥**:
   - 在 Stripe Dashboard 切换到 Live 模式
   - 复制生产密钥

2. **更新环境变量**:
   ```env
   STRIPE_PUBLIC_KEY=pk_live_your_live_key
   STRIPE_SECRET_KEY=sk_live_your_live_key
   ```

3. **配置域名验证**
4. **设置生产 Webhook**

## 📞 获取帮助

- **Stripe 文档**: https://stripe.com/docs
- **测试指南**: https://stripe.com/docs/testing
- **API 参考**: https://stripe.com/docs/api

---

## ✅ 检查清单

- [ ] 安装了 Stripe 依赖
- [ ] 配置了环境变量
- [ ] 测试了支付流程
- [ ] 验证了 Webhook (可选)
- [ ] 准备好生产部署

完成这些步骤后，您的 Stripe 支付集成就可以使用了！

---

*最后更新: 2025-01-15*
