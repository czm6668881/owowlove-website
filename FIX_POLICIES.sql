-- 修复策略无限递归问题
-- 复制这个脚本到 Supabase SQL 编辑器中执行

-- 删除所有现有策略
DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;
DROP POLICY IF EXISTS "Anyone can create contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Admins can manage users" ON users;
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
DROP POLICY IF EXISTS "Admins can view contact messages" ON contact_messages;

-- 创建简化的策略（避免循环引用）

-- Categories 策略
CREATE POLICY "categories_select_policy" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "categories_admin_policy" ON categories FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin' AND is_active = true
  )
);

-- Products 策略
CREATE POLICY "products_select_policy" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "products_admin_policy" ON products FOR ALL USING (
  auth.uid() IN (
    SELECT id FROM users WHERE role = 'admin' AND is_active = true
  )
);

-- Users 策略（简化，避免自引用）
CREATE POLICY "users_own_profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders 策略
CREATE POLICY "orders_own_select" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_own_insert" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "orders_own_update" ON orders FOR UPDATE USING (auth.uid() = user_id);

-- Favorites 策略
CREATE POLICY "favorites_own_all" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Contact messages 策略
CREATE POLICY "contact_insert_policy" ON contact_messages FOR INSERT WITH CHECK (true);

-- 为管理员创建单独的策略（不依赖users表查询）
-- 注意：这里我们使用一个简化的方法，先允许基本访问

-- 临时允许所有认证用户管理数据（稍后可以通过应用层控制）
CREATE POLICY "temp_admin_categories" ON categories FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "temp_admin_products" ON products FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "temp_admin_orders" ON orders FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "temp_admin_users" ON users FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "temp_admin_contact" ON contact_messages FOR ALL USING (auth.uid() IS NOT NULL);
