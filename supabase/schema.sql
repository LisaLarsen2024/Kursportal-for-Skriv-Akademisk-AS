-- Profiler
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  has_paid_access BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Moduler
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leksjoner
CREATE TABLE lessons (
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

-- Fremgang
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brukere kan lese egen profil"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Brukere kan oppdatere egen profil"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Betalte brukere kan lese moduler"
  ON modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.has_paid_access = TRUE
    )
  );

CREATE POLICY "Betalte brukere kan lese leksjoner"
  ON lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.has_paid_access = TRUE
    )
  );

CREATE POLICY "Bruker kan lese egen fremgang"
  ON user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Bruker kan opprette egen fremgang"
  ON user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Bruker kan oppdatere egen fremgang"
  ON user_progress FOR UPDATE USING (auth.uid() = user_id);
