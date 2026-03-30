import { CheckCircle2, Clock, PlayCircle, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { modules } from '../data/courseData';
import { norskModules } from '../data/norskData';
import { ungdomsskoleModules } from '../data/ungdomsskoleData';
import { useProgress } from '../contexts/ProgressContext';

const ModulePage = () => {
  const { moduleId } = useParams();
  const { completedLessonIds } = useProgress();

  const isNorsk = moduleId?.startsWith('norsk-') ?? false;
  const isUng = moduleId?.startsWith('ung-') ?? false;
  const courseModules = isNorsk ? norskModules : isUng ? ungdomsskoleModules : modules;
  const basePath = isNorsk ? '/norsk' : isUng ? '/ungdomsskole' : '';
  const dashboardPath = isNorsk ? '/norsk/dashboard' : isUng ? '/ungdomsskole/dashboard' : '/dashboard';

  const moduleIndex = courseModules.findIndex((m) => m.id === moduleId);
  const module = courseModules[moduleIndex];

  if (!module) {
    return (
      <div className="rounded-2xl bg-white border border-brand-border p-8 shadow-soft text-center">
        <p className="font-heading italic text-brand-coral">
          Fant ikke modul.
        </p>
        <Link to={dashboardPath} className="mt-4 inline-block text-brand-teal underline">
          Tilbake til dashboard
        </Link>
      </div>
    );
  }

  const completed = module.lessons.filter((l) => completedLessonIds.has(l.id)).length;
  const progress = Math.round((completed / module.lessons.length) * 100);
  const totalMinutes = module.lessons.reduce((sum, l) => sum + l.durationMinutes, 0);
  const isFullyDone = completed === module.lessons.length;
  const nextLesson = module.lessons.find((l) => !completedLessonIds.has(l.id));
  const moduleNum = String(moduleIndex + 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-brand-gray">
        <Link to={dashboardPath} className="hover:text-brand-teal transition-colors">Dashboard</Link>
        <ChevronRight size={14} />
        <span className="text-brand-teal font-semibold">{module.title}</span>
      </div>

      <div className="rounded-2xl bg-white border border-brand-border p-6 shadow-soft">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-coral">
          Modul {moduleNum}
        </p>
        <h1 className="mt-1 text-3xl font-heading text-brand-teal">{module.title}</h1>
        <p className="mt-2 text-brand-gray max-w-2xl leading-relaxed">{module.description}</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5 rounded-xl bg-brand-teal-pale px-3 py-1.5 text-sm text-brand-teal">
            <PlayCircle size={14} className="text-brand-coral" />
            {module.lessons.length} leksjoner
          </span>
          <span className="flex items-center gap-1.5 rounded-xl bg-brand-teal-pale px-3 py-1.5 text-sm text-brand-teal">
            <Clock size={14} className="text-brand-coral" />
            {Math.round(totalMinutes / 60)} t {totalMinutes % 60} min
          </span>
          <span className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm ${
            isFullyDone ? 'bg-brand-green/15 text-brand-green' : 'bg-brand-teal-pale text-brand-teal'
          }`}>
            <CheckCircle2 size={14} className={isFullyDone ? 'text-brand-green' : 'text-brand-gray'} />
            {completed}/{module.lessons.length} fullført
          </span>
        </div>

        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-xs text-brand-gray">
            <span>Fremgang i denne modulen</span>
            <span className="font-semibold text-brand-teal">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-brand-teal-pale">
            <div
              className="h-full rounded-full bg-brand-teal transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {nextLesson && (
          <div className="mt-5 pt-5 border-t border-brand-border">
            <p className="text-xs text-brand-gray uppercase tracking-wide font-semibold mb-2">Neste leksjon</p>
            <Link
              to={`${basePath}/leksjon/${nextLesson.id}`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-coral px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#c96a52] transition shadow-sm"
            >
              {completed > 0 ? 'Fortsett' : 'Start'}: {nextLesson.title}
              <ChevronRight size={15} />
            </Link>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-gray">
          Alle leksjoner
        </h2>
        <div className="space-y-3">
          {module.lessons.map((lesson, idx) => {
            const isDone = completedLessonIds.has(lesson.id);

            return (
              <Link
                to={`${basePath}/leksjon/${lesson.id}`}
                key={lesson.id}
                className={`group flex gap-4 rounded-2xl bg-white border p-5 shadow-soft transition-all hover:shadow-hover hover:-translate-y-0.5 ${
                  isDone ? 'border-l-4 border-brand-teal border-r border-t border-b' : 'border-brand-border hover:border-brand-coral/40'
                }`}
              >
                <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isDone
                    ? 'bg-brand-green text-white'
                    : 'bg-brand-coral text-white group-hover:scale-105 transition-transform'
                }`}>
                  {isDone ? <CheckCircle2 size={17} /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-coral">
                    Leksjon {moduleNum}.{idx + 1}
                  </p>
                  <h3 className="text-lg font-heading text-brand-teal leading-snug">{lesson.title}</h3>
                  <p className="mt-0.5 text-sm text-brand-gray">{lesson.description}</p>

                  {lesson.learningGoals.length > 0 && (
                    <ul className="mt-2.5 space-y-1">
                      {lesson.learningGoals.slice(0, 2).map((goal, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-brand-gray">
                          <span className="text-brand-teal-light mt-0.5 font-bold">✓</span>
                          {goal}
                        </li>
                      ))}
                      {lesson.learningGoals.length > 2 && (
                        <li className="text-xs text-brand-gray pl-4">
                          + {lesson.learningGoals.length - 2} mål til
                        </li>
                      )}
                    </ul>
                  )}

                  <p className="mt-2 flex items-center gap-1 text-xs text-brand-gray">
                    <span className="flex items-center gap-1 rounded-lg bg-brand-teal-pale px-2 py-0.5">
                      <Clock size={11} />
                      {lesson.durationMinutes} min
                    </span>
                    {isDone && (
                      <span className="ml-2 font-semibold text-brand-green">✓ Fullført</span>
                    )}
                  </p>
                </div>

                <div className="ml-2 flex shrink-0 items-center">
                  <ChevronRight
                    size={18}
                    className="text-brand-gray transition group-hover:text-brand-teal group-hover:translate-x-0.5"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModulePage;
