import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  BookOpen,
  LibraryBig,
  PenSquare,
  Compass,
  CheckCircle2,
  Clock,
  ChevronRight,
  Award,
  ExternalLink,
  FileText,
  Target,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { modules } from '../data/courseData';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';

const ONBOARDING_KEY = 'sa-onboarding-seen';

const articles = [
  { title: 'Hvordan skrive bacheloroppgave', url: 'https://skrivakademisk.no/hvordanskrivebacheloroppgave/' },
  { title: 'Alt om bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/' },
  { title: 'Alt om masteroppgaven', url: 'https://skrivakademisk.no/masteroppgave/' },
  { title: 'Drøfting i bacheloroppgaven', url: 'https://skrivakademisk.no/bacheloroppgave/drofting/' },
  { title: 'Metodekapittel i masteroppgaven', url: 'https://skrivakademisk.no/masteroppgave/metodekapittel/' },
  { title: 'Metodekapittel i bacheloroppgaven', url: 'https://skrivakademisk.no/metodekapittel-bacheloroppgave/' },
  { title: 'Metodekapittelet forklart', url: 'https://skrivakademisk.no/metodekapittel/' },
  { title: 'Tekstskriving: tips og teknikker', url: 'https://skrivakademisk.no/tekstskriving/' },
  { title: 'Drøftingsoppgave mal', url: 'https://skrivakademisk.no/droftingsoppgave-mal/' },
];

const moduleIcons = { BookOpen, LibraryBig, PenSquare, Compass };

