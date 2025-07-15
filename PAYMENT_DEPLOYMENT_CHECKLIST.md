# OWOWLOVE.COM 支付系统部署检查清单

## 📋 部署前检查

### 1. 数据库设置
- [ ] 运行支付系统数据库迁移
  ```sql
  -- 执行以下 SQL 文件
  supabase/migrations/003_payment_system.sql
  supabase/migrations/004_payment_security_policies.sql
  ```
- [ ] 验证支付相关表已创建
  - [ ] `payment_methods` 表
  - [ ] `payment_transactions` 表  
  - [ ] `payment_refunds` 表
  - [ ] `payment_webhooks` 表
- [ ] 确认默认支付方式已插入
- [ ] 验证 RLS 策略已启用

### 2. 环境变量配置
- [ ] 支付宝配置
  - [ ] `ALIPAY_APP_ID`
  - [ ] `ALIPAY_PRIVATE_KEY`
  - [ ] `ALIPAY_PUBLIC_KEY`
  - [ ] `ALIPAY_GATEWAY_URL`
  - [ ] `ALIPAY_NOTIFY_URL`
  - [ ] `ALIPAY_RETURN_URL`

- [ ] 微信支付配置
  - [ ] `WECHAT_APP_ID`
  - [ ] `WECHAT_MCH_ID`
  - [ ] `WECHAT_API_KEY`
  - [ ] `WECHAT_NOTIFY_URL`

- [ ] Stripe 配置
  - [ ] `STRIPE_PUBLIC_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`

### 3. 代码部署
- [ ] 确认所有支付相关文件已上传
  - [ ] 支付服务层 (`lib/services/payment.ts`)
  - [ ] 支付提供商 (`lib/services/payment-providers/`)
  - [ ] 支付类型定义 (`lib/types/payment.ts`)
  - [ ] 支付 API 端点 (`app/api/payment/`)
  - [ ] 支付 UI 组件 (`components/payment/`)
  - [ ] 支付上下文 (`contexts/payment-context.tsx`)

- [ ] 确认支付上下文已添加到应用布局
- [ ] 确认管理员导航已更新

### 4. 支付提供商配置

#### 支付宝
- [ ] 在支付宝开放平台创建应用
- [ ] 配置应用公钥和私钥
- [ ] 设置回调 URL
- [ ] 测试沙箱环境

#### 微信支付
- [ ] 在微信商户平台注册
- [ ] 获取商户号和 API 密钥
- [ ] 配置支付回调 URL
- [ ] 上传 API 证书（用于退款）

#### Stripe
- [ ] 创建 Stripe 账户
- [ ] 获取 API 密钥
- [ ] 配置 Webhook 端点
- [ ] 测试测试模式

## 🧪 部署后测试

### 1. API 端点测试
- [ ] 运行自动化测试脚本
  ```bash
  node scripts/test-payment-system.js
  ```
- [ ] 手动测试主要 API 端点
  - [ ] `GET /api/payment/methods`
  - [ ] `POST /api/payment/create`
  - [ ] `GET /api/payment/status/{id}`
  - [ ] `POST /api/payment/refund`

### 2. 前端功能测试
- [ ] 访问支付演示页面 `/payment-demo`
- [ ] 测试支付方式选择
- [ ] 测试支付创建流程
- [ ] 测试支付状态查询
- [ ] 测试购物车结账流程

### 3. 管理员功能测试
- [ ] 登录管理员面板
- [ ] 访问支付管理页面 `/admin/payments`
- [ ] 访问支付方式管理页面 `/admin/payment-methods`
- [ ] 测试支付记录查看
- [ ] 测试支付方式配置更新

### 4. 支付流程测试
- [ ] 测试支付宝支付流程
  - [ ] 创建支付
  - [ ] 跳转到支付页面
  - [ ] 模拟支付完成
  - [ ] 验证 Webhook 处理

- [ ] 测试微信支付流程
  - [ ] 创建支付
  - [ ] 生成二维码
  - [ ] 模拟扫码支付
  - [ ] 验证 Webhook 处理

- [ ] 测试信用卡支付流程
  - [ ] 创建支付意图
  - [ ] 验证客户端集成
  - [ ] 测试支付确认

### 5. 安全性测试
- [ ] 验证 Webhook 签名验证
- [ ] 测试未授权访问保护
- [ ] 验证支付数据加密
- [ ] 测试 SQL 注入防护
- [ ] 验证 CSRF 保护

## 🔧 故障排除

### 常见问题检查
- [ ] 检查数据库连接
- [ ] 验证环境变量设置
- [ ] 查看应用日志
- [ ] 检查支付提供商配置
- [ ] 验证 Webhook URL 可访问性

### 日志检查
- [ ] 应用服务器日志
- [ ] 数据库查询日志
- [ ] 支付提供商回调日志
- [ ] 错误和异常日志

## 📊 监控设置

### 性能监控
- [ ] 设置支付 API 响应时间监控
- [ ] 配置支付成功率监控
- [ ] 设置异常支付告警

### 业务监控
- [ ] 支付金额统计
- [ ] 支付方式使用统计
- [ ] 退款率监控
- [ ] 用户支付行为分析

## 🚀 上线发布

### 发布步骤
1. [ ] 完成所有测试
2. [ ] 备份当前数据库
3. [ ] 部署新代码
4. [ ] 运行数据库迁移
5. [ ] 验证支付功能
6. [ ] 监控系统状态

### 发布后验证
- [ ] 验证所有支付方式正常工作
- [ ] 检查支付数据正确记录
- [ ] 确认 Webhook 正常接收
- [ ] 验证管理员功能正常

## 📞 应急联系

### 技术支持
- 开发团队联系方式
- 支付提供商技术支持
- 服务器运维联系方式

### 回滚计划
- [ ] 准备代码回滚方案
- [ ] 准备数据库回滚脚本
- [ ] 确认回滚触发条件

---

## ✅ 完成确认

部署负责人: _________________ 日期: _________

测试负责人: _________________ 日期: _________

项目经理: _________________ 日期: _________

---

*最后更新: 2025-01-15*
*版本: 1.0.0*
