# 🚀 OWOWLOVE.COM Supabase 快速设置

## ✅ 第一步：环境变量已配置
您的Supabase环境变量已经正确配置在 `.env.local` 文件中。

## 📋 第二步：创建数据库表

### 方法一：一键复制完整脚本（推荐）

1. **打开Supabase SQL编辑器**
   - 我已经为您打开了：https://supabase.com/dashboard/project/zzexacrffmxmqrqamcxo/sql/new
   - 如果没有自动打开，请手动访问上述链接

2. **复制完整SQL脚本**
   - 打开项目根目录中的 `complete-database-setup.sql` 文件
   - 全选并复制所有内容（Ctrl+A, Ctrl+C）

3. **执行脚本**
   - 在Supabase SQL编辑器中粘贴脚本（Ctrl+V）
   - 点击右下角的 "Run" 按钮
   - 等待执行完成（应该显示 "Success. No rows returned"）

### 方法二：分步执行

如果您喜欢分步执行，可以：

1. 先执行 `supabase/migrations/001_initial_schema.sql`
2. 再执行 `supabase/migrations/002_security_policies.sql`

## 🧪 第三步：验证设置

执行完SQL脚本后，在终端运行：

```bash
node test-supabase-connection.js
```

如果看到所有表都显示 "✅ accessible"，说明设置成功！

## 🎯 第四步：启动网站

```bash
npm run dev
```

访问 http://localhost:3000 查看您的网站。

## 📊 创建的数据库表

- **categories** - 产品分类
- **products** - 产品目录
- **users** - 用户账户
- **orders** - 订单管理
- **favorites** - 用户收藏
- **contact_messages** - 联系表单消息

## 🔒 安全功能

- ✅ 行级安全 (RLS) 已启用
- ✅ 用户访问控制
- ✅ 管理员权限管理
- ✅ 自动用户注册处理

## 🛠️ 管理员账户设置

1. 注册一个用户账户
2. 在Supabase控制台中：
   - 点击 "Table Editor" → "users"
   - 找到您的用户记录
   - 将 `role` 字段改为 `admin`

## ❓ 遇到问题？

如果遇到任何问题：

1. 检查 `.env.local` 文件中的环境变量是否正确
2. 确保SQL脚本执行成功
3. 运行 `node test-supabase-connection.js` 验证连接

## 🎉 完成！

设置完成后，您的OWOWLOVE.COM网站将拥有：
- 完整的用户系统
- 产品管理功能
- 购物车和订单系统
- 收藏功能
- 安全的数据访问控制
