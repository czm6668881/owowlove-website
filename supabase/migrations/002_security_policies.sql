-- OWOWLOVE.COM Security Policies
-- Row Level Security (RLS) configuration

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Categories policies (公开可见)
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage categories" ON categories
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'owowlove@163.com'
  );

-- Products policies (公开可见)
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Only admins can manage products" ON products
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'owowlove@163.com'
  );

-- Users policies (私有数据)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can register" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view all users" ON users
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'owowlove@163.com'
  );

CREATE POLICY "Only admins can manage users" ON users
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'owowlove@163.com'
  );

-- Orders policies (私有数据)
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can view all orders" ON orders
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'owowlove@163.com'
  );

CREATE POLICY "Only admins can manage orders" ON orders
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'owowlove@163.com'
  );

-- Favorites policies (用户私有)
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Contact messages policies (管理员可见)
CREATE POLICY "Anyone can create contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages" ON contact_messages
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'owowlove@163.com'
  );

CREATE POLICY "Only admins can manage contact messages" ON contact_messages
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin' OR 
    auth.jwt() ->> 'email' = 'owowlove@163.com'
  );

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user(
  admin_email TEXT,
  admin_password TEXT
)
RETURNS UUID AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Insert admin user
  INSERT INTO users (
    email,
    password_hash,
    first_name,
    last_name,
    role
  ) VALUES (
    admin_email,
    crypt(admin_password, gen_salt('bf')),
    'Admin',
    'User',
    'admin'
  ) RETURNING id INTO admin_id;
  
  RETURN admin_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
