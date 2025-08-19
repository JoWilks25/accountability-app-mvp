export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
}

export interface PodSettings {
  weekStartDay: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
}

export interface Pod {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  members: User[];
  ownerId: string;
  settings: PodSettings;
}

export interface Goal {
  id: string;
  userId: string;
  podId: string;
  title: string;
  description: string;
  type: 'life' | 'work';
  quarter: string; // e.g., "Q1 2025"
  createdAt: string;
  completedAt: string | null;
  progress: number; // 0-100
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description: string;
  weekNumber: number; // 1-13 (for a quarter)
  createdAt: string;
  completedAt: string | null;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface CheckIn {
  id: string;
  userId: string;
  podId: string;
  weekNumber: number;
  content: string;
  challenges: string;
  wins: string;
  nextSteps: string;
  createdAt: string;
}