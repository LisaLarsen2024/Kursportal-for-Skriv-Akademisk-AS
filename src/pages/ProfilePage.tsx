import { modules } from '../data/courseData';

interface ProfilePageProps {
  email: string;
  hasPaidAccess: boolean;
  completedLessonIds: Set<string>;
}

const ProfilePage = ({ email, hasPaidAccess, completedLessonIds }: ProfilePageProps) => {
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-2xl bg-white p-6 shadow-soft">
      <h1 className="text-3xl text-brand-teal">Min profil</h1>
      <p><strong>E-post:</strong> {email}</p>
      <p><strong>Betalingsstatus:</strong> {hasPaidAccess ? 'Aktiv tilgang' : 'Ingen aktiv tilgang'}</p>
      <p><strong>Kursfremgang:</strong> {completedLessonIds.size}/{totalLessons} leksjoner fullført</p>
    </div>
  );
};

export default ProfilePage;
