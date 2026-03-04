import { Link, useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import { modules } from '../data/courseData';

interface LessonPageProps {
  completedLessonIds: Set<string>;
  onToggleComplete: (lessonId: string) => void;
}

const flattenedLessons = modules.flatMap((module) => module.lessons);

const LessonPage = ({ completedLessonIds, onToggleComplete }: LessonPageProps) => {
  const { lessonId } = useParams();
  const currentIndex = flattenedLessons.findIndex((entry) => entry.id === lessonId);
  const lesson = flattenedLessons[currentIndex];

  if (!lesson) {
    return <p>Fant ikke leksjon.</p>;
  }

  const previous = flattenedLessons[currentIndex - 1];
  const next = flattenedLessons[currentIndex + 1];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-brand-teal">{lesson.title}</h1>
      <p className="text-brand-ink/80">{lesson.description}</p>
      <VideoPlayer videoUrl={lesson.videoUrl} title={lesson.title} />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onToggleComplete(lesson.id)}
          className="rounded-xl bg-brand-coral px-4 py-2 font-semibold text-white"
        >
          {completedLessonIds.has(lesson.id) ? 'Marker som ikke fullført' : 'Merk som fullført'}
        </button>
        {lesson.resourceUrl && (
          <a className="rounded-xl border border-brand-teal/30 px-4 py-2" href={lesson.resourceUrl} target="_blank" rel="noreferrer">
            Last ned ressurs
          </a>
        )}
      </div>
      <div className="flex justify-between">
        {previous ? <Link to={`/leksjon/${previous.id}`}>← Forrige leksjon</Link> : <span />}
        {next ? <Link to={`/leksjon/${next.id}`}>Neste leksjon →</Link> : <span>Du er ferdig med kurset 🎉</span>}
      </div>
    </div>
  );
};

export default LessonPage;
