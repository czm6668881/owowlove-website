# OWOWLOVE.COM Supabase 集成设置指南

## 🚀 第一步：创建Supabase项目

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

### 2. 配置环境变量
在Vercel中添加以下环境变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🗄️ 第三步：创建数据库表

### 1. 打开SQL编辑器
1. 在Supabase仪表板，点击左侧 "SQL Editor"
2. 点击 "New query"

### 2. 执行表结构脚本
复制并执行 `supabase/migrations/001_initial_schema.sql` 中的内容

### 3. 执行安全策略脚本
复制并执行 `supabase/migrations/002_security_policies.sql` 中的内容

## 🔒 第四步：配置安全设置

### 1. 启用行级安全（RLS）
- 所有表已自动启用RLS
- 安全策略已配置完成

### 2. 验证安全策略
在SQL编辑器中运行：
```sql
-- 查看所有策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 📊 第五步：迁移现有数据

### 1. 安装依赖
```bash
npm install tsx --save-dev
```

### 2. 运行数据迁移
```bash
npx tsx scripts/migrate-data.ts
```

### 3. 验证数据迁移
在Supabase仪表板的 "Table Editor" 中检查：
- `categories` 表
- `products` 表  
- `users` 表

## 🧪 第六步：测试连接

### 1. 测试公开数据访问
```javascript
import { supabase } from './lib/supabase'

// 测试获取产品
const { data, error } = await supabase
  .from('products')
  .select('*')
  .limit(5)

console.log('Products:', data)
```

### 2. 测试管理员功能
- 登录管理后台：`/en/admin/login`
- 使用密码：`owowlove2025`
- 测试产品管理功能

## 🌐 第七步：部署更新

### 1. 提交代码
```bash
git add .
git commit -m "feat: integrate Supabase database"
git push
```

### 2. 在Vercel中配置环境变量
1. 访问 Vercel 项目设置
2. 添加 Supabase 环境变量
3. 重新部署项目

## 📋 数据访问权限总结

| 数据类型 | 游客访问 | 用户访问 | 管理员访问 |
|---------|---------|---------|-----------|
| 产品信息 | ✅ 只读 | ✅ 只读 | ✅ 完全控制 |
| 类目信息 | ✅ 只读 | ✅ 只读 | ✅ 完全控制 |
| 用户资料 | ❌ 无权限 | ✅ 自己的数据 | ✅ 所有用户 |
| 订单数据 | ❌ 无权限 | ✅ 自己的订单 | ✅ 所有订单 |
| 联系消息 | ✅ 只能创建 | ✅ 只能创建 | ✅ 查看所有 |

## 🔧 故障排除

### 常见问题
1. **连接失败**: 检查环境变量是否正确配置
2. **权限错误**: 确认RLS策略已正确设置
3. **数据不显示**: 检查表中是否有数据且 `is_active = true`

### 调试方法
1. 在Supabase仪表板查看实时日志
2. 使用浏览器开发者工具检查网络请求
3. 在代码中添加 `console.log` 查看错误信息

## 📞 需要帮助？
如果遇到任何问题，请告诉我具体的错误信息，我会帮您解决！
