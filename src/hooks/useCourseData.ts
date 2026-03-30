import { modules as staticModules } from '@/data/courseData';

export interface ModuleSummary {
  id: string;
  title: string;
  description: string;
}

export const useModules = () => {
  const data: ModuleSummary[] = staticModules.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
  }));

  return { data, isLoading: false };
};
