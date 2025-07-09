-- 强制修复策略 - 完全禁用RLS然后重新启用
-- 这是最激进的修复方法

-- 完全禁用行级安全
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

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

-- 重新启用行级安全
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 创建最宽松的策略
CREATE POLICY "categories_allow_all_final" ON categories FOR ALL TO public USING (true);
CREATE POLICY "products_allow_all_final" ON products FOR ALL TO public USING (true);

-- 验证策略
SELECT 'Current policies for categories:' as info;
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'categories';

SELECT 'Current policies for products:' as info;
SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'products';

-- 测试数据访问
SELECT 'Testing categories access:' as info;
SELECT count(*) as category_count FROM categories;

SELECT 'Testing products access:' as info;
SELECT count(*) as product_count FROM products;

-- 显示前3个产品
SELECT 'Sample products:' as info;
SELECT id, name, price FROM products LIMIT 3;
