import React, { useState } from 'react';
import { Users, User, Calendar, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Progress from '../components/ui/Progress';

const Analytics: React.FC = () => {
  const { currentUser, currentPod, goals, milestones } = useApp();
  const [view, setView] = useState<'team' | 'individual'>('team');
  const [selectedQuarter, setSelectedQuarter] = useState(getCurrentQuarter());
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());

  function getCurrentWeek(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
  }

  function getCurrentQuarter(): string {
    const now = new Date();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `Q${quarter} ${now.getFullYear()}`;
  }

  if (!currentUser || !currentPod) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analytics</h2>
        <p className="text-gray-600">Please select or create a pod to view analytics.</p>
      </div>
    );
  }

  // Get all pod members' goals for team view
  const podGoals = goals.filter(goal => 
    currentPod.members.some(member => member.id === goal.userId) &&
    goal.quarter === selectedQuarter
  );

  // Get current user's goals for individual view
  const userGoals = goals.filter(goal => 
    goal.userId === currentUser.id &&
    goal.quarter === selectedQuarter
  );

  // Calculate completion rates
  const calculateCompletionRate = (goalsList: typeof goals) => {
    const total = goalsList.length;
    if (total === 0) return 0;
    const completed = goalsList.filter(goal => goal.progress === 100).length;
    return Math.round((completed / total) * 100);
  };

  // Calculate weekly milestone completion rates
  const calculateWeeklyCompletion = (userId?: string) => {
    const weekMilestones = milestones.filter(m => {
      const goalBelongsToUser = userId 
        ? goals.some(g => g.id === m.goalId && g.userId === userId)
        : goals.some(g => g.id === m.goalId && currentPod.members.some(member => member.id === g.userId));
      return m.weekNumber === selectedWeek && goalBelongsToUser;
    });

    const total = weekMilestones.length;
    const completed = weekMilestones.filter(m => m.status === 'completed').length;
    const inProgress = weekMilestones.filter(m => m.status === 'in-progress').length;

    return {
      total,
      completed,
      inProgress,
      notStarted: total - completed - inProgress,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  // Get member stats for team view
  const memberStats = currentPod.members.map(member => {
    const memberGoals = goals.filter(goal => goal.userId === member.id && goal.quarter === selectedQuarter);
    const weeklyCompletion = calculateWeeklyCompletion(member.id);
    
    return {
      member,
      goalsCount: memberGoals.length,
      completionRate: calculateCompletionRate(memberGoals),
      weeklyProgress: weeklyCompletion
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  // Generate weeks for selection
  const weeks = Array.from({ length: 13 }, (_, i) => getCurrentWeek() - i).filter(w => w > 0);

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <div className="flex space-x-2">
          <Button
            variant={view === 'team' ? 'primary' : 'outline'}
            onClick={() => setView('team')}
            leftIcon={<Users className="w-4 h-4" />}
          >
            Team View
          </Button>
          <Button
            variant={view === 'individual' ? 'primary' : 'outline'}
            onClick={() => setView('individual')}
            leftIcon={<User className="w-4 h-4" />}
          >
            Individual View
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-teal-600 mr-2" />
                <h2 className="font-semibold text-gray-700">Quarterly Progress</h2>
              </div>
              <span className="text-sm text-gray-500">{selectedQuarter}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {view === 'team' 
                ? calculateCompletionRate(podGoals)
                : calculateCompletionRate(userGoals)}%
            </div>
            <Progress 
              value={view === 'team' 
                ? calculateCompletionRate(podGoals)
                : calculateCompletionRate(userGoals)
              } 
              color="primary"
              size="lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="font-semibold text-gray-700">Weekly Completion</h2>
              </div>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="text-sm border rounded-md px-2 py-1"
              >
                {weeks.map(week => (
                  <option key={week} value={week}>Week {week}</option>
                ))}
              </select>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {view === 'team'
                ? calculateWeeklyCompletion().rate
                : calculateWeeklyCompletion(currentUser.id).rate}%
            </div>
            <Progress 
              value={view === 'team'
                ? calculateWeeklyCompletion().rate
                : calculateWeeklyCompletion(currentUser.id).rate
              } 
              color="secondary"
              size="lg"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-gray-700 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Total Goals</span>
                  <span className="font-medium">
                    {view === 'team' ? podGoals.length : userGoals.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Completed Goals</span>
                  <span className="font-medium text-green-600">
                    {view === 'team'
                      ? podGoals.filter(g => g.progress === 100).length
                      : userGoals.filter(g => g.progress === 100).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-medium text-amber-600">
                    {view === 'team'
                      ? podGoals.filter(g => g.progress > 0 && g.progress < 100).length
                      : userGoals.filter(g => g.progress > 0 && g.progress < 100).length}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {view === 'team' ? (
        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberStats.map(({ member, goalsCount, completionRate, weeklyProgress }) => (
                <div key={member.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{goalsCount} goals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {completionRate}% complete
                      </div>
                      <div className="text-sm text-gray-500">
                        Week {selectedWeek}: {weeklyProgress.rate}% complete
                      </div>
                    </div>
                  </div>
                  <Progress value={completionRate} color="primary" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userGoals.map(goal => (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{goal.title}</h3>
                        <p className="text-sm text-gray-500">{goal.type} goal</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {goal.progress}% complete
                        </div>
                        <div className="text-sm text-gray-500">
                          {goal.completedAt ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                    </div>
                    <Progress value={goal.progress} color={goal.type === 'work' ? 'secondary' : 'primary'} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Goals Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {['Completed', 'In Progress', 'Not Started'].map((status, index) => {
                  const stats = calculateWeeklyCompletion(currentUser.id);
                  const value = status === 'Completed' ? stats.completed
                    : status === 'In Progress' ? stats.inProgress
                    : stats.notStarted;
                  
                  return (
                    <div key={status} className={`p-4 rounded-lg ${
                      status === 'Completed' ? 'bg-green-50'
                      : status === 'In Progress' ? 'bg-amber-50'
                      : 'bg-gray-50'
                    }`}>
                      <div className={`text-2xl font-bold ${
                        status === 'Completed' ? 'text-green-700'
                        : status === 'In Progress' ? 'text-amber-700'
                        : 'text-gray-700'
                      }`}>
                        {value}
                      </div>
                      <div className={`text-sm ${
                        status === 'Completed' ? 'text-green-600'
                        : status === 'In Progress' ? 'text-amber-600'
                        : 'text-gray-600'
                      }`}>
                        {status}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;