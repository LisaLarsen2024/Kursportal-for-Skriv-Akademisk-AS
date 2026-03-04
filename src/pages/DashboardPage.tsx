import { Link } from 'react-router-dom';
import { modules } from '../data/courseData';

interface DashboardPageProps {
  completedLessonIds: Set<string>;
}

const DashboardPage = ({ completedLessonIds }: DashboardPageProps) => {
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const totalCompleted = Array.from(completedLessonIds).length;
  const totalProgress = Math.round((totalCompleted / totalLessons) * 100);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-6 shadow-soft">
        <h1 className="text-3xl text-brand-teal">Kursdashboard</h1>
        <p className="mt-2 text-brand-ink/70">Total fremgang: {totalProgress}%</p>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-brand-teal/10">
          <div className="h-full bg-brand-coral" style={{ width: `${totalProgress}%` }} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {modules.map((module) => {
          const completed = module.lessons.filter((lesson) => completedLessonIds.has(lesson.id)).length;
          const progress = Math.round((completed / module.lessons.length) * 100);
          return (
            <article key={module.id} className="rounded-2xl bg-white p-5 shadow-soft">
              <h2 className="text-2xl text-brand-teal">{module.title}</h2>
              <p className="mt-2 text-brand-ink/70">{module.description}</p>
              <p className="mt-4 text-sm text-brand-ink/70">{completed}/{module.lessons.length} fullført</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-teal/10">
                <div className="h-full bg-brand-teal" style={{ width: `${progress}%` }} />
              </div>
              <Link to={`/modul/${module.id}`} className="mt-4 inline-block rounded-full bg-brand-teal px-4 py-2 text-sm font-semibold text-white">
                Åpne modul
              </Link>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default DashboardPage;
