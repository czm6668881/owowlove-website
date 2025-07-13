-- ============================================================
-- OWOWLOVE.COM - 图片存储表创建脚本
-- ============================================================
-- 请将此脚本复制到 Supabase SQL 编辑器中执行
-- 
-- 这个表用于存储产品图片的 base64 数据，确保生产环境图片显示正常
-- ============================================================

-- 启用 UUID 扩展（如果尚未启用）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_image_storage_filename ON image_storage(filename);
CREATE INDEX IF NOT EXISTS idx_image_storage_product_id ON image_storage(product_id);
CREATE INDEX IF NOT EXISTS idx_image_storage_created_at ON image_storage(created_at);

-- 添加表和列的注释
COMMENT ON TABLE image_storage IS '产品图片存储表，用于生产环境图片备份';
COMMENT ON COLUMN image_storage.id IS '主键ID';
COMMENT ON COLUMN image_storage.filename IS '图片文件名';
COMMENT ON COLUMN image_storage.data IS '图片的base64数据URL格式';
COMMENT ON COLUMN image_storage.mime_type IS '图片MIME类型（如image/jpeg）';
COMMENT ON COLUMN image_storage.size IS '图片文件大小（字节）';
COMMENT ON COLUMN image_storage.product_id IS '关联的产品ID（可选）';
COMMENT ON COLUMN image_storage.created_at IS '创建时间';
COMMENT ON COLUMN image_storage.updated_at IS '更新时间';

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建触发器
DROP TRIGGER IF EXISTS update_image_storage_updated_at ON image_storage;
CREATE TRIGGER update_image_storage_updated_at 
    BEFORE UPDATE ON image_storage 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 验证表创建
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'image_storage' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 显示创建结果
SELECT 
    'image_storage table created successfully' as status,
    COUNT(*) as current_records
FROM image_storage;

-- ============================================================
-- 执行完成后，您应该看到：
-- 1. 表结构信息
-- 2. "image_storage table created successfully" 消息
-- 3. 当前记录数（应该是0）
-- ============================================================
