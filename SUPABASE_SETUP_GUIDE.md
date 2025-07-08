# 🚀 OWOWLOVE.COM Supabase 快速设置指南

## 📋 第一步：创建Supabase项目

### 1. 注册Supabase账号
1. 访问 [https://supabase.com](https://supabase.com)
2. 点击 "Start your project" 
3. 使用GitHub账号登录（推荐）

### 2. 创建新项目
1. 点击 "New Project"
2. 选择组织（个人账号）
3. 填写项目信息：
   - **Name**: `owowlove-database`
   - **Database Password**: 生成强密码并保存
   - **Region**: 选择离您最近的区域（建议：Singapore 或 Tokyo）
4. 点击 "Create new project"

### 3. 等待项目创建
- 项目创建需要1-2分钟
- 创建完成后会显示项目仪表板

## 🔑 第二步：获取API密钥

### 1. 获取项目URL和密钥
1. 在项目仪表板，点击左侧 "Settings" → "API"
2. 复制以下信息：
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJ...` (公开密钥)
   - **service_role key**: `eyJ...` (服务端密钥，保密！)

## ⚙️ 第三步：配置本地环境

### 1. 运行设置脚本
```bash
npm run setup:supabase
```

### 2. 输入您的Supabase信息
- 粘贴Project URL
- 粘贴anon public key  
- 粘贴service_role key

## 🗄️ 第四步：创建数据库表

### 1. 打开SQL编辑器
- 点击左侧 "SQL Editor"
- 点击 "New query"

### 2. 执行第一个脚本
复制 `supabase/migrations/001_initial_schema.sql` 的全部内容，粘贴到SQL编辑器中，点击 "Run"

### 3. 执行第二个脚本
复制 `supabase/migrations/002_security_policies.sql` 的全部内容，粘贴到SQL编辑器中，点击 "Run"

## 🧪 第五步：测试应用

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 测试功能
- 访问 http://localhost:3000
- 检查网站是否正常显示
- 测试用户注册/登录功能

## 🌐 第六步：部署到Vercel

### 1. 在Vercel中添加环境变量
在Vercel项目设置中添加：
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. 重新部署
- 推送代码到GitHub
- Vercel会自动重新部署

## ✅ 完成！

您的OWOWLOVE.COM网站现在已经集成了Supabase数据库！

### 🎯 功能特性
- ✅ 用户注册/登录
- ✅ 用户资料管理
- ✅ 产品数据管理
- ✅ 订单系统
- ✅ 管理员后台
- ✅ 安全的数据访问

### 🔧 管理员账号
创建第一个管理员账号后，在Supabase Table Editor中：
1. 打开 `users` 表
2. 找到您的用户记录
3. 将 `role` 字段改为 `admin`

### 📞 需要帮助？
如果遇到问题，请检查：
1. 环境变量是否正确配置
2. 数据库迁移是否成功执行
3. Supabase项目是否正常运行

🎉 恭喜！您的网站现在拥有完整的用户系统了！
