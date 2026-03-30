import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ProgressContextValue {
  completedLessonIds: Set<string>;
  toggleComplete: (lessonId: string) => Promise<void>;
  loading: boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
};

const LOCAL_KEY = 'skriv-akademisk-progress';

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      const stored = localStorage.getItem(LOCAL_KEY);
      try {
        setCompletedLessonIds(stored ? new Set(JSON.parse(stored)) : new Set());
      } catch {
        setCompletedLessonIds(new Set());
      }
      return;
    }

    setLoading(true);
    supabase
      .from('user_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('completed', true)
      .then(({ data }) => {
        setCompletedLessonIds(new Set((data ?? []).map((r: { lesson_id: string }) => r.lesson_id)));
        setLoading(false);
      });
  }, [user]);

  const toggleComplete = useCallback(async (lessonId: string) => {
    const isCompleted = completedLessonIds.has(lessonId);
    const next = new Set(completedLessonIds);
    if (isCompleted) {
      next.delete(lessonId);
    } else {
      next.add(lessonId);
    }
    setCompletedLessonIds(next);

    if (!user) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(Array.from(next)));
      return;
    }

    if (isCompleted) {
      await supabase
        .from('user_progress')
        .update({ completed: false, completed_at: null })
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId);
    } else {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        });
    }
  }, [completedLessonIds, user]);

  return (
    <ProgressContext.Provider value={{ completedLessonIds, toggleComplete, loading }}>
      {children}
    </ProgressContext.Provider>
  );
};
