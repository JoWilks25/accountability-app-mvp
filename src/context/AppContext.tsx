import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Pod, Goal, Milestone, CheckIn, PodSettings } from '../types';
import { 
  mockUsers, 
  mockPods, 
  mockGoals, 
  mockMilestones, 
  mockCheckIns,
  currentUser as mockCurrentUser,
  currentPod as mockCurrentPod
} from '../data/mockData';
import { supabase } from '../lib/supabase';

interface AppContextType {
  currentUser: User | null;
  currentPod: Pod | null;
  users: User[];
  pods: Pod[];
  goals: Goal[];
  milestones: Milestone[];
  checkIns: CheckIn[];
  setCurrentUser: (user: User | null) => void;
  setCurrentPod: (pod: Pod | null) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'completedAt' | 'progress'>) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  addMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt' | 'completedAt'>) => void;
  updateMilestoneStatus: (milestoneId: string, status: Milestone['status'], completedAt?: string) => void;
  addCheckIn: (checkIn: Omit<CheckIn, 'id' | 'createdAt'>) => void;
  updatePodSettings: (podId: string, settings: PodSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPod, setCurrentPod] = useState<Pod | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [pods, setPods] = useState<Pod[]>(mockPods);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [milestones, setMilestones] = useState<Milestone[]>(mockMilestones);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(mockCheckIns);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // In a real app, you would fetch the user data from your database
        setCurrentUser(mockCurrentUser);
        setCurrentPod(mockCurrentPod);
      } else {
        setCurrentUser(null);
        setCurrentPod(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'completedAt' | 'progress'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedAt: null,
      progress: 0
    };
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  const updateGoalProgress = (goalId: string, progress: number) => {
    setGoals((prevGoals) => 
      prevGoals.map((goal) => 
        goal.id === goalId ? { ...goal, progress } : goal
      )
    );
  };

  const addMilestone = (milestone: Omit<Milestone, 'id' | 'createdAt' | 'completedAt'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedAt: null,
      status: 'not-started'
    };
    setMilestones((prevMilestones) => [...prevMilestones, newMilestone]);
  };

  const updateMilestoneStatus = (milestoneId: string, status: Milestone['status'], completedAt?: string) => {
    setMilestones((prevMilestones) => 
      prevMilestones.map((milestone) => 
        milestone.id === milestoneId 
          ? { 
              ...milestone, 
              status, 
              completedAt: status === 'completed' ? completedAt || new Date().toISOString() : null 
            } 
          : milestone
      )
    );
  };

  const addCheckIn = (checkIn: Omit<CheckIn, 'id' | 'createdAt'>) => {
    const newCheckIn: CheckIn = {
      ...checkIn,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setCheckIns((prevCheckIns) => [...prevCheckIns, newCheckIn]);
  };

  const updatePodSettings = (podId: string, settings: PodSettings) => {
    setPods((prevPods) =>
      prevPods.map((pod) =>
        pod.id === podId ? { ...pod, settings } : pod
      )
    );
    
    if (currentPod?.id === podId) {
      setCurrentPod((prev) => prev ? { ...prev, settings } : null);
    }
  };

  const value = {
    currentUser,
    currentPod,
    users,
    pods,
    goals,
    milestones,
    checkIns,
    setCurrentUser,
    setCurrentPod,
    addGoal,
    updateGoalProgress,
    addMilestone,
    updateMilestoneStatus,
    addCheckIn,
    updatePodSettings
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};