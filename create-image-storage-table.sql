-- 创建图片存储表，用于生产环境图片备份
-- 这个表将存储所有产品图片的base64数据，确保在生产环境中图片能够正常显示

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

-- 添加注释
COMMENT ON TABLE image_storage IS '产品图片存储表，用于生产环境图片备份';
COMMENT ON COLUMN image_storage.filename IS '图片文件名';
COMMENT ON COLUMN image_storage.data IS '图片的base64数据URL';
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

-- 插入示例数据（可选）
-- INSERT INTO image_storage (filename, data, mime_type, size) VALUES
-- ('example.jpg', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...', 'image/jpeg', 12345);

-- 查询表结构
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'image_storage' 
ORDER BY ordinal_position;
