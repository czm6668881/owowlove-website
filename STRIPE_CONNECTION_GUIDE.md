# 🎉 Stripe 收款账号连接指南

## ✅ 当前状态

您的Stripe集成已经基本配置完成：
- ✅ Stripe API密钥已配置
- ✅ API连接测试成功
- ✅ 支付意图创建成功
- ✅ 前端支付组件已就绪

## 🔧 完成Webhook设置

### 1. 登录Stripe Dashboard
访问：https://dashboard.stripe.com/

### 2. 创建Webhook端点
1. 在左侧菜单中，点击 **"Developers"** → **"Webhooks"**
2. 点击 **"Add endpoint"** 按钮
3. 填写端点URL：
   ```
   https://owowlove.com/api/payment/webhook/stripe
   ```
   或者如果使用Vercel域名：
   ```
   https://owowlove.vercel.app/api/payment/webhook/stripe
   ```

### 3. 选择监听事件
选择以下重要事件：
- ✅ `payment_intent.succeeded` - 支付成功
- ✅ `payment_intent.payment_failed` - 支付失败
- ✅ `payment_intent.canceled` - 支付取消
- ✅ `charge.dispute.created` - 争议创建

### 4. 获取Webhook Secret
1. 创建Webhook后，点击进入详情页面
2. 在 **"Signing secret"** 部分，点击 **"Reveal"**
3. 复制以 `whsec_` 开头的密钥

### 5. 更新环境变量
将Webhook Secret添加到您的 `.env.local` 文件：
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 🧪 测试支付功能

### 方法1：专用测试页面
访问：http://localhost:3000/stripe-test

**测试步骤：**
1. 输入测试金额（如：29.99）
2. 点击"创建支付意图"
3. 填写测试卡信息：
   - **卡号**: `4242 4242 4242 4242`
   - **过期日期**: `12/25`
   - **CVC**: `123`
   - **持卡人姓名**: 任何名字
4. 点击"支付"按钮
5. 查看支付结果

### 方法2：完整购物流程
访问：http://localhost:3000

**测试步骤：**
1. 浏览商品并添加到购物车
2. 点击购物车图标
3. 点击"结账"按钮
4. 填写收货信息
5. 选择"信用卡支付"
6. 使用测试卡号完成支付

## 💳 测试卡号

| 卡号 | 结果 | 用途 |
|------|------|------|
| `4242 4242 4242 4242` | ✅ 成功 | 基本支付测试 |
| `4000 0000 0000 0002` | ❌ 失败 | 测试支付失败 |
| `4000 0025 0000 3155` | 🔐 需要验证 | 测试3D Secure |

**其他测试信息：**
- **过期日期**: 任何未来日期（如：12/25）
- **CVC**: 任何3位数字（如：123）
- **邮编**: 任何5位数字（如：12345）

## 🌍 生产环境配置

### 1. 获取生产密钥
1. 在Stripe Dashboard中，切换到 **"Live"** 模式
2. 获取生产环境的API密钥：
   - Publishable key (pk_live_...)
   - Secret key (sk_live_...)

### 2. 更新生产环境变量
在生产环境的环境变量中设置：
```env
STRIPE_PUBLIC_KEY=pk_live_your_live_publishable_key
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
```

### 3. 创建生产Webhook
为生产环境创建单独的Webhook端点，使用相同的URL和事件配置。

## 🔍 验证集成状态

运行以下命令检查配置：
```bash
# 检查Stripe配置
node scripts/check-stripe-config.js

# 测试API连接
node scripts/test-stripe-api.js
```

## 📊 监控和管理

### Stripe Dashboard功能
- **支付记录**: 查看所有交易
- **客户管理**: 管理客户信息
- **争议处理**: 处理退款和争议
- **分析报告**: 查看收入统计

### 本地监控
- 查看支付日志：检查控制台输出
- 数据库记录：查看 `payment_transactions` 表
- Webhook日志：查看 `payment_webhooks` 表

## 🆘 常见问题

### Q: 支付失败怎么办？
A: 检查以下项目：
1. API密钥是否正确
2. 网络连接是否正常
3. 卡号信息是否有效
4. 查看控制台错误信息

### Q: Webhook不工作？
A: 确认以下设置：
1. Webhook URL是否正确
2. Webhook Secret是否配置
3. 选择的事件是否正确
4. 服务器是否可以接收外部请求

### Q: 如何切换到生产模式？
A: 更新环境变量为生产密钥，并确保Webhook指向生产域名。

## 📞 技术支持

如果遇到问题，可以：
1. 查看Stripe官方文档：https://stripe.com/docs
2. 检查项目中的 `STRIPE_TESTING_GUIDE.md`
3. 联系Stripe技术支持

---

🎉 **恭喜！您的Stripe收款账号已成功连接！**
