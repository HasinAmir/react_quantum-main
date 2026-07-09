-- ============================================
-- QuantumSim Forum — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Users table (synced from Firebase auth)
CREATE TABLE users (
  id TEXT PRIMARY KEY,                -- Firebase UID
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT,
  role TEXT CHECK (role IN ('student', 'educator')) DEFAULT 'student',
  experience TEXT CHECK (experience IN ('beginner', 'intermediate', 'researcher')),
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('question', 'opinion')) NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_best_answer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Votes table (one vote per user per post)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  value INTEGER CHECK (value IN (-1, 1)) NOT NULL,
  UNIQUE(post_id, user_id)
);

-- ===== Indexes =====
CREATE INDEX idx_posts_user ON posts(user_id);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_votes_post ON votes(post_id);
CREATE INDEX idx_votes_user_post ON votes(user_id, post_id);

-- ===== Row Level Security =====
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Public read users"  ON users  FOR SELECT USING (true);
CREATE POLICY "Public read posts"  ON posts  FOR SELECT USING (true);
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Public read votes"  ON votes  FOR SELECT USING (true);

-- Anyone can insert/update (auth handled in app layer via Firebase)
CREATE POLICY "Allow insert users"    ON users    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update users"    ON users    FOR UPDATE USING (true);
CREATE POLICY "Allow insert posts"    ON posts    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow insert comments" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update comments" ON comments FOR UPDATE USING (true);
CREATE POLICY "Allow insert votes"    ON votes    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update votes"    ON votes    FOR UPDATE USING (true);
CREATE POLICY "Allow delete votes"    ON votes    FOR DELETE USING (true);
CREATE POLICY "Allow update posts"    ON posts    FOR UPDATE USING (true);
