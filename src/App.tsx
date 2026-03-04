import { Navigate, Route, Routes } from 'react-router-dom';
import { useMemo, useState } from 'react';
import Layout from './components/Layout';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import LessonPage from './pages/LessonPage';
import ModulePage from './pages/ModulePage';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';

const COMPLETED_STORAGE_KEY = 'skriv-akademisk-progress';

const getInitialCompleted = (): Set<string> => {
  const stored = localStorage.getItem(COMPLETED_STORAGE_KEY);
  if (!stored) return new Set<string>();

  try {
    return new Set<string>(JSON.parse(stored));
  } catch {
    return new Set<string>();
  }
};

const App = () => {
  const [email, setEmail] = useState('student@example.com');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPaidAccess, setHasPaidAccess] = useState(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(getInitialCompleted);

  const isAdmin = useMemo(() => email === 'admin@skrivakademisk.no', [email]);

  const persistProgress = (next: Set<string>) => {
    localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(Array.from(next)));
  };

  const onToggleComplete = (lessonId: string) => {
    const next = new Set(completedLessonIds);
    if (next.has(lessonId)) {
      next.delete(lessonId);
    } else {
      next.add(lessonId);
    }
    setCompletedLessonIds(next);
    persistProgress(next);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            isAuthenticated={isAuthenticated}
            hasPaidAccess={hasPaidAccess}
            onLogout={() => {
              setIsAuthenticated(false);
              setHasPaidAccess(false);
            }}
          />
        }
      >
        <Route index element={<LandingPage />} />
        <Route path="innlogging" element={<AuthPage onLogin={(nextEmail) => { setEmail(nextEmail); setIsAuthenticated(true); }} />} />
        <Route path="betaling" element={isAuthenticated ? <PaymentPage onPurchase={() => setHasPaidAccess(true)} /> : <Navigate to="/innlogging" replace />} />
        <Route
          path="dashboard"
          element={isAuthenticated && hasPaidAccess ? <DashboardPage completedLessonIds={completedLessonIds} /> : <Navigate to="/betaling" replace />}
        />
        <Route
          path="modul/:moduleId"
          element={isAuthenticated && hasPaidAccess ? <ModulePage completedLessonIds={completedLessonIds} /> : <Navigate to="/betaling" replace />}
        />
        <Route
          path="leksjon/:lessonId"
          element={
            isAuthenticated && hasPaidAccess ? (
              <LessonPage completedLessonIds={completedLessonIds} onToggleComplete={onToggleComplete} />
            ) : (
              <Navigate to="/betaling" replace />
            )
          }
        />
        <Route
          path="profil"
          element={
            isAuthenticated ? (
              <ProfilePage email={email} hasPaidAccess={hasPaidAccess} completedLessonIds={completedLessonIds} />
            ) : (
              <Navigate to="/innlogging" replace />
            )
          }
        />
        <Route path="admin" element={isAuthenticated && isAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
