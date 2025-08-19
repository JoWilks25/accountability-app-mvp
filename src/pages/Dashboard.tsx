import React, { useState } from 'react';
import { PlusCircle, ChevronRight, Calendar } from 'lucide-react';
import { Goal, Milestone } from '../types';
import { useApp } from '../context/AppContext';
import GoalCard from '../components/dashboard/GoalCard';
import MilestoneList from '../components/dashboard/MilestoneList';
import MembersList from '../components/dashboard/MembersList';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Progress from '../components/ui/Progress';
import Badge from '../components/ui/Badge';

const Dashboard: React.FC = () => {
  const { 
    currentUser, 
    currentPod, 
    goals, 
    milestones,
    users,
    updateGoalProgress 
  } = useApp();
  
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentWeek());

  function getCurrentWeek(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
  }

  if (!currentUser || !currentPod) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to AccountaPod</h2>
        <p className="text-gray-600 mb-6">Please select or create a pod to get started.</p>
        <Button>Create a Pod</Button>
      </div>
    );
  }

  // Filter goals for the current user
  const userGoals = goals.filter(goal => goal.userId === currentUser.id);
  const userLifeGoals = userGoals.filter(goal => goal.type === 'life');
  const userWorkGoals = userGoals.filter(goal => goal.type === 'work');

  // Get milestones for the current week
  const weekMilestones = milestones.filter(
    milestone => 
      userGoals.some(goal => goal.id === milestone.goalId) && 
      milestone.weekNumber === selectedWeek
  );

  // Get milestones for the selected goal
  const goalMilestones = selectedGoal 
    ? milestones.filter(milestone => milestone.goalId === selectedGoal.id)
    : [];

  // Calculate overall progress for each goal type
  const calculateAverageProgress = (goalsList: Goal[]): number => {
    if (goalsList.length === 0) return 0;
    const totalProgress = goalsList.reduce((sum, goal) => sum + goal.progress, 0);
    return Math.round(totalProgress / goalsList.length);
  };

  const lifeGoalsProgress = calculateAverageProgress(userLifeGoals);
  const workGoalsProgress = calculateAverageProgress(userWorkGoals);

  // Calculate weekly milestone completion
  const weeklyProgress = {
    total: weekMilestones.length,
    completed: weekMilestones.filter(m => m.status === 'completed').length,
    inProgress: weekMilestones.filter(m => m.status === 'in-progress').length,
    notStarted: weekMilestones.filter(m => m.status === 'not-started').length,
  };

  const weeklyCompletionRate = weeklyProgress.total > 0
    ? Math.round((weeklyProgress.completed / weeklyProgress.total) * 100)
    : 0;

  // Generate a list of recent weeks
  const weeks = [];
  const currentWeek = getCurrentWeek();
  for (let i = 0; i < 8; i++) {
    weeks.push(currentWeek - i);
  }

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-teal-500 to-teal-700 text-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Life Goals</h2>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{lifeGoalsProgress}%</p>
                <p className="text-teal-100 text-sm">Overall Progress</p>
              </div>
              <div className="flex-1 ml-4">
                <Progress 
                  value={lifeGoalsProgress} 
                  className="h-3 bg-teal-800" 
                  color="primary" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Work Goals</h2>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold">{workGoalsProgress}%</p>
                <p className="text-purple-100 text-sm">Overall Progress</p>
              </div>
              <div className="flex-1 ml-4">
                <Progress 
                  value={workGoalsProgress} 
                  className="h-3 bg-purple-800" 
                  color="secondary" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Current Pod</h2>
            <p className="text-2xl font-bold text-gray-800">{currentPod.name}</p>
            <p className="text-gray-500">{currentPod.members.length} members</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">Weekly Check-In</span>
              <Button size="sm">
                Submit <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-teal-600 mr-2" />
                  <CardTitle>Week {selectedWeek} Progress</CardTitle>
                </div>
                <div className="flex space-x-2">
                  {weeks.slice(0, 4).map(week => (
                    <button
                      key={week}
                      onClick={() => setSelectedWeek(week)}
                      className={`px-3 py-1 rounded-md text-sm transition-colors ${
                        selectedWeek === week 
                          ? 'bg-teal-100 text-teal-800' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      Week {week}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-700">Weekly Completion Rate</h3>
                  <span className="text-sm text-gray-500">
                    {weeklyProgress.completed} of {weeklyProgress.total} completed
                  </span>
                </div>
                <Progress 
                  value={weeklyCompletionRate}
                  color={weeklyCompletionRate >= 75 ? 'success' : 'primary'}
                  size="lg"
                  showValue
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{weeklyProgress.completed}</p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-amber-700">{weeklyProgress.inProgress}</p>
                  <p className="text-sm text-amber-600">In Progress</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-gray-700">{weeklyProgress.notStarted}</p>
                  <p className="text-sm text-gray-600">Not Started</p>
                </div>
              </div>

              <div className="space-y-4">
                {weekMilestones.map(milestone => {
                  const goal = userGoals.find(g => g.id === milestone.goalId);
                  return (
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={goal?.type === 'work' ? 'secondary' : 'primary'}>
                            {goal?.type.toUpperCase()}
                          </Badge>
                          <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Goal: {goal?.title}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          milestone.status === 'completed' ? 'success' :
                          milestone.status === 'in-progress' ? 'warning' : 'outline'
                        }
                      >
                        {milestone.status === 'completed' ? 'Completed' :
                         milestone.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Your Quarterly Goals</h2>
              <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Add Goal
              </Button>
            </div>
            
            {userGoals.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500 mb-4">You haven't set any goals yet.</p>
                  <Button>Create Your First Goal</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userGoals.map((goal) => (
                  <div 
                    key={goal.id} 
                    onClick={() => setSelectedGoal(goal)}
                    className="cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                  >
                    <GoalCard 
                      goal={goal} 
                      onEdit={() => {}} 
                      onDelete={() => {}}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedGoal && (
            <Card className="mb-6 animate-fadeIn">
              <CardHeader>
                <CardTitle>Milestones for: {selectedGoal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <MilestoneList 
                  milestones={goalMilestones}
                  onSelectMilestone={() => {}}
                />
                <div className="flex justify-between items-center mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedGoal(null)}
                  >
                    Back to Goals
                  </Button>
                  <Button 
                    size="sm" 
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                  >
                    Add Milestone
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <MembersList members={currentPod.members} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;