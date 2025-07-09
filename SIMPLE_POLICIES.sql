-- 简化策略 - 允许所有人访问所有数据
-- 如果上面的策略太复杂，使用这个简化版本

-- 删除所有策略
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'categories') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON categories';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'products') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON products';
    END LOOP;
END $$;

-- 创建最简单的策略 - 允许所有人访问
CREATE POLICY "allow_all_categories" ON categories FOR ALL USING (true);
CREATE POLICY "allow_all_products" ON products FOR ALL USING (true);

-- 验证数据
SELECT 'Categories in database:' as info, count(*) as count FROM categories;
SELECT 'Products in database:' as info, count(*) as count FROM products;

-- 显示实际数据
SELECT 'Category data:' as info;
SELECT id, name, is_active FROM categories;

SELECT 'Product data:' as info;
SELECT id, name, price, is_active FROM products LIMIT 3;
