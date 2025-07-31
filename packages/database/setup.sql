
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('credit', 'debit')),
  description TEXT NOT NULL DEFAULT '',
  value DECIMAL(10,2) NOT NULL CHECK (value > 0),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  attachment_url TEXT NULL,
  attachment_name TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('transaction-attachments', 'transaction-attachments', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can view their own transaction attachments" ON storage.objects
FOR SELECT USING (bucket_id = 'transaction-attachments');

CREATE POLICY "Users can upload their own transaction attachments" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'transaction-attachments');

CREATE POLICY "Users can update their own transaction attachments" ON storage.objects
FOR UPDATE USING (bucket_id = 'transaction-attachments');

CREATE POLICY "Users can delete their own transaction attachments" ON storage.objects
FOR DELETE USING (bucket_id = 'transaction-attachments');

INSERT INTO transactions (id, type, description, value, date) VALUES
  ('1748467414391', 'debit', 'Transferência PIX', 100.50, '2025-05-28T21:23:34.391Z'),
  ('1748468304360', 'credit', 'Depósito em conta', 2000.00, '2025-05-28T21:38:24.360Z'),
  ('1748468368682', 'debit', 'Compra no supermercado', 85.30, '2025-05-28T21:39:28.682Z'),
  ('1748468618374', 'credit', 'Transferência recebida', 500.00, '2025-05-28T21:43:38.374Z'),
  ('1748469244450', 'debit', 'Pagamento de conta', 150.75, '2025-05-28T21:54:04.450Z')
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
