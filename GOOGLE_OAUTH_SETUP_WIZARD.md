# 🧙‍♂️ Google OAuth 设置向导

## 🎯 目标
帮助您在5分钟内完成Google OAuth配置，解决"The OAuth client was not found"错误。

## 📝 当前状态
根据配置检查，您需要：
- ❌ 设置真实的Google客户端ID
- ❌ 设置真实的Google客户端密钥
- ✅ 其他配置都已就绪

## 🚀 快速设置（5分钟）

### 第1步：打开Google Cloud Console（1分钟）
1. 点击链接：https://console.cloud.google.com/
2. 使用您的Google账号登录
3. 如果是首次使用，同意服务条款

### 第2步：创建项目（1分钟）
1. 点击顶部的项目选择器
2. 点击"新建项目"
3. 项目名称输入：`OWOWLOVE-OAuth`
4. 点击"创建"并等待完成

### 第3步：启用API（30秒）
1. 左侧菜单 → "API和服务" → "库"
2. 搜索框输入：`Google+ API`
3. 点击搜索结果，然后点击"启用"

### 第4步：配置OAuth同意屏幕（1分钟）
1. 左侧菜单 → "API和服务" → "OAuth同意屏幕"
2. 选择"外部"，点击"创建"
3. 填写必要信息：
   - 应用名称：`OWOWLOVE`
   - 用户支持电子邮件：选择您的邮箱
   - 开发者联系信息：输入您的邮箱
4. 点击"保存并继续"
5. 在"范围"页面，点击"添加或移除范围"
6. 勾选：`../auth/userinfo.email` 和 `../auth/userinfo.profile`
7. 点击"更新"，然后"保存并继续"
8. 在"测试用户"页面，点击"添加用户"
9. 输入您的邮箱地址，点击"添加"
10. 点击"保存并继续"，然后"返回信息中心"

### 第5步：创建OAuth凭据（1分钟）
1. 左侧菜单 → "API和服务" → "凭据"
2. 点击"创建凭据" → "OAuth 2.0客户端ID"
3. 应用类型选择："Web应用"
4. 名称输入：`OWOWLOVE Web Client`
5. 在"已获授权的重定向URI"点击"添加URI"
6. 输入：`http://localhost:3001/api/auth/google/callback`
7. 点击"创建"

### 第6步：复制凭据（30秒）
创建成功后，您会看到弹窗显示：
- **客户端ID**：复制整个ID（包含.apps.googleusercontent.com）
- **客户端密钥**：复制整个密钥（以GOCSPX-开头）

### 第7步：更新环境变量（30秒）
1. 打开项目根目录的 `.env.local` 文件
2. 找到这两行：
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id-here
   GOOGLE_CLIENT_SECRET=your-google-client-secret-here
   ```
3. 替换为您复制的真实值：
   ```env
   GOOGLE_CLIENT_ID=您复制的客户端ID
   GOOGLE_CLIENT_SECRET=您复制的客户端密钥
   ```
4. 保存文件

### 第8步：重启服务器（30秒）
1. 在终端中按 `Ctrl+C` 停止开发服务器
2. 运行：`npm run dev`
3. 等待服务器启动完成

## ✅ 验证配置

### 自动验证
```bash
npm run google:verify
```
应该显示：✅ 所有检查都通过了！

### 手动测试
1. 访问：http://localhost:3001/en/test-google-oauth
2. 点击"检查配置" - 应该显示✅配置正确
3. 访问：http://localhost:3001/en/login
4. 点击"Continue with Google" - 应该重定向到Google授权页面

## 🎉 成功标志

如果配置正确，您应该看到：
1. ✅ 配置验证脚本通过所有检查
2. ✅ 测试页面显示配置正确
3. ✅ 点击Google登录按钮后正确重定向
4. ✅ Google页面显示您的应用名称"OWOWLOVE"
5. ✅ 授权后成功返回并登录网站

## 🆘 如果遇到问题

### 常见错误和解决方案

**"invalid_client"错误**
- 检查客户端ID是否完整复制（包含.apps.googleusercontent.com）
- 检查客户端密钥是否完整复制（以GOCSPX-开头）
- 确保环境变量没有多余的空格或引号

**"redirect_uri_mismatch"错误**
- 确保重定向URI完全是：`http://localhost:3001/api/auth/google/callback`
- 注意端口号必须是3001，不是3000

**"access_denied"错误**
- 确保您的邮箱在Google Console的测试用户列表中
- 使用添加到测试用户列表的邮箱进行测试

### 获取帮助
1. 运行诊断：`npm run google:verify`
2. 查看详细指南：`GOOGLE_OAUTH_QUICK_SETUP.md`
3. 使用检查清单：`GOOGLE_OAUTH_CHECKLIST.md`

## 📞 技术支持

如果按照向导仍然遇到问题：
1. 确保每个步骤都严格按照说明执行
2. 检查网络连接是否可以访问Google服务
3. 确认使用的是正确的Google账号
4. 重新检查环境变量的格式和内容

---

**预计完成时间：5分钟**
**难度等级：⭐⭐☆☆☆（简单）**

按照这个向导，您很快就能享受Google登录的便利了！🚀
