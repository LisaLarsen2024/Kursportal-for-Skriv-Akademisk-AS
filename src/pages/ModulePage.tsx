import { Link, useParams } from 'react-router-dom';
import { modules } from '../data/courseData';

interface ModulePageProps {
  completedLessonIds: Set<string>;
}

const ModulePage = ({ completedLessonIds }: ModulePageProps) => {
  const { moduleId } = useParams();
  const module = modules.find((entry) => entry.id === moduleId);

  if (!module) {
    return <p>Fant ikke modul.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl text-brand-teal">{module.title}</h1>
      <p className="mt-2 text-brand-ink/80">{module.description}</p>
      <div className="mt-6 space-y-3">
        {module.lessons.map((lesson, idx) => (
          <article key={lesson.id} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-soft">
            <div>
              <p className="text-xs uppercase text-brand-coral">Leksjon {idx + 1}</p>
              <h2 className="text-xl text-brand-teal">{lesson.title}</h2>
              <p className="text-brand-ink/70">{lesson.description}</p>
              <p className="text-sm text-brand-ink/60">Varighet: {lesson.durationMinutes} min</p>
            </div>
            <div className="text-right">
              <p className="text-sm">{completedLessonIds.has(lesson.id) ? '✅ Fullført' : '⏳ Ikke fullført'}</p>
              <Link to={`/leksjon/${lesson.id}`} className="mt-2 inline-block rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white">
                Åpne
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default ModulePage;
