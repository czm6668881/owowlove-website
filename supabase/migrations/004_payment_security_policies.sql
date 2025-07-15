-- Payment System Security Policies
-- Migration 004: Add RLS policies for payment tables

-- Enable RLS on payment tables
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_webhooks ENABLE ROW LEVEL SECURITY;

-- Payment Methods Policies
-- Anyone can read active payment methods
CREATE POLICY "Anyone can read active payment methods" ON payment_methods
  FOR SELECT USING (is_active = true);

-- Only admins can manage payment methods
CREATE POLICY "Only admins can manage payment methods" ON payment_methods
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Payment Transactions Policies
-- Users can read their own transactions
CREATE POLICY "Users can read their own transactions" ON payment_transactions
  FOR SELECT USING (user_id = auth.uid());

-- Users can create transactions for their own orders
CREATE POLICY "Users can create transactions for their own orders" ON payment_transactions
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Only system can update transaction status (via service role)
CREATE POLICY "System can update transactions" ON payment_transactions
  FOR UPDATE USING (true);

-- Admins can read all transactions
CREATE POLICY "Admins can read all transactions" ON payment_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Payment Refunds Policies
-- Users can read their own refunds
CREATE POLICY "Users can read their own refunds" ON payment_refunds
  FOR SELECT USING (user_id = auth.uid());

-- Users can request refunds for their own transactions
CREATE POLICY "Users can request refunds for their own transactions" ON payment_refunds
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM payment_transactions 
      WHERE payment_transactions.id = transaction_id 
      AND payment_transactions.user_id = auth.uid()
    )
  );

-- Only system can update refund status
CREATE POLICY "System can update refunds" ON payment_refunds
  FOR UPDATE USING (true);

-- Admins can read all refunds
CREATE POLICY "Admins can read all refunds" ON payment_refunds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Payment Webhooks Policies
-- Only system can manage webhooks (service role only)
CREATE POLICY "Only system can manage webhooks" ON payment_webhooks
  FOR ALL USING (true);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user's payment transactions with order details
CREATE OR REPLACE FUNCTION get_user_payment_transactions()
RETURNS TABLE (
  id UUID,
  order_id UUID,
  amount DECIMAL(10,2),
  currency VARCHAR(3),
  provider VARCHAR(50),
  status VARCHAR(20),
  payment_url TEXT,
  qr_code_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  order_total DECIMAL(10,2),
  order_status VARCHAR(20)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pt.id,
    pt.order_id,
    pt.amount,
    pt.currency,
    pt.provider,
    pt.status,
    pt.payment_url,
    pt.qr_code_url,
    pt.paid_at,
    pt.expires_at,
    pt.created_at,
    o.total_amount as order_total,
    o.status as order_status
  FROM payment_transactions pt
  JOIN orders o ON pt.order_id = o.id
  WHERE pt.user_id = auth.uid()
  ORDER BY pt.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
