import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { modules } from '../data/courseData';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';

const ProfilePage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { completedLessonIds } = useProgress();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalProgress = Math.round((completedLessonIds.size / totalLessons) * 100);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    setRefreshing(false);
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal text-2xl font-bold text-white">
            {profile?.fullName?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl text-brand-teal font-heading">
              {profile?.fullName || 'Min profil'}
            </h1>
            <p className="text-brand-ink/60 text-sm">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Oppdater tilgang"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-border px-3 py-2 text-xs font-medium text-brand-teal hover:bg-brand-teal/5 transition disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            {refreshed ? 'Oppdatert!' : 'Oppdater'}
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft space-y-4">
        <h2 className="text-lg font-semibold text-brand-teal">Tilgangsstatus</h2>
        {profile?.hasPaidAccess ? (
          <div className="flex items-center gap-3 rounded-xl bg-brand-teal/5 px-4 py-3">
            <span className="text-xl">✓</span>
            <div>
              <p className="font-medium text-brand-teal">Aktiv tilgang</p>
              <p className="text-sm text-brand-ink/60">Du har tilgang til alle moduler og leksjoner.</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl bg-brand-cream px-4 py-3">
            <div>
              <p className="font-medium text-brand-ink">Ingen aktiv tilgang</p>
              <p className="text-sm text-brand-ink/60">Kjøp tilgang for å starte kurset.</p>
            </div>
            <Link
              to="/betaling"
              className="rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white hover:bg-brand-coral/90 transition"
            >
              Kjøp nå
            </Link>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-soft space-y-4">
        <h2 className="text-lg font-semibold text-brand-teal">Kursfremgang</h2>
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-brand-ink/60">
            <span>{completedLessonIds.size} av {totalLessons} leksjoner fullført</span>
            <span>{totalProgress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-brand-teal/10">
            <div
              className="h-full bg-brand-coral transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {modules.map((module) => {
            const completed = module.lessons.filter((l) => completedLessonIds.has(l.id)).length;
            return (
              <div key={module.id} className="flex items-center justify-between text-sm">
                <span className="text-brand-ink/80">{module.title}</span>
                <span className={`font-medium ${completed === module.lessons.length ? 'text-brand-teal' : 'text-brand-ink/50'}`}>
                  {completed}/{module.lessons.length}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
