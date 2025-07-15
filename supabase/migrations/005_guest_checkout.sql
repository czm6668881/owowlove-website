-- Guest Checkout Support
-- Migration 005: Add support for guest checkout

-- Modify orders table to support guest orders
ALTER TABLE orders 
ALTER COLUMN user_id DROP NOT NULL;

-- Add guest information column
ALTER TABLE orders 
ADD COLUMN guest_info JSONB DEFAULT NULL;

-- Add comment to explain the guest_info structure
COMMENT ON COLUMN orders.guest_info IS 'Guest checkout information: {"first_name": "string", "last_name": "string", "email": "string", "phone": "string"}';

-- Update RLS policies to allow guest orders

-- Drop existing policies that require user authentication
DROP POLICY IF EXISTS "Users can read their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;

-- Create new policies that support both authenticated users and guests

-- Users can read their own orders (authenticated users only)
CREATE POLICY "Users can read their own orders" ON orders
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND user_id = auth.uid()
  );

-- Users can create orders for themselves (authenticated users)
CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND user_id = auth.uid()
  );

-- Allow guest order creation (no authentication required)
CREATE POLICY "Allow guest order creation" ON orders
  FOR INSERT WITH CHECK (
    user_id IS NULL AND guest_info IS NOT NULL
  );

-- Allow system to read all orders (for admin and payment processing)
CREATE POLICY "System can read all orders" ON orders
  FOR SELECT USING (true);

-- Allow system to update orders (for payment status updates)
CREATE POLICY "System can update orders" ON orders
  FOR UPDATE USING (true);

-- Create function to get order by ID (supports both user and guest orders)
CREATE OR REPLACE FUNCTION get_order_by_id(order_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  items JSONB,
  total_amount DECIMAL(10,2),
  status VARCHAR(20),
  shipping_address TEXT,
  payment_method VARCHAR(50),
  payment_status VARCHAR(20),
  guest_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- For authenticated users, return their order
  IF auth.uid() IS NOT NULL THEN
    RETURN QUERY
    SELECT o.id, o.user_id, o.items, o.total_amount, o.status, 
           o.shipping_address, o.payment_method, o.payment_status, 
           o.guest_info, o.created_at, o.updated_at
    FROM orders o
    WHERE o.id = order_id AND o.user_id = auth.uid();
  ELSE
    -- For guests, they cannot access orders without authentication
    -- This function should only be called by the system
    RETURN;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to validate guest order data
CREATE OR REPLACE FUNCTION validate_guest_order()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a guest order (user_id is NULL)
  IF NEW.user_id IS NULL THEN
    -- Ensure guest_info is provided and has required fields
    IF NEW.guest_info IS NULL THEN
      RAISE EXCEPTION 'Guest orders must include guest_info';
    END IF;
    
    -- Validate required guest info fields
    IF NOT (NEW.guest_info ? 'first_name' AND 
            NEW.guest_info ? 'last_name' AND 
            NEW.guest_info ? 'email' AND 
            NEW.guest_info ? 'phone') THEN
      RAISE EXCEPTION 'Guest info must include first_name, last_name, email, and phone';
    END IF;
    
    -- Validate email format (basic check)
    IF NOT (NEW.guest_info->>'email' ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') THEN
      RAISE EXCEPTION 'Invalid email format in guest_info';
    END IF;
  ELSE
    -- For authenticated users, guest_info should be NULL
    NEW.guest_info := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate guest orders
CREATE TRIGGER validate_guest_order_trigger
  BEFORE INSERT OR UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION validate_guest_order();

-- Create index for guest email lookups (for order tracking)
CREATE INDEX idx_orders_guest_email ON orders 
USING GIN ((guest_info->>'email')) 
WHERE guest_info IS NOT NULL;

-- Create index for guest orders
CREATE INDEX idx_orders_guest ON orders (id) 
WHERE user_id IS NULL AND guest_info IS NOT NULL;
