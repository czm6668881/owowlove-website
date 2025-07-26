# Google OAuth 设置指南

## 1. 创建Google Cloud项目

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 点击项目选择器，然后点击"新建项目"
3. 输入项目名称（例如：OWOWLOVE-OAuth）
4. 点击"创建"

## 2. 启用Google+ API

1. 在Google Cloud Console中，转到"API和服务" > "库"
2. 搜索"Google+ API"或"People API"
3. 点击并启用该API

## 3. 配置OAuth同意屏幕

1. 转到"API和服务" > "OAuth同意屏幕"
2. 选择"外部"用户类型（除非你有Google Workspace账户）
3. 填写必要信息：
   - 应用名称：OWOWLOVE
   - 用户支持电子邮件：你的邮箱
   - 开发者联系信息：你的邮箱
4. 点击"保存并继续"
5. 在"范围"页面，添加以下范围：
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
6. 点击"保存并继续"
7. 在"测试用户"页面，添加你要测试的邮箱地址
8. 点击"保存并继续"

## 4. 创建OAuth 2.0凭据

1. 转到"API和服务" > "凭据"
2. 点击"创建凭据" > "OAuth 2.0客户端ID"
3. 选择应用类型："Web应用"
4. 输入名称：OWOWLOVE Web Client
5. 在"已获授权的重定向URI"中添加：
   - 开发环境：`http://localhost:3000/api/auth/google/callback`
   - 生产环境：`https://yourdomain.com/api/auth/google/callback`
6. 点击"创建"
7. 复制客户端ID和客户端密钥

## 5. 更新环境变量

在你的 `.env.local` 文件中更新以下变量：

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=你的客户端ID
GOOGLE_CLIENT_SECRET=你的客户端密钥
```

## 6. 测试Google登录

1. 启动开发服务器：`npm run dev`
2. 访问登录页面：`http://localhost:3000/en/login`
3. 点击"Continue with Google"按钮
4. 完成Google OAuth流程

## 注意事项

1. **开发环境**：在开发过程中，你的应用处于"测试"模式，只有添加到测试用户列表中的邮箱才能登录。

2. **生产环境**：要让所有用户都能使用Google登录，你需要：
   - 完善OAuth同意屏幕的所有信息
   - 提交应用进行验证（如果需要敏感范围）
   - 将应用状态从"测试"改为"生产"

3. **域名验证**：确保在Google Cloud Console中添加了正确的重定向URI，包括你的生产域名。

4. **HTTPS要求**：生产环境必须使用HTTPS，Google OAuth不支持HTTP重定向（除了localhost）。

## 故障排除

### 常见错误

1. **redirect_uri_mismatch**：
   - 检查重定向URI是否完全匹配
   - 确保包含了正确的协议（http/https）

2. **access_denied**：
   - 用户取消了授权
   - 或者用户不在测试用户列表中（测试模式下）

3. **invalid_client**：
   - 检查客户端ID和密钥是否正确
   - 确保环境变量已正确设置

### 调试技巧

1. 检查浏览器开发者工具的网络标签
2. 查看服务器日志中的错误信息
3. 确认环境变量是否正确加载
