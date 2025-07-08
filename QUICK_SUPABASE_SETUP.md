# 🚀 OWOWLOVE.COM Supabase 快速设置指南

## 📋 准备工作

您的项目已经完成了Supabase集成的所有代码工作！现在只需要：
1. 创建Supabase项目
2. 运行数据库脚本
3. 配置环境变量

## 🌐 第一步：创建Supabase项目

### 1. 访问Supabase
- 打开 [https://supabase.com](https://supabase.com)
- 点击 "Start your project"
- 使用GitHub账号登录

### 2. 创建项目
- 点击 "New Project"
- 项目名称：`owowlove-database`
- 数据库密码：生成并保存强密码
- 区域：选择 Singapore 或 Tokyo
- 点击 "Create new project"

### 3. 等待创建完成（1-2分钟）

## 🔑 第二步：获取API密钥

在项目仪表板：
1. 点击左侧 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJ...`
   - **service_role key**: `eyJ...`

## 🗄️ 第三步：创建数据库表

### 1. 打开SQL编辑器
- 点击左侧 "SQL Editor"
- 点击 "New query"

### 2. 执行第一个脚本
复制 `supabase/migrations/001_initial_schema.sql` 的全部内容，粘贴到SQL编辑器中，点击 "Run"

### 3. 执行第二个脚本
复制 `supabase/migrations/002_security_policies.sql` 的全部内容，粘贴到SQL编辑器中，点击 "Run"

## ⚙️ 第四步：配置本地环境

### 1. 运行设置脚本
```bash
npm run setup:supabase
```

### 2. 输入您的Supabase信息
- 粘贴Project URL
- 粘贴anon public key  
- 粘贴service_role key

## 📊 第五步：创建测试数据

### 1. 创建示例数据
```bash
npm run create:sample-data
```

### 2. 迁移数据到Supabase
```bash
npm run migrate:data
```

## 🧪 第六步：测试应用

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 测试功能
- 访问 http://localhost:3000
- 检查产品是否显示
- 测试管理员登录：`owowlove@163.com` / `owowlove2025`

## 🌐 第七步：部署到Vercel

### 1. 在Vercel中添加环境变量
访问您的Vercel项目设置，添加：
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
JWT_SECRET=owowlove-secret-2025
ADMIN_PASSWORD=owowlove2025
ADMIN_EMAIL=owowlove@163.com
```

### 2. 重新部署
```bash
git push
```

## ✅ 验证清单

- [ ] Supabase项目创建成功
- [ ] 数据库表创建完成
- [ ] 环境变量配置正确
- [ ] 示例数据迁移成功
- [ ] 本地开发正常运行
- [ ] 生产环境部署成功

## 🔧 故障排除

### 常见问题
1. **连接失败**: 检查环境变量是否正确
2. **权限错误**: 确认使用了正确的API密钥
3. **数据不显示**: 检查数据是否成功迁移

### 获取帮助
如果遇到问题，请提供：
- 错误信息截图
- 浏览器控制台日志
- Supabase项目URL（不要包含密钥）

## 🎉 完成！

设置完成后，您的OWOWLOVE.COM将拥有：
- ✅ 企业级PostgreSQL数据库
- ✅ 安全的用户认证系统
- ✅ 行级安全策略保护
- ✅ 实时数据同步
- ✅ 自动备份和恢复

**您的电商网站现在具备了专业级的数据库支持！** 🚀
