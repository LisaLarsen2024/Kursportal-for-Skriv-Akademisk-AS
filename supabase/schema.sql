-- =============================================
-- Skriv Akademisk – Supabase Database Schema
-- Kjør dette i Supabase SQL Editor
-- =============================================

-- Profiler (kobles til auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  has_paid_access BOOLEAN DEFAULT FALSE NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moduler (kursinnhold)
CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leksjoner
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  duration_minutes INTEGER,
  sort_order INTEGER NOT NULL,
  resource_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Brukerprogresjon
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- =============================================
-- Row Level Security
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Profiler: brukere kan lese og oppdatere sin egen
CREATE POLICY "Brukere kan lese egen profil"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Brukere kan oppdatere egen profil"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Brukere kan opprette egen profil"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin kan lese alle profiler (brukes av adminpanel)
CREATE POLICY "Admins kan lese alle profiler"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
  );

CREATE POLICY "Admins kan oppdatere alle profiler"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = TRUE)
  );

-- Moduler: alle innloggede brukere med betalt tilgang kan lese
CREATE POLICY "Betalte brukere kan lese moduler"
  ON modules FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.has_paid_access = TRUE)
  );

-- Leksjoner: alle innloggede brukere med betalt tilgang kan lese
CREATE POLICY "Betalte brukere kan lese leksjoner"
  ON lessons FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.has_paid_access = TRUE)
  );

-- Progresjon: brukere kan lese, opprette og oppdatere sin egen
CREATE POLICY "Bruker kan lese egen fremgang"
  ON user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Bruker kan opprette egen fremgang"
  ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Bruker kan oppdatere egen fremgang"
  ON user_progress FOR UPDATE USING (auth.uid() = user_id);

-- =============================================
-- Trigger: opprett profil automatisk ved registrering
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, has_paid_access, is_admin)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    FALSE,
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
