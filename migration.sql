-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    username TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'user',
    phone TEXT,
    profile_picture TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    office_address TEXT,
    agency_name TEXT,
    business_reg_number TEXT,
    agent_license TEXT,
    id_document_url TEXT,
    proof_of_identity_url TEXT,
    investment_type TEXT,
    company_name TEXT,
    plan_id TEXT, -- 'user', 'agent', 'investor'
    plan_price NUMERIC,
    plan_duration TEXT DEFAULT '1 month',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Safe: Add Foreign Key to Profiles only if missing
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_id_fkey') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Safe: Add Foreign Key to Payments only if missing
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'payments_user_id_fkey') THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
            -- Cleanup orphaned records before adding constraint
            DELETE FROM public.payments WHERE user_id NOT IN (SELECT id FROM public.profiles);
            
            ALTER TABLE public.payments ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 3. Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    listing_type TEXT NOT NULL,
    property_type TEXT NOT NULL,
    address JSONB NOT NULL,
    coordinates JSONB NOT NULL,
    price NUMERIC NOT NULL,
    purchase_price NUMERIC,
    details JSONB NOT NULL,
    description TEXT,
    neighborhood_info TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    virtual_tour_url TEXT,
    vr_tour_url TEXT,
    agent JSONB,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    featured BOOLEAN DEFAULT FALSE,
    verified BOOLEAN DEFAULT FALSE,
    smart_contract_ready BOOLEAN DEFAULT FALSE,
    views INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Active',
    date_listed BIGINT DEFAULT (extract(epoch from now()) * 1000)::bigint,
    saves INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create agent_verifications table
CREATE TABLE IF NOT EXISTS public.agent_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    agency_name TEXT,
    business_reg_number TEXT,
    agent_license TEXT,
    id_document_url TEXT,
    plan_id TEXT,
    price NUMERIC,
    duration TEXT DEFAULT '1 month',
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create investor_onboardings table
CREATE TABLE IF NOT EXISTS public.investor_onboardings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    investment_type TEXT,
    company_name TEXT,
    proof_of_identity_url TEXT,
    plan_id TEXT,
    price NUMERIC,
    duration TEXT DEFAULT '1 month',
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_holder TEXT,
    brand TEXT,
    last_four TEXT,
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    description TEXT,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_onboardings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies
DROP POLICY IF EXISTS "Allow all access to profiles" ON public.profiles;
CREATE POLICY "Allow all access to profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to properties" ON public.properties;
CREATE POLICY "Allow all access to properties" ON public.properties FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to agent_verifications" ON public.agent_verifications;
CREATE POLICY "Allow all access to agent_verifications" ON public.agent_verifications FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to investor_onboardings" ON public.investor_onboardings;
CREATE POLICY "Allow all access to investor_onboardings" ON public.investor_onboardings FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to payment_methods" ON public.payment_methods;
CREATE POLICY "Allow all access to payment_methods" ON public.payment_methods FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to payments" ON public.payments;
CREATE POLICY "Allow all access to payments" ON public.payments FOR ALL USING (true);

