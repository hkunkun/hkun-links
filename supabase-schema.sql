-- =============================================
-- HKun-Links Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL DEFAULT '📁',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- =============================================
-- LINKS TABLE
-- =============================================  
CREATE TABLE IF NOT EXISTS links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  favicon_url TEXT,
  tags TEXT[],
  sort_order INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_links_category_id ON links(category_id);
CREATE INDEX IF NOT EXISTS idx_links_sort_order ON links(sort_order);
CREATE INDEX IF NOT EXISTS idx_links_is_favorite ON links(is_favorite);
CREATE INDEX IF NOT EXISTS idx_links_tags ON links USING GIN(tags);

-- Full text search index for search functionality
CREATE INDEX IF NOT EXISTS idx_links_search ON links USING GIN(
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- =============================================
-- CLICK EVENTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS click_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID REFERENCES links(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  ip_hash TEXT
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_click_events_link_id ON click_events(link_id);
CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at ON click_events(clicked_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, authenticated write
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are editable by authenticated users" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Links: Public read, authenticated write
CREATE POLICY "Links are viewable by everyone" ON links
  FOR SELECT USING (true);

CREATE POLICY "Links are editable by authenticated users" ON links
  FOR ALL USING (auth.role() = 'authenticated');

-- Click Events: Public insert (for tracking), authenticated read
CREATE POLICY "Anyone can insert click events" ON click_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Click events are viewable by authenticated users" ON click_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SAMPLE DATA (Optional - Comment out if not needed)
-- =============================================

-- Uncomment to add sample categories
/*
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Social Media', 'social-media', '📱', 0),
  ('Development', 'development', '💻', 1),
  ('News', 'news', '📰', 2),
  ('Entertainment', 'entertainment', '🎬', 3);
*/
