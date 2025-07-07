# OWOWLOVE.COM 管理员访问指南

## 🔐 管理员登录

### 访问地址
- **管理员登录页面**: http://localhost:3000/en/admin/login
- **管理员面板**: http://localhost:3000/en/admin (需要登录)

### 登录凭据
- **密码**: `owowlove2025`

## 🛡️ 安全特性

### 身份验证保护
- ✅ 所有管理页面都需要密码验证
- ✅ JWT Token 身份验证 (24小时有效期)
- ✅ 自动登录状态检查
- ✅ 登录失败记录
- ✅ 安全登出功能

### 访问控制
- 🚫 前端用户无法看到管理入口
- 🔒 直接访问管理页面会重定向到登录页
- 📝 所有登录尝试都会被记录
- ⏰ Token 过期自动要求重新登录

## 📋 使用说明

### 首次访问
1. 在浏览器中访问: `http://localhost:3000/en/admin/login`
2. 输入密码: `owowlove2025`
3. 点击 "Login" 按钮
4. 成功后自动跳转到管理面板

### 管理功能
登录后可以访问以下功能：
- 📦 产品管理 (Products)
- 🛒 订单管理 (Orders)  
- 👥 客户管理 (Customers)
- 💬 消息管理 (Messages)
- 🖼️ 媒体管理 (Media)
- 🏷️ 分类管理 (Categories)
- ⚙️ 系统设置 (Settings)

### 登出
- 点击侧边栏底部的 "Logout" 按钮
- 或者关闭浏览器 (Token 会在24小时后自动过期)

## 🔧 技术细节

### 环境变量
```bash
ADMIN_PASSWORD=owowlove2025
JWT_SECRET=owowlove-jwt-secret-key-change-in-production
```

### API 端点
- `POST /api/admin/auth/login` - 管理员登录
- `POST /api/admin/auth/verify` - Token 验证

### 安全建议
1. **生产环境**: 请更改默认密码和JWT密钥
2. **HTTPS**: 生产环境建议使用HTTPS
3. **防火墙**: 考虑限制管理页面的IP访问
4. **备份**: 定期备份管理员凭据

## 🚨 故障排除

### 无法访问登录页面
1. 确认服务器正在运行: `pm2 status`
2. 检查URL是否正确: `http://localhost:3000/en/admin/login`
3. 清除浏览器缓存并刷新页面
4. 检查服务器日志: `pm2 logs owowlove-production`

### 无法登录
1. 检查密码是否正确: `owowlove2025`
2. 清除浏览器localStorage: 按F12 → Application → Local Storage → 清除
3. 检查网络连接和API响应
4. 查看浏览器控制台是否有错误信息

### 自动登出
- Token 过期 (24小时)
- 浏览器localStorage被清除
- 服务器重启

### 忘记密码
- 检查 `.env.production` 文件中的 `ADMIN_PASSWORD`
- 或联系技术支持

### 页面显示问题
- 确保已重新构建: `npm run build`
- 重启PM2服务: `pm2 restart owowlove-production`
- 检查浏览器开发者工具中的错误信息

---
**最后更新**: 2025-07-03
**版本**: v1.1
**状态**: ✅ 已部署并运行 - 登录页面问题已修复
