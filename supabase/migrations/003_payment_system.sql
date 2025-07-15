-- Payment System Tables
-- Migration 003: Add payment system support

-- Payment methods configuration table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL, -- 'alipay', 'wechat', 'credit_card', 'paypal'
  display_name VARCHAR(255) NOT NULL, -- '支付宝', '微信支付', '信用卡', 'PayPal'
  icon VARCHAR(255), -- Icon URL or name
  is_active BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}', -- Provider-specific configuration
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES payment_methods(id),
  
  -- Transaction details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'CNY',
  
  -- Payment provider details
  provider VARCHAR(50) NOT NULL, -- 'alipay', 'wechat', 'stripe', etc.
  provider_transaction_id VARCHAR(255), -- External transaction ID
  provider_order_id VARCHAR(255), -- External order ID
  
  -- Status tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  
  -- Payment flow data
  payment_url TEXT, -- For redirect-based payments
  qr_code_url TEXT, -- For QR code payments
  payment_data JSONB DEFAULT '{}', -- Provider-specific payment data
  
  -- Timestamps
  paid_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment refunds table
CREATE TABLE payment_refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES payment_transactions(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Refund details
  amount DECIMAL(10,2) NOT NULL,
  reason TEXT,
  
  -- Provider details
  provider_refund_id VARCHAR(255), -- External refund ID
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Timestamps
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment webhooks log table (for debugging and audit)
CREATE TABLE payment_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  transaction_id UUID REFERENCES payment_transactions(id),
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX idx_payment_transactions_provider ON payment_transactions(provider);
CREATE INDEX idx_payment_transactions_provider_transaction_id ON payment_transactions(provider_transaction_id);
CREATE INDEX idx_payment_refunds_transaction_id ON payment_refunds(transaction_id);
CREATE INDEX idx_payment_refunds_order_id ON payment_refunds(order_id);
CREATE INDEX idx_payment_webhooks_provider ON payment_webhooks(provider);
CREATE INDEX idx_payment_webhooks_processed ON payment_webhooks(processed);

-- Create triggers for updated_at
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_refunds_updated_at BEFORE UPDATE ON payment_refunds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default payment methods
INSERT INTO payment_methods (name, display_name, icon, is_active, sort_order) VALUES
('alipay', '支付宝', 'alipay-icon', true, 1),
('wechat', '微信支付', 'wechat-icon', true, 2),
('credit_card', '信用卡', 'credit-card-icon', true, 3),
('paypal', 'PayPal', 'paypal-icon', false, 4);
