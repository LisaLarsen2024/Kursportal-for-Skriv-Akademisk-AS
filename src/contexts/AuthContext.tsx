import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types/course';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

const fetchProfile = async (userId: string, userEmail?: string, accessToken?: string): Promise<Profile | null> => {
  const isAdminEmail = ADMIN_EMAILS.includes((userEmail ?? '').toLowerCase());

  let data: { id: string; full_name: string | null; has_paid_access: boolean; is_admin: boolean } | null = null;

  if (accessToken) {
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        data = await res.json();
      }
    } catch {
      // fall through to Supabase direct
    }
  }

  if (!data) {
    const { data: sbData, error } = await supabase
      .from('profiles')
      .select('id, full_name, has_paid_access, is_admin')
      .eq('id', userId)
      .single();
    if (!error && sbData) data = sbData;
  }

  // Check course_access table for individual course access
  const { data: accessRows } = await supabase
    .from('course_access')
    .select('course_id')
    .eq('user_id', userId);
  const norskAccess = (accessRows ?? []).some((r) => r.course_id === 'norsk-vg3');
  const ungdomsskoleAccess = (accessRows ?? []).some((r) => r.course_id === 'ungdomsskole');

  if (!data) {
    if (isAdminEmail) {
      return {
        id: userId,
        fullName: 'Lisa Sveen Larsen',
        email: userEmail ?? '',
        hasPaidAccess: true,
        hasNorskAccess: true,
        hasUngdomsskoleAccess: true,
        isAdmin: true,
      };
    }
    return null;
  }

  return {
    id: data.id,
    fullName: data.full_name ?? '',
    email: userEmail ?? '',
    hasPaidAccess: isAdminEmail ? true : (data.has_paid_access ?? false),
    hasNorskAccess: isAdminEmail ? true : norskAccess,
    hasUngdomsskoleAccess: isAdminEmail ? true : ungdomsskoleAccess,
    isAdmin: isAdminEmail ? true : (data.is_admin ?? false),
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchProfile(data.session.user.id, data.session.user.email, data.session.access_token).then(setProfile);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        fetchProfile(newSession.user.id, newSession.user.email, newSession.access_token).then(setProfile);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: fullName,
        has_paid_access: false,
        is_admin: false,
      });
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      const updated = await fetchProfile(data.session.user.id, data.session.user.email, data.session.access_token);
      setProfile(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
