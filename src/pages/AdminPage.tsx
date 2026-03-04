import { useMemo, useState } from 'react';
import { modules as initialModules, demoProfiles } from '../data/courseData';
import type { Module } from '../types/course';

const AdminPage = () => {
  const [moduleState, setModuleState] = useState<Module[]>(initialModules);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const sortedModules = useMemo(
    () => [...moduleState].sort((a, b) => a.sortOrder - b.sortOrder),
    [moduleState]
  );

  const addModule = () => {
    if (!newModuleTitle.trim()) return;
    setModuleState((prev) => [
      ...prev,
      {
        id: `mod-${crypto.randomUUID()}`,
        title: newModuleTitle,
        description: 'Ny modulbeskrivelse',
        icon: 'BookOpen',
        sortOrder: prev.length + 1,
        lessons: []
      }
    ]);
    setNewModuleTitle('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl text-brand-teal">Adminpanel</h1>

      <section className="rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="text-2xl text-brand-teal">Moduler</h2>
        <div className="mt-3 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-brand-teal/20 px-3 py-2"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="Ny modultittel"
          />
          <button className="rounded-lg bg-brand-teal px-4 py-2 text-white" onClick={addModule} type="button">
            Legg til
          </button>
        </div>
        <ul className="mt-4 space-y-3">
          {sortedModules.map((module) => (
            <li key={module.id} className="rounded-xl border border-brand-teal/10 p-3">
              <p className="font-semibold">{module.sortOrder}. {module.title}</p>
              <p className="text-sm text-brand-ink/70">Leksjoner: {module.lessons.length} · Video-URL redigeres per leksjon.</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-soft">
        <h2 className="text-2xl text-brand-teal">Brukere og betalingsstatus</h2>
        <ul className="mt-3 space-y-2">
          {demoProfiles.map((profile) => (
            <li key={profile.id} className="flex justify-between rounded-lg bg-brand-cream p-3">
              <span>{profile.fullName} ({profile.email})</span>
              <span>{profile.hasPaidAccess ? 'Har betalt' : 'Ikke betalt'}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
