-- =============================================
-- SITE CONFIG TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS site_config (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Config is viewable by everyone" ON site_config
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Config is editable by authenticated users" ON site_config
  FOR ALL USING (auth.role() = 'authenticated');

-- Default Values
INSERT INTO site_config (key, value) VALUES
  ('site_title', 'My Bookmarks'),
  ('logo_url', ''), 
  ('favicon_url', '/favicon.ico')
ON CONFLICT (key) DO NOTHING;
