import { Link } from 'react-router-dom';
import {
  FileText, Scale, Search, GraduationCap, Globe,
  CheckCircle2, Clock, ChevronRight, PlayCircle, type LucideIcon,
} from 'lucide-react';
import { ungdomsskoleModules, ungdomsskoleCourseInfo } from '../data/ungdomsskoleData';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';

const moduleIcons: Record<string, LucideIcon> = {
  FileText, Scale, Search, GraduationCap, Globe,
};

const UngdomskoleDashboardPage = () => {
  const { profile } = useAuth();
  const { completedLessonIds } = useProgress();

  const totalLessons = ungdomsskoleModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalMinutes = ungdomsskoleModules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.durationMinutes, 0),
    0,
  );
  const totalCompleted = ungdomsskoleModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => completedLessonIds.has(l.id)).length,
    0,
  );
  const totalProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const firstName = profile?.fullName?.split(' ')[0];
  const allDone = totalCompleted === totalLessons;

  const getGreeting = () => {
    if (allDone) return `Imponerende, ${firstName || 'elev'}! Du har fullført kurset.`;
    if (totalCompleted === 0) return `Klar til å skrive smartere, ${firstName || 'elev'}?`;
    return `Bra jobbet, ${firstName || 'elev'}!`;
  };

  const getSubtitle = () => {
    if (allDone) return 'Du har fullført alle modulene. Du er klar til tentamen og eksamen!';
    if (totalCompleted === 0)
      return 'Start med Modul 1 — der lærer du det læreren egentlig ser etter.';
    return `Du har fullført ${totalCompleted} av ${totalLessons} leksjoner. Fortsett der du slapp!`;
  };

  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMin = totalMinutes % 60;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative rounded-2xl bg-brand-teal overflow-hidden px-8 py-10">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-brand-teal-light opacity-10 translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-teal-light opacity-10 -translate-x-12 translate-y-12 pointer-events-none" />
        <div className="relative">
          <span className="inline-block rounded-full px-4 py-1.5 text-xs font-semibold text-white bg-white/15 mb-4">
            Skriv smartere · 8.–10. trinn
          </span>
          <h1 className="text-3xl font-heading text-white">{getGreeting()}</h1>
          <p className="mt-2 text-white/85 max-w-xl leading-relaxed">{getSubtitle()}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2">
              <Clock size={14} className="text-white/70" />
              <span className="text-sm text-white">
                {totalHours > 0 ? `${totalHours} t ` : ''}{remainingMin} min totalt
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2">
              <PlayCircle size={14} className="text-white/70" />
              <span className="text-sm text-white">
                {ungdomsskoleCourseInfo.moduleCount} moduler · {totalLessons} leksjoner
              </span>
            </div>
            {totalCompleted > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2">
                <CheckCircle2 size={14} className="text-white/70" />
                <span className="text-sm text-white">{totalProgress}% fullført</span>
              </div>
            )}
          </div>

          {totalCompleted > 0 && (
            <div className="mt-5 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs text-white/70">
                <span>Samlet fremgang</span>
                <span className="font-semibold text-white">{totalProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-brand-coral transition-all duration-700"
                  style={{ width: `${totalProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modules */}
      <section>
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-gray">
          Moduler
        </h2>
        <div className="space-y-4">
          {ungdomsskoleModules.map((mod, idx) => {
            const Icon = moduleIcons[mod.icon] ?? FileText;
            const completed = mod.lessons.filter((l) => completedLessonIds.has(l.id)).length;
            const progress =
              mod.lessons.length > 0 ? Math.round((completed / mod.lessons.length) * 100) : 0;
            const isDone = completed === mod.lessons.length;
            const nextLesson = mod.lessons.find((l) => !completedLessonIds.has(l.id));
            const totalMin = mod.lessons.reduce((s, l) => s + l.durationMinutes, 0);
            const isBonus = mod.id === 'ung-mod-5';

            return (
              <Link
                key={mod.id}
                to={`/ungdomsskole/modul/${mod.id}`}
                className="group flex gap-5 rounded-2xl bg-[rgb(var(--c-surface))] border border-[rgb(var(--c-border))] p-5 shadow-soft transition-all hover:shadow-hover hover:-translate-y-0.5"
              >
                <div
                  className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                    isDone
                      ? 'bg-[#5B9E6F]/15 text-[#5B9E6F]'
                      : 'bg-brand-teal/10 text-brand-teal'
                  }`}
                >
                  {isDone ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-coral">
                      {isBonus ? 'Bonus' : `Modul ${idx + 1}`}
                    </p>
                    {isDone && (
                      <span className="rounded-full bg-[#5B9E6F]/15 text-[#5B9E6F] px-2 py-0.5 text-xs font-bold">
                        Fullført
                      </span>
                    )}
                    {isBonus && (
                      <span className="rounded-full bg-brand-teal/10 text-brand-teal px-2 py-0.5 text-xs font-semibold">
                        Valgfri
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-heading text-brand-teal leading-snug">{mod.title}</h3>
                  <p className="mt-1 text-sm text-brand-gray leading-relaxed">{mod.description}</p>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-brand-gray">
                    <span className="flex items-center gap-1 rounded-lg bg-brand-teal/10 px-2.5 py-1">
                      <Clock size={11} /> {totalMin} min
                    </span>
                    <span className="flex items-center gap-1 rounded-lg bg-brand-teal/10 px-2.5 py-1">
                      <PlayCircle size={11} /> {mod.lessons.length} leksjon
                      {mod.lessons.length !== 1 ? 'er' : ''}
                    </span>
                  </div>

                  {completed > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs text-brand-gray">
                        <span>
                          {completed}/{mod.lessons.length} fullført
                        </span>
                        <span className="font-semibold text-brand-teal">{progress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-brand-teal/10">
                        <div
                          className="h-full rounded-full bg-brand-teal transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {nextLesson && !isDone && (
                    <p className="mt-2.5 text-xs text-brand-coral font-semibold">
                      {completed > 0 ? 'Fortsett: ' : 'Start: '}
                      {nextLesson.title}
                    </p>
                  )}
                </div>

                <ChevronRight
                  size={18}
                  className="shrink-0 self-center text-brand-gray transition group-hover:text-brand-teal group-hover:translate-x-0.5"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Smart tip */}
      <div className="rounded-2xl border border-brand-teal/20 bg-brand-teal/5 px-6 py-5">
        <p className="text-sm font-semibold text-brand-teal mb-1">
          💡 Tips: Start med Modul 1, Leksjon 1
        </p>
        <p className="text-sm text-brand-gray leading-relaxed">
          «Hva læreren egentlig ser etter» — den leksjonen alene kan løfte teksten din med én
          hel karakter.
        </p>
      </div>

      {/* App promo */}
      <a
        href="https://app.skrivakademisk.no"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between gap-4 rounded-2xl bg-[rgb(var(--c-surface))] border border-[rgb(var(--c-border))] px-6 py-4 hover:border-brand-coral/40 transition-colors group"
      >
        <div>
          <p className="text-sm font-semibold text-brand-teal group-hover:text-brand-coral transition-colors">
            ✍️ Øv på skriving mellom leksjonene
          </p>
          <p className="text-xs text-brand-gray mt-0.5">
            Skriv Akademisk-appen gir deg tilbakemelding i sanntid — prøv den gratis i dag
          </p>
        </div>
        <span className="shrink-0 text-sm font-bold text-brand-coral whitespace-nowrap">
          Prøv appen →
        </span>
      </a>
    </div>
  );
};

export default UngdomskoleDashboardPage;
