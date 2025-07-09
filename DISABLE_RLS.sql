-- 完全禁用行级安全 - 最激进的修复方法
-- 这会让所有人都能访问数据

-- 禁用行级安全
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;

-- 验证数据
SELECT 'Categories count:' as info, count(*) as count FROM categories;
SELECT 'Products count:' as info, count(*) as count FROM products;

-- 显示数据
SELECT 'Categories:' as info;
SELECT id, name, is_active FROM categories;

SELECT 'Products:' as info;
SELECT id, name, price, is_active FROM products;
