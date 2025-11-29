/*
  # GenFuture Professional Features Schema

  ## Overview
  This migration creates the complete database schema for GenFuture Career Platform's
  professional features including user authentication, bookmarks, application tracking,
  notes, and activity history.

  ## 1. New Tables

  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `first_name` (text)
  - `last_name` (text)
  - `avatar_url` (text)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `universities`
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `country` (text)
  - `city` (text)
  - `ranking` (integer)
  - `type` (text)
  - `website` (text)
  - `description` (text)
  - `created_at` (timestamptz, default now())

  ### `courses`
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `description` (text)
  - `duration` (text)
  - `degree_type` (text)
  - `field` (text)
  - `created_at` (timestamptz, default now())

  ### `career_paths`
  - `id` (uuid, primary key)
  - `title` (text, not null)
  - `description` (text)
  - `salary_min` (integer)
  - `salary_max` (integer)
  - `growth_rate` (decimal)
  - `industry` (text)
  - `created_at` (timestamptz, default now())

  ### `bookmarks`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, not null)
  - `item_type` (text, not null) - 'university', 'course', or 'career_path'
  - `item_id` (uuid, not null)
  - `item_name` (text, not null)
  - `notes` (text)
  - `created_at` (timestamptz, default now())

  ### `applications`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, not null)
  - `university_id` (uuid, references universities)
  - `university_name` (text, not null)
  - `course_name` (text)
  - `status` (text, default 'planning') - 'planning', 'applying', 'submitted', 'accepted', 'rejected', 'waitlisted'
  - `deadline` (date)
  - `application_url` (text)
  - `notes` (text)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `user_notes`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, not null)
  - `item_type` (text, not null)
  - `item_id` (uuid, not null)
  - `item_name` (text, not null)
  - `content` (text, not null)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `user_goals`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, not null)
  - `title` (text, not null)
  - `description` (text)
  - `target_date` (date)
  - `completed` (boolean, default false)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### `activity_log`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles, not null)
  - `action_type` (text, not null) - 'viewed', 'saved', 'applied', 'compared'
  - `item_type` (text, not null)
  - `item_id` (uuid)
  - `item_name` (text)
  - `metadata` (jsonb)
  - `created_at` (timestamptz, default now())

  ## 2. Security (Row Level Security)
  
  All tables have RLS enabled with the following policies:
  - Users can only read/write their own data
  - Public reference data (universities, courses, career_paths) is readable by authenticated users
  - All policies check authentication using auth.uid()

  ## 3. Indexes
  
  Performance indexes added for:
  - Bookmarks by user and type
  - Applications by user and status
  - Activity log by user and date
  - Notes by user

  ## 4. Important Notes
  
  - All user data is protected by RLS
  - Timestamps are automatically managed
  - Foreign keys ensure data integrity
  - Metadata stored as JSONB for flexibility
*/

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create universities reference table
CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text,
  city text,
  ranking integer,
  type text,
  website text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create courses reference table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  duration text,
  degree_type text,
  field text,
  created_at timestamptz DEFAULT now()
);

-- Create career paths reference table
CREATE TABLE IF NOT EXISTS career_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  salary_min integer,
  salary_max integer,
  growth_rate decimal,
  industry text,
  created_at timestamptz DEFAULT now()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('university', 'course', 'career_path')),
  item_id uuid NOT NULL,
  item_name text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  university_id uuid REFERENCES universities(id) ON DELETE SET NULL,
  university_name text NOT NULL,
  course_name text,
  status text DEFAULT 'planning' CHECK (status IN ('planning', 'applying', 'submitted', 'accepted', 'rejected', 'waitlisted')),
  deadline date,
  application_url text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user notes table
CREATE TABLE IF NOT EXISTS user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id uuid NOT NULL,
  item_name text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user goals table
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_date date,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN ('viewed', 'saved', 'applied', 'compared', 'searched')),
  item_type text NOT NULL,
  item_id uuid,
  item_name text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Universities policies (public read for authenticated users)
CREATE POLICY "Authenticated users can view universities"
  ON universities FOR SELECT
  TO authenticated
  USING (true);

-- Courses policies (public read for authenticated users)
CREATE POLICY "Authenticated users can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

-- Career paths policies (public read for authenticated users)
CREATE POLICY "Authenticated users can view career paths"
  ON career_paths FOR SELECT
  TO authenticated
  USING (true);

-- Bookmarks policies
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON bookmarks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Applications policies
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON applications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User notes policies
CREATE POLICY "Users can view own notes"
  ON user_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON user_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON user_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON user_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User goals policies
CREATE POLICY "Users can view own goals"
  ON user_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON user_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON user_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON user_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Activity log policies
CREATE POLICY "Users can view own activity"
  ON activity_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity"
  ON activity_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_type ON bookmarks(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_id ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_user_date ON activity_log(user_id, created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notes_updated_at
  BEFORE UPDATE ON user_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
