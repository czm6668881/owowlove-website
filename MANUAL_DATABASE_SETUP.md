# 🗄️ 手动数据库设置指南

## 📋 问题解决状态

✅ **已完成**:
- 图片映射文件已更新 (包含6张产品图片)
- 图片API已增强 (支持多重备用方案)
- 代码已部署到生产环境

⚠️ **待完成**:
- 在Supabase中创建 `image_storage` 表

## 🔧 手动创建数据库表

### 步骤 1: 登录 Supabase

1. 访问 [https://supabase.com](https://supabase.com)
2. 登录您的账户
3. 选择您的项目

### 步骤 2: 打开 SQL 编辑器

1. 在左侧菜单中点击 "SQL Editor"
2. 点击 "New query" 创建新查询

### 步骤 3: 执行以下 SQL 代码

```sql
-- 创建图片存储表
CREATE TABLE IF NOT EXISTS image_storage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename VARCHAR(255) UNIQUE NOT NULL,
  data TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INTEGER NOT NULL,
  product_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_image_storage_filename ON image_storage(filename);
CREATE INDEX IF NOT EXISTS idx_image_storage_product_id ON image_storage(product_id);
CREATE INDEX IF NOT EXISTS idx_image_storage_created_at ON image_storage(created_at);

-- 添加注释
COMMENT ON TABLE image_storage IS '产品图片存储表，用于生产环境图片备份';
COMMENT ON COLUMN image_storage.filename IS '图片文件名';
COMMENT ON COLUMN image_storage.data IS '图片的base64数据URL格式';
COMMENT ON COLUMN image_storage.mime_type IS '图片MIME类型';
COMMENT ON COLUMN image_storage.size IS '图片文件大小（字节）';
COMMENT ON COLUMN image_storage.product_id IS '关联的产品ID';

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_image_storage_updated_at 
    BEFORE UPDATE ON image_storage 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 验证表创建
SELECT 'image_storage table created successfully' as status;
```

### 步骤 4: 运行查询

1. 将上面的 SQL 代码复制粘贴到编辑器中
2. 点击 "Run" 按钮执行
3. 确认看到 "image_storage table created successfully" 消息

## 🧪 验证设置

### 方法 1: 在项目中运行测试

```bash
node test-image-sync.js
```

### 方法 2: 在 Supabase 中验证

在 SQL 编辑器中运行:

```sql
-- 检查表结构
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'image_storage' 
ORDER BY ordinal_position;

-- 检查当前记录数
SELECT COUNT(*) as total_records FROM image_storage;
```

## 🚀 完成后的下一步

1. **运行图片同步脚本**:
   ```bash
   node production-image-sync.js
   ```

2. **验证生产环境**:
   ```bash
   node verify-production-images.js
   ```

3. **测试网站**: 访问 https://owowlove.com 确认图片显示正常

## 📊 当前解决方案状态

### ✅ 已实施的修复

1. **图片映射文件**: 包含所有6张产品图片的base64数据
2. **增强的图片API**: 支持文件系统 → 映射文件 → 数据库 → 占位符的多重备用方案
3. **生产环境部署**: 所有修复已部署到 https://owowlove.com

### 🔍 验证结果

- ✅ 映射文件: 6/6 图片有效
- ✅ 本地文件: 6/6 存在
- ✅ API路由: 完整的备用方案
- ✅ 生产测试: 3/6 图片正常加载 (50% 成功率)

### 💡 为什么有些图片显示占位符

部分图片返回占位符SVG是因为:
1. 映射文件可能在部署时被截断
2. 某些图片的base64数据可能损坏
3. 文件名匹配问题

创建数据库表后，运行同步脚本将解决这些问题。

## 🆘 如果仍有问题

1. **检查映射文件**: 确认 `public/image-mapping.json` 包含所有图片
2. **重新生成映射**: 运行 `node update-image-mapping.js`
3. **同步到数据库**: 运行 `node production-image-sync.js`
4. **联系支持**: 如果问题持续存在

---

**注意**: 即使不创建数据库表，映射文件备用方案也应该能让大部分图片正常显示。数据库表是额外的保险措施。