-- 8. Functions & Triggers
CREATE OR REPLACE FUNCTION public.increment_views(prop_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.properties
  SET views = views + 1
  WHERE id = prop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public, auth
AS $$
DECLARE
  meta_role TEXT;
BEGIN
  meta_role := COALESCE(new.raw_user_meta_data->>'role', 'user');

  -- Insert into profiles
  INSERT INTO public.profiles (
    id, 
    username, 
    full_name, 
    role, 
    phone, 
    office_address,
    agency_name,
    business_reg_number,
    agent_license,
    id_document_url,
    proof_of_identity_url,
    investment_type,
    company_name,
    plan_id,
    plan_price,
    plan_duration
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', new.email),
    new.raw_user_meta_data->>'full_name',
    meta_role,
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'office_address',
    new.raw_user_meta_data->>'agency_name',
    new.raw_user_meta_data->>'business_reg_number',
    new.raw_user_meta_data->>'agent_license',
    new.raw_user_meta_data->>'id_document_url',
    new.raw_user_meta_data->>'proof_of_identity_url',
    new.raw_user_meta_data->>'investment_type',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'plan_id',
    (new.raw_user_meta_data->>'plan_price')::NUMERIC,
    COALESCE(new.raw_user_meta_data->>'plan_duration', '1 month')
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    office_address = EXCLUDED.office_address,
    agency_name = EXCLUDED.agency_name,
    business_reg_number = EXCLUDED.business_reg_number,
    agent_license = EXCLUDED.agent_license,
    id_document_url = EXCLUDED.id_document_url,
    proof_of_identity_url = EXCLUDED.proof_of_identity_url,
    investment_type = EXCLUDED.investment_type,
    company_name = EXCLUDED.company_name,
    plan_id = EXCLUDED.plan_id,
    plan_price = EXCLUDED.plan_price,
    plan_duration = EXCLUDED.plan_duration;

  -- Handle Role-Specific Tables
  IF (meta_role = 'agent') THEN
    INSERT INTO public.agent_verifications (user_id, agency_name, business_reg_number, agent_license, id_document_url, plan_id, price, duration)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'agency_name',
      new.raw_user_meta_data->>'business_reg_number',
      new.raw_user_meta_data->>'agent_license',
      new.raw_user_meta_data->>'id_document_url',
      new.raw_user_meta_data->>'plan_id',
      (new.raw_user_meta_data->>'plan_price')::NUMERIC,
      COALESCE(new.raw_user_meta_data->>'plan_duration', '1 month')
    ) ON CONFLICT DO NOTHING;
  ELSIF (meta_role = 'investor') THEN
    INSERT INTO public.investor_onboardings (user_id, investment_type, company_name, proof_of_identity_url, plan_id, price, duration)
    VALUES (
      new.id,
      new.raw_user_meta_data->>'investment_type',
      new.raw_user_meta_data->>'company_name',
      new.raw_user_meta_data->>'proof_of_identity_url',
      new.raw_user_meta_data->>'plan_id',
      (new.raw_user_meta_data->>'plan_price')::NUMERIC,
      COALESCE(new.raw_user_meta_data->>'plan_duration', '1 month')
    ) ON CONFLICT DO NOTHING;
  END IF;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Create plan_prices table
CREATE TABLE IF NOT EXISTS public.plan_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_type TEXT NOT NULL, -- 'user', 'agent', 'investor'
    price NUMERIC NOT NULL,
    plan_currency TEXT NOT NULL, -- 'USD', 'ZAR', 'EUR', 'POUND', 'FRANC'
    UNIQUE(plan_type, plan_currency)
);

-- Insert initial data (calculated from ZAR)
-- Seeker: 0 ZAR
INSERT INTO public.plan_prices (plan_type, price, plan_currency) VALUES 
('user', 0, 'ZAR'), ('user', 0, 'USD'), ('user', 0, 'EUR'), ('user', 0, 'POUND'), ('user', 0, 'FRANC')
ON CONFLICT (plan_type, plan_currency) DO NOTHING;

-- Agent: 250 ZAR
INSERT INTO public.plan_prices (plan_type, price, plan_currency) VALUES 
('agent', 250, 'ZAR'),
('agent', 13.51, 'USD'),
('agent', 12.43, 'EUR'),
('agent', 10.67, 'POUND'),
('agent', 12.29, 'FRANC')
ON CONFLICT (plan_type, plan_currency) DO NOTHING;

-- Investor: 1490 ZAR
INSERT INTO public.plan_prices (plan_type, price, plan_currency) VALUES 
('investor', 1490, 'ZAR'),
('investor', 80.54, 'USD'),
('investor', 74.10, 'EUR'),
('investor', 63.63, 'POUND'),
('investor', 73.29, 'FRANC')
ON CONFLICT (plan_type, plan_currency) DO NOTHING;

-- Enable RLS for plan_prices
ALTER TABLE public.plan_prices ENABLE ROW LEVEL SECURITY;

-- Safe Policy Creation for plan_prices
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to plan_prices') THEN
        CREATE POLICY "Allow public read access to plan_prices" ON public.plan_prices FOR SELECT USING (true);
    END IF;
END $$;

-- 10. Create subscription_bills table
CREATE TABLE IF NOT EXISTS public.subscription_bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
    billing_period_start TIMESTAMP WITH TIME ZONE,
    billing_period_end TIMESTAMP WITH TIME ZONE,
    due_date TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Create subscription_payment_methods table (if different from general payment methods)
CREATE TABLE IF NOT EXISTS public.subscription_payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_holder TEXT,
    brand TEXT,
    last_four TEXT,
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 12. Enable RLS for new tables
ALTER TABLE public.subscription_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_payment_methods ENABLE ROW LEVEL SECURITY;

-- 13. RLS Policies for new tables
DROP POLICY IF EXISTS "Allow all access to subscription_bills" ON public.subscription_bills;
CREATE POLICY "Allow all access to subscription_bills" ON public.subscription_bills FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to subscription_payment_methods" ON public.subscription_payment_methods;
CREATE POLICY "Allow all access to subscription_payment_methods" ON public.subscription_payment_methods FOR ALL USING (true);
