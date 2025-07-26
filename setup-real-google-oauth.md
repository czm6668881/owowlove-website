# 🔧 设置真实Google OAuth凭据

## 📋 您需要做的事情

1. **从Google Cloud Console获取凭据后**，请将以下信息告诉我：
   - 客户端ID（格式：数字-字符串.apps.googleusercontent.com）
   - 客户端密钥（格式：GOCSPX-字符串）

2. **或者您可以自己更新**：
   打开 `.env.local` 文件，找到这两行：
   ```env
   GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz123456
   ```
   
   替换为您从Google获取的真实值：
   ```env
   GOOGLE_CLIENT_ID=您的真实客户端ID
   GOOGLE_CLIENT_SECRET=您的真实客户端密钥
   ```

3. **重启开发服务器**：
   ```bash
   # 停止服务器 (Ctrl+C)
   npm run dev
   ```

4. **验证配置**：
   ```bash
   npm run google:verify
   ```

## 🎯 完成后的效果

- ✅ 使用真实的Google登录页面
- ✅ 真实的Google用户账号
- ✅ 完全免费，无任何费用
- ✅ 支持任何Gmail用户登录（发布后）

## 🆘 如果遇到问题

常见问题都有免费解决方案：

1. **"应用未验证"警告**
   - 这是正常的，点击"高级" → "转到OWOWLOVE（不安全）"
   - 完全免费，只是Google的安全提示

2. **"access_denied"错误**
   - 确保您的邮箱在测试用户列表中
   - 或者发布应用（免费）

3. **"redirect_uri_mismatch"**
   - 确保重定向URI完全匹配：
     `http://localhost:3001/api/auth/google/callback`

## 📞 需要帮助？

如果您完成了Google Cloud Console的设置，请告诉我您的凭据，我会帮您完成配置！
