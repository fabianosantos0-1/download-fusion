-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_type TEXT NOT NULL CHECK (duration_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'annual')),
  duration_value INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gift cards table
CREATE TABLE public.gift_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  subscription_plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  email TEXT NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create resellers table
CREATE TABLE public.resellers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  commission_percentage DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  created_by UUID NOT NULL REFERENCES public.admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment transactions table
CREATE TABLE public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mercado_pago_id TEXT,
  subscription_plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  gift_card_id UUID REFERENCES public.gift_cards(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site settings table for ads and configurations
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing access for now, will refine later)
CREATE POLICY "Allow admin access to admin_users" ON public.admin_users FOR ALL USING (true);
CREATE POLICY "Allow read access to subscription_plans" ON public.subscription_plans FOR SELECT USING (active = true);
CREATE POLICY "Allow admin write access to subscription_plans" ON public.subscription_plans FOR ALL USING (true);
CREATE POLICY "Allow access to gift_cards" ON public.gift_cards FOR ALL USING (true);
CREATE POLICY "Allow access to resellers" ON public.resellers FOR ALL USING (true);
CREATE POLICY "Allow access to payment_transactions" ON public.payment_transactions FOR ALL USING (true);
CREATE POLICY "Allow access to site_settings" ON public.site_settings FOR ALL USING (true);

-- Insert default admin user (password will be hashed in application)
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('administrator', '$2b$10$placeholder_hash');

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, duration_type, duration_value, price) VALUES
('Plano Diário', 'daily', 1, 2.99),
('Plano Semanal', 'weekly', 1, 9.99),
('Plano Mensal', 'monthly', 1, 29.99),
('Plano Trimestral', 'quarterly', 3, 79.99),
('Plano Anual', 'annual', 12, 299.99);

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('ad_space_1', ''),
('ad_space_2', ''),
('mercado_pago_access_token', ''),
('mercado_pago_public_key', '');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();