export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  videoUrl: string;
  resourceUrl?: string;
  learningGoals: string[];
  sortOrder: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  lessons: Lesson[];
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  hasPaidAccess: boolean;
  hasNorskAccess: boolean;
  hasUngdomsskoleAccess: boolean;
  isAdmin: boolean;
}
