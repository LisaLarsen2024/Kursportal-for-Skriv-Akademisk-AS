import { Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProgressProvider } from './contexts/ProgressContext';
import Layout from './components/Layout';
import AdminPage from './pages/AdminPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import LessonPage from './pages/LessonPage';
import ModulePage from './pages/ModulePage';
import NorskDashboardPage from './pages/NorskDashboardPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PersonvernPage from './pages/PersonvernPage';
import ProfilePage from './pages/ProfilePage';
import ResourcesPage from './pages/ResourcesPage';
import UngdomskoleDashboardPage from './pages/UngdomskoleDashboardPage';
import UngdomskoleLandingPage from './pages/UngdomskoleLandingPage';
import VilkarPage from './pages/VilkarPage';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-teal border-t-transparent" />
      </div>
    );
  }

  const isAuthenticated = !!user;
  const hasPaidAccess = profile?.hasPaidAccess ?? false;
  const hasNorskAccess = profile?.hasNorskAccess ?? false;
  const hasUngdomsskoleAccess = profile?.hasUngdomsskoleAccess ?? false;
  const isAdmin = profile?.isAdmin ?? false;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route
          path="innlogging"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />}
        />
        <Route path="betaling" element={<PaymentPage />} />
        <Route
          path="betaling/suksess"
          element={isAuthenticated ? <PaymentSuccessPage /> : <Navigate to="/innlogging" replace />}
        />
        <Route
          path="dashboard"
          element={
            isAuthenticated && hasPaidAccess
              ? <DashboardPage />
              : isAuthenticated
              ? <Navigate to="/betaling" replace />
              : <Navigate to="/innlogging" replace />
          }
        />
        <Route
          path="modul/:moduleId"
          element={
            isAuthenticated && hasPaidAccess
              ? <ModulePage />
              : <Navigate to={isAuthenticated ? '/betaling' : '/innlogging'} replace />
          }
        />
        <Route
          path="leksjon/:lessonId"
          element={
            isAuthenticated && hasPaidAccess
              ? <LessonPage />
              : <Navigate to={isAuthenticated ? '/betaling' : '/innlogging'} replace />
          }
        />
        <Route
          path="ressurser"
          element={
            isAuthenticated && hasPaidAccess
              ? <ResourcesPage />
              : <Navigate to={isAuthenticated ? '/betaling' : '/innlogging'} replace />
          }
        />
        <Route
          path="profil"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/innlogging" replace />}
        />
        <Route
          path="admin"
          element={isAuthenticated && isAdmin ? <AdminPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="norsk/dashboard"
          element={
            isAuthenticated && hasNorskAccess
              ? <NorskDashboardPage />
              : <Navigate to={isAuthenticated ? '/betaling' : '/innlogging'} replace />
          }
        />
        <Route
          path="norsk/modul/:moduleId"
          element={
            isAuthenticated && hasNorskAccess
              ? <ModulePage />
              : <Navigate to={isAuthenticated ? '/betaling' : '/innlogging'} replace />
          }
        />
        <Route
          path="norsk/leksjon/:lessonId"
          element={
            isAuthenticated && hasNorskAccess
              ? <LessonPage />
              : <Navigate to={isAuthenticated ? '/betaling' : '/innlogging'} replace />
          }
        />
        <Route path="vilkar" element={<VilkarPage />} />
        <Route path="personvern" element={<PersonvernPage />} />
        <Route path="ungdomsskole" element={<UngdomskoleLandingPage />} />
        <Route
          path="ungdomsskole/dashboard"
          element={
            isAuthenticated && hasUngdomsskoleAccess
              ? <UngdomskoleDashboardPage />
              : <Navigate to={isAuthenticated ? '/ungdomsskole' : '/innlogging'} replace />
          }
        />
        <Route
          path="ungdomsskole/modul/:moduleId"
          element={
            isAuthenticated && hasUngdomsskoleAccess
              ? <ModulePage />
              : <Navigate to={isAuthenticated ? '/ungdomsskole' : '/innlogging'} replace />
          }
        />
        <Route
          path="ungdomsskole/leksjon/:lessonId"
          element={
            isAuthenticated && hasUngdomsskoleAccess
              ? <LessonPage />
              : <Navigate to={isAuthenticated ? '/ungdomsskole' : '/innlogging'} replace />
          }
        />
      </Route>
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProgressProvider>
        <AppRoutes />
      </ProgressProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
