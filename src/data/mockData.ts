import { User, Pod, Goal, Milestone, CheckIn } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Samantha Lee',
    email: 'samantha@example.com',
    avatarUrl: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2025-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2025-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Taylor Williams',
    email: 'taylor@example.com',
    avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2025-01-04T00:00:00Z',
  },
];

export const mockPods: Pod[] = [
  {
    id: '1',
    name: 'Growth Hackers',
    description: 'A group focused on personal and professional growth',
    createdAt: '2025-01-05T00:00:00Z',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    ownerId: '1',
    settings: {
      weekStartDay: 1, // Monday
    },
  },
  {
    id: '2',
    name: 'Fitness Enthusiasts',
    description: 'Supporting each other in health and fitness goals',
    createdAt: '2025-01-06T00:00:00Z',
    members: [mockUsers[1], mockUsers[3]],
    ownerId: '2',
    settings: {
      weekStartDay: 0, // Sunday
    },
  },
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    userId: '1',
    podId: '1',
    title: 'Run a half marathon',
    description: 'Train and complete a half marathon by the end of the quarter',
    type: 'life',
    quarter: 'Q2 2025',
    createdAt: '2025-04-01T00:00:00Z',
    completedAt: null,
    progress: 35,
  },
  {
    id: '2',
    userId: '1',
    podId: '1',
    title: 'Complete project management certification',
    description: 'Study and pass the PMP certification exam',
    type: 'work',
    quarter: 'Q2 2025',
    createdAt: '2025-04-01T00:00:00Z',
    completedAt: null,
    progress: 50,
  },
  {
    id: '3',
    userId: '2',
    podId: '1',
    title: 'Learn to play guitar',
    description: 'Practice guitar and learn 5 songs',
    type: 'life',
    quarter: 'Q2 2025',
    createdAt: '2025-04-02T00:00:00Z',
    completedAt: null,
    progress: 20,
  },
  {
    id: '4',
    userId: '2',
    podId: '1',
    title: 'Redesign company website',
    description: 'Lead the redesign of the company website',
    type: 'work',
    quarter: 'Q2 2025',
    createdAt: '2025-04-02T00:00:00Z',
    completedAt: null,
    progress: 75,
  },
];

export const mockMilestones: Milestone[] = [
  {
    id: '1',
    goalId: '1',
    title: 'Run 5km without stopping',
    description: 'Build endurance to run 5km continuously',
    weekNumber: 1,
    createdAt: '2025-04-01T00:00:00Z',
    completedAt: '2025-04-07T00:00:00Z',
    status: 'completed',
  },
  {
    id: '2',
    goalId: '1',
    title: 'Run 10km with proper form',
    description: 'Focus on maintaining good form for a 10km run',
    weekNumber: 3,
    createdAt: '2025-04-15T00:00:00Z',
    completedAt: null,
    status: 'in-progress',
  },
  {
    id: '3',
    goalId: '1',
    title: 'Complete first 15km run',
    description: 'Reach the 15km distance milestone',
    weekNumber: 6,
    createdAt: '2025-05-06T00:00:00Z',
    completedAt: null,
    status: 'not-started',
  },
  {
    id: '4',
    goalId: '2',
    title: 'Complete study guide chapters 1-3',
    description: 'Study and take notes on the first three chapters',
    weekNumber: 1,
    createdAt: '2025-04-01T00:00:00Z',
    completedAt: '2025-04-06T00:00:00Z',
    status: 'completed',
  },
  {
    id: '5',
    goalId: '2',
    title: 'Take practice exam 1',
    description: 'Complete first practice exam and review results',
    weekNumber: 2,
    createdAt: '2025-04-08T00:00:00Z',
    completedAt: '2025-04-12T00:00:00Z',
    status: 'completed',
  },
  {
    id: '6',
    goalId: '2',
    title: 'Complete study guide chapters 4-6',
    description: 'Study and take notes on chapters 4-6',
    weekNumber: 3,
    createdAt: '2025-04-15T00:00:00Z',
    completedAt: null,
    status: 'in-progress',
  },
];

export const mockCheckIns: CheckIn[] = [
  {
    id: '1',
    userId: '1',
    podId: '1',
    weekNumber: 1,
    content: "My first week went well overall. I'm excited about making progress on both goals.",
    challenges: "Finding time to run consistently with my busy schedule.",
    wins: "Completed my 5km run and finished the first 3 chapters of the study guide.",
    nextSteps: "Increase running distance and start taking practice exams.",
    createdAt: '2025-04-07T18:00:00Z',
  },
  {
    id: '2',
    userId: '2',
    podId: '1',
    weekNumber: 1,
    content: "Slower start than I hoped, but I'm committed to improving.",
    challenges: "Finding the right learning resources for guitar, fingers are sore!",
    wins: "Made significant progress on the website redesign, receiving positive feedback.",
    nextSteps: "Practice guitar for at least 30 minutes daily, finalize website design concepts.",
    createdAt: '2025-04-07T19:15:00Z',
  },
];

// Current user for the demo
export const currentUser = mockUsers[0];
export const currentPod = mockPods[0];