const DashboardPage = () => {
  const { profile } = useAuth();
  const { completedLessonIds, loading } = useProgress();

  const [onboardingDismissed, setOnboardingDismissed] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) === 'true'
  );

  const dismissOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setOnboardingDismissed(true);
  };

  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalMinutes = modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.durationMinutes, 0),
    0
  );
  const totalCompleted = completedLessonIds.size;
  const totalProgress = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  const completedModules = modules.filter(
    (m) => m.lessons.every((l) => completedLessonIds.has(l.id))
  ).length;

  const firstName = profile?.fullName?.split(' ')[0];
  const displayName = firstName || 'du';
  const allDone = totalCompleted === totalLessons && totalLessons > 0;

  // Time-based greeting
  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'God morgen' : hour < 18 ? 'Hei' : hour < 23 ? 'God kveld' : 'Hei, nattuglen';

  const greetingLine =
    totalCompleted === 0
      ? `${timeGreeting}, ${displayName}! 👋 La oss komme i gang — ett steg om gangen.`
      : allDone
      ? `${timeGreeting}, ${displayName}! 🎉 Du har fullført hele kurset!`
      : `${timeGreeting}, ${displayName}! 👋 Klar for å jobbe videre?`;

  // Progress message
  const getProgressMessage = () => {
    if (allDone) return 'Du klarte det! Hele kurset fullført 🎉';
    if (totalCompleted === 0) return 'Du har kommet i gang — det er det viktigste!';
    const currentModule = modules.find((m) =>
      m.lessons.some((l) => !completedLessonIds.has(l.id))
    );
    const remaining = totalLessons - totalCompleted;
    if (totalProgress < 25)
      return `Fint! Du er i gang${currentModule ? ` med ${currentModule.title}` : ''}.`;
    if (totalProgress < 50)
      return `Du har lært ${totalCompleted} av ${totalLessons} leksjoner. Fortsett!`;
    if (totalProgress < 75) return `Imponerende! Mer enn halvparten er ferdig.`;
    return `Nesten i mål! Bare ${remaining} leksjon${remaining === 1 ? '' : 'er'} igjen.`;
  };

  // Next lesson to do across all modules
  const nextLesson = (() => {
    for (const module of modules) {
      const lesson = module.lessons.find((l) => !completedLessonIds.has(l.id));
      if (lesson) return { lesson, module };
    }
    return null;
  })();

  // Milestones
  const milestones = [
    {
      emoji: '🌱',
      label: 'Du har startet!',
      achieved: totalCompleted >= 1,
      condition: '1 leksjon',
    },
    {
      emoji: '📝',
      label: 'Du begynner å få dreis',
      achieved: totalCompleted >= 5,
      condition: '5 leksjoner',
    },
    {
      emoji: '💪',
      label: 'Strukturen sitter!',
      achieved: modules[0]?.lessons.every((l) => completedLessonIds.has(l.id)) ?? false,
      condition: 'Modul 1 ferdig',
    },
    {
      emoji: '🎯',
      label: 'Halvveis — imponerende',
      achieved: totalCompleted >= 12,
      condition: '12 leksjoner',
    },
    {
      emoji: '🧠',
      label: 'Du kan dette',
      achieved: completedModules >= 3,
      condition: '3 moduler ferdig',
    },
    {
      emoji: '🎓',
      label: 'Akademisk ninja — gratulerer!',
      achieved: allDone,
      condition: 'Alt ferdig',
    },
  ];

  return (
    <div className="space-y-6">

      {/* HERO — velkomst */}
      <section className="relative rounded-2xl bg-brand-teal overflow-hidden px-8 py-10">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white opacity-5 translate-x-16 -translate-y-16 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-brand-coral opacity-10 -translate-x-12 translate-y-12 pointer-events-none" />

        <div className="relative">
          <h1 className="text-2xl md:text-3xl text-white leading-snug">{greetingLine}</h1>

          {/* Statistikk-rad */}
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2">
              <BookOpen size={14} className="text-white/70" />
              <span className="text-sm font-semibold text-white">{totalLessons} leksjoner</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2">
              <Clock size={14} className="text-white/70" />
              <span className="text-sm font-semibold text-white">
                {Math.round(totalMinutes / 60)}+ timer
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2">
              <FileText size={14} className="text-white/70" />
              <span className="text-sm font-semibold text-white">{modules.length} moduler</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2">
              <CheckCircle2 size={14} className="text-white/70" />
              <span className="text-sm font-semibold text-white">{totalCompleted} fullført</span>
            </div>
            {allDone && (
              <div className="flex items-center gap-2 rounded-lg bg-brand-coral px-4 py-2">
                <Award size={14} className="text-white" />
                <span className="text-sm font-semibold text-white">Kurs fullført!</span>
              </div>
            )}
          </div>

          {/* Fremgangsbar */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/70">{getProgressMessage()}</span>
              <span className="font-semibold text-white">{totalProgress}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-brand-coral transition-all duration-700"
                style={{ width: totalProgress === 0 ? '2%' : `${totalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ONBOARDING — kun første gang, 0% progress */}
      {!loading && totalCompleted === 0 && !onboardingDismissed && (
        <section className="relative rounded-2xl border border-[rgb(var(--c-primary))]/30 bg-[rgb(var(--c-primary))]/8 px-6 py-6 overflow-hidden">
          <button
            onClick={dismissOnboarding}
            aria-label="Lukk"
            className="absolute right-4 top-4 rounded-full p-1 text-[rgb(var(--c-ink))]/40 hover:bg-[rgb(var(--c-border))] hover:text-[rgb(var(--c-ink))] transition"
          >
            <X size={16} />
          </button>
          <div className="flex gap-4 items-start">
            <div className="text-3xl">🎉</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-[rgb(var(--c-ink))] mb-1">Velkommen til kurset!</h2>
              <p className="text-sm text-brand-gray leading-relaxed mb-1">
                Du har nå tilgang til {totalLessons} leksjoner som tar deg gjennom hele oppgaveprosessen.
              </p>
              <p className="text-sm text-brand-gray leading-relaxed mb-4">
                Vi anbefaler å starte med Modul 1 — den legger grunnlaget for alt som kommer.
                Du kan se leksjonene i ditt eget tempo, og du kan alltid gå tilbake.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {nextLesson && (
                  <Link
                    to={`/leksjon/${nextLesson.lesson.id}`}
                    onClick={dismissOnboarding}
                    className="inline-flex items-center gap-2 rounded-xl bg-[rgb(var(--c-primary))] px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90"
                  >
                    Start med Leksjon 1
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>
              <p className="mt-4 text-xs text-brand-gray/70">
                💡 Tips: Kurset fungerer best på PC — lettere å følge med og ta notater.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ANBEFALT NESTE */}
      {nextLesson && !loading && (
        <section className="relative overflow-hidden rounded-2xl border border-brand-coral/30 bg-brand-coral/10 px-6 py-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-coral/10 blur-2xl" />
          <div className="relative flex items-center gap-5 flex-wrap">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-coral/20 text-brand-coral">
              <Target size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-coral mb-0.5">
                Anbefalt neste
              </p>
              <p className="font-semibold text-brand-ink leading-snug truncate">
                {nextLesson.lesson.title}
              </p>
              <p className="text-xs text-brand-gray mt-0.5">
                {nextLesson.module.title}
                {nextLesson.lesson.durationMinutes
                  ? ` · ${nextLesson.lesson.durationMinutes} min`
                  : ''}
              </p>
            </div>
            <Link
              to={`/leksjon/${nextLesson.lesson.id}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-coral px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition whitespace-nowrap"
            >
              Fortsett der du slapp <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* MODULKORT */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-brand-teal border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {modules.map((module, moduleIdx) => {
            const Icon = moduleIcons[module.icon as keyof typeof moduleIcons] ?? BookOpen;
            const completed = module.lessons.filter((l) => completedLessonIds.has(l.id)).length;
            const progress = Math.round((completed / module.lessons.length) * 100);
            const isFullyDone = completed === module.lessons.length;
            const moduleNum = moduleIdx + 1;
            const nextModuleLesson = module.lessons.find((l) => !completedLessonIds.has(l.id));
            const noneCompleted = completed === 0;

            const ctaText = isFullyDone
              ? '✅ Fullført — repeter?'
              : noneCompleted
              ? 'Start med første leksjon →'
              : `Fortsett: ${nextModuleLesson?.title ?? ''}`;

            const ctaLink = isFullyDone
              ? `/modul/${module.id}`
              : nextModuleLesson
              ? `/leksjon/${nextModuleLesson.id}`
              : `/modul/${module.id}`;

            return (
              <Link
                key={module.id}
                to={ctaLink}
                className="group block rounded-2xl bg-brand-warm border border-brand-border p-6 shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      isFullyDone ? 'bg-brand-green/20 text-brand-green' : 'bg-brand-teal/10 text-brand-teal'
                    }`}
                  >
                    {isFullyDone ? <CheckCircle2 size={22} /> : <Icon size={22} />}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-brand-gray">
                      {completed}/{module.lessons.length}
                    </p>
                    <div className="mt-1 w-20 h-1.5 overflow-hidden rounded-full bg-brand-teal/10">
                      <div
                        className="h-full rounded-full bg-brand-teal transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-brand-coral mb-1">
                  Modul {moduleNum}
                </p>
                <h2 className="text-xl text-brand-teal leading-snug">{module.title}</h2>
                <p className="mt-1 text-sm text-brand-gray leading-relaxed line-clamp-2">
                  {module.description}
                </p>

                <div className="mt-4 pt-4 border-t border-brand-border">
                  <span
                    className={`text-sm font-semibold inline-flex items-center gap-1 transition-all group-hover:translate-x-0.5 ${
                      isFullyDone
                        ? 'text-brand-green'
                        : 'text-brand-teal group-hover:text-brand-coral'
                    }`}
                  >
                    <span className="truncate max-w-[220px]">{ctaText}</span>
                    {!isFullyDone && <ChevronRight size={15} className="shrink-0" />}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* MILEPÆLER */}
      <section className="rounded-2xl border border-brand-border bg-brand-warm p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-coral">Fremgang</p>
            <h2 className="text-lg text-brand-teal leading-tight">Dine milepæler</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {milestones.map((m) => (
            <div
              key={m.label}
              className={`rounded-xl border px-4 py-3 transition-all ${
                m.achieved
                  ? 'border-brand-teal/20 bg-brand-teal/8'
                  : 'border-brand-border bg-brand-cream opacity-50'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <p
                className={`mt-1 text-xs font-semibold leading-snug ${
                  m.achieved ? 'text-brand-ink' : 'text-brand-gray'
                }`}
              >
                {m.label}
              </p>
              <p className="mt-0.5 text-[11px] text-brand-gray/70">{m.condition}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ARTIKLER */}
      <section className="rounded-2xl bg-brand-warm border border-brand-border shadow-soft overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-brand-border">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal/10 text-brand-teal">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-coral">
              Gratis ressurser
            </p>
            <h2 className="text-xl text-brand-teal leading-tight">
              Nyttige artikler fra skrivakademisk.no
            </h2>
          </div>
        </div>
        <ul>
          {articles.map((article) => (
            <li key={article.url} className="border-b border-brand-border last:border-0">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-6 py-3.5 transition hover:bg-brand-teal/5"
              >
                <CheckCircle2 size={14} className="shrink-0 text-brand-teal/40 group-hover:text-brand-teal transition" />
                <span className="flex-1 text-sm font-medium text-brand-ink group-hover:text-brand-teal transition">
                  {article.title}
                </span>
                <ExternalLink
                  size={14}
                  className="shrink-0 text-brand-gray group-hover:text-brand-teal transition"
                />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default DashboardPage;
