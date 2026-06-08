-- Codinou Admin Platform schema

-- Enums
CREATE TYPE admin_role AS ENUM ('owner', 'admin', 'sales', 'viewer');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'lost');
CREATE TYPE order_status AS ENUM ('draft', 'checkout_started', 'paid', 'cancelled');
CREATE TYPE project_stage AS ENUM ('discovery', 'build', 'review', 'launched');
CREATE TYPE note_target AS ENUM ('lead', 'order', 'project');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'void');
CREATE TYPE invite_status AS ENUM ('pending', 'accepted', 'expired');

-- Profiles (linked to auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role admin_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Leads (contact form)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service_interest TEXT,
  message TEXT NOT NULL,
  status lead_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Packages catalog
CREATE TABLE packages (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL,
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  base_price_eur INTEGER NOT NULL,
  deposit_eur INTEGER,
  timeline_en TEXT,
  timeline_fr TEXT,
  best_for_en TEXT,
  best_for_fr TEXT,
  features JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE package_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  field_id TEXT NOT NULL,
  field_type TEXT NOT NULL,
  label_key TEXT NOT NULL,
  placeholder_key TEXT,
  required BOOLEAN NOT NULL DEFAULT false,
  options JSONB,
  rows INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(package_id, field_id)
);

CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT REFERENCES packages(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL,
  field_id TEXT,
  option_value TEXT,
  amount_eur INTEGER NOT NULL,
  label_key TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id TEXT NOT NULL REFERENCES packages(id),
  status order_status NOT NULL DEFAULT 'draft',
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  company TEXT,
  brief JSONB NOT NULL DEFAULT '{}',
  quote JSONB,
  total_eur INTEGER,
  deposit_eur INTEGER,
  stripe_session_id TEXT UNIQUE,
  currency TEXT DEFAULT 'eur',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects (post-sale pipeline)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE REFERENCES orders(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  client_name TEXT,
  client_email TEXT,
  package_id TEXT REFERENCES packages(id),
  stage project_stage NOT NULL DEFAULT 'discovery',
  total_eur INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type note_target NOT NULL,
  target_id UUID NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  amount_eur INTEGER NOT NULL,
  status invoice_status NOT NULL DEFAULT 'draft',
  stripe_invoice_id TEXT,
  stripe_payment_link TEXT,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Team invites
CREATE TABLE team_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role admin_role NOT NULL DEFAULT 'viewer',
  invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status invite_status NOT NULL DEFAULT 'pending',
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_stripe ON orders(stripe_session_id);
CREATE INDEX idx_projects_stage ON projects(stage);
CREATE INDEX idx_notes_target ON notes(target_type, target_id);
CREATE INDEX idx_order_events_order ON order_events(order_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER leads_updated BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER orders_updated BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER projects_updated BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER packages_updated BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER invoices_updated BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  invite_record team_invites%ROWTYPE;
  assigned_role admin_role := 'viewer';
BEGIN
  SELECT * INTO invite_record FROM team_invites
  WHERE email = NEW.email AND status = 'pending' AND expires_at > now()
  ORDER BY created_at DESC LIMIT 1;

  IF invite_record.id IS NOT NULL THEN
    assigned_role := invite_record.role;
    UPDATE team_invites SET status = 'accepted' WHERE id = invite_record.id;
  ELSIF NOT EXISTS (SELECT 1 FROM profiles) THEN
    assigned_role := 'owner';
  END IF;

  INSERT INTO profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), assigned_role);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Helper: check admin role
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin', 'sales', 'viewer')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION has_write_role()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin', 'sales')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION has_admin_role()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invites ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY profiles_select ON profiles FOR SELECT TO authenticated
  USING (is_admin_user());
CREATE POLICY profiles_update_self ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR has_admin_role());

-- Leads policies
CREATE POLICY leads_select ON leads FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY leads_update ON leads FOR UPDATE TO authenticated USING (has_write_role());
CREATE POLICY leads_insert ON leads FOR INSERT TO authenticated WITH CHECK (has_write_role());

-- Orders policies
CREATE POLICY orders_select ON orders FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY orders_update ON orders FOR UPDATE TO authenticated USING (has_write_role());

-- Order events
CREATE POLICY order_events_select ON order_events FOR SELECT TO authenticated USING (is_admin_user());

-- Projects
CREATE POLICY projects_select ON projects FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY projects_update ON projects FOR UPDATE TO authenticated USING (has_write_role());
CREATE POLICY projects_insert ON projects FOR INSERT TO authenticated WITH CHECK (has_write_role());

-- Notes
CREATE POLICY notes_select ON notes FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY notes_insert ON notes FOR INSERT TO authenticated WITH CHECK (has_write_role());
CREATE POLICY notes_delete ON notes FOR DELETE TO authenticated USING (has_admin_role());

-- Packages (read all authenticated; write admin only)
CREATE POLICY packages_select ON packages FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY packages_select_anon ON packages FOR SELECT TO anon USING (is_published = true);
CREATE POLICY packages_write ON packages FOR ALL TO authenticated USING (has_admin_role()) WITH CHECK (has_admin_role());

CREATE POLICY package_fields_select ON package_fields FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY package_fields_select_anon ON package_fields FOR SELECT TO anon
  USING (EXISTS (SELECT 1 FROM packages p WHERE p.id = package_id AND p.is_published = true));
CREATE POLICY package_fields_write ON package_fields FOR ALL TO authenticated USING (has_admin_role()) WITH CHECK (has_admin_role());

CREATE POLICY pricing_rules_select ON pricing_rules FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY pricing_rules_select_anon ON pricing_rules FOR SELECT TO anon USING (is_published = true);
CREATE POLICY pricing_rules_write ON pricing_rules FOR ALL TO authenticated USING (has_admin_role()) WITH CHECK (has_admin_role());

-- Invoices
CREATE POLICY invoices_select ON invoices FOR SELECT TO authenticated USING (is_admin_user());
CREATE POLICY invoices_write ON invoices FOR ALL TO authenticated USING (has_admin_role()) WITH CHECK (has_admin_role());

-- Team invites
CREATE POLICY team_invites_select ON team_invites FOR SELECT TO authenticated USING (has_admin_role());
CREATE POLICY team_invites_write ON team_invites FOR ALL TO authenticated USING (has_admin_role()) WITH CHECK (has_admin_role());
