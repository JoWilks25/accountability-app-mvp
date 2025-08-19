import React, { useState } from 'react';
import { PlusCircle, ChevronDown, ChevronUp, Calendar, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import GoalCard from '../components/dashboard/GoalCard';
import GoalForm from '../components/forms/GoalForm';
import MilestoneForm from '../components/forms/MilestoneForm';
import Progress from '../components/ui/Progress';
import Badge from '../components/ui/Badge';
import { Goal, Milestone } from '../types';

const Goals: React.FC = () => {
  const { currentUser, currentPod, goals, milestones, addGoal, addMilestone, updateMilestoneStatus } = useApp();
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [showAddMilestoneForm, setShowAddMilestoneForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isQuarterlyGoalsExpanded, setIsQuarterlyGoalsExpanded] = useState(true);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Goals</h2>
        <p className="text-gray-600">Please select or create a pod to manage goals.</p>
      </div>
    );
  }

  // Filter goals for the current user
  const userGoals = goals.filter(goal => goal.userId === currentUser.id);
  const lifeGoals = userGoals.filter(goal => goal.type === 'life');
  const workGoals = userGoals.filter(goal => goal.type === 'work');

  // Calculate progress
  const calculateProgress = (goals: Goal[]): number => {
    if (goals.length === 0) return 0;
    return Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length);
  };

  const lifeProgress = calculateProgress(lifeGoals);
  const workProgress = calculateProgress(workGoals);

  // Get weeks for the quarter
  const weeks = Array.from({ length: 13 }, (_, i) => getCurrentWeek() - i).filter(w => w > 0);

  // Get milestones for the selected week
  const weekMilestones = milestones.filter(
    milestone => 
      userGoals.some(goal => goal.id === milestone.goalId) && 
      milestone.weekNumber === selectedWeek
  );

  const handleAddGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'completedAt' | 'progress'>) => {
    addGoal(goalData);
    setShowAddGoalForm(false);
  };

  const handleAddMilestone = (milestoneData: Omit<Milestone, 'id' | 'createdAt' | 'completedAt'>) => {
    addMilestone(milestoneData);
    setShowAddMilestoneForm(false);
  };

  const handleStatusChange = (milestone: Milestone, status: Milestone['status']) => {
    updateMilestoneStatus(milestone.id, status);
  };

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Goals</h1>

      {/* Quarterly Goals Overview */}
      <Card className="mb-6">
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Quarterly Goals Overview</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsQuarterlyGoalsExpanded(!isQuarterlyGoalsExpanded)}
            >
              {isQuarterlyGoalsExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className={`transition-all duration-300 ${isQuarterlyGoalsExpanded ? 'py-6' : 'py-4'}`}>
          {isQuarterlyGoalsExpanded ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Life Goals</h3>
                  <Button 
                    size="sm"
                    variant="outline"
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                    onClick={() => {
                      setEditingGoal(null);
                      setShowAddGoalForm(true);
                    }}
                  >
                    Add Quarterly Goal
                  </Button>
                </div>
                <div className="space-y-4">
                  {lifeGoals.map(goal => (
                    <GoalCard 
                      key={goal.id}
                      goal={goal}
                      onEdit={() => {
                        setEditingGoal(goal);
                        setShowAddGoalForm(true);
                      }}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Work Goals</h3>
                  <Button 
                    size="sm"
                    variant="outline"
                    leftIcon={<PlusCircle className="w-4 h-4" />}
                    onClick={() => {
                      setEditingGoal(null);
                      setShowAddGoalForm(true);
                    }}
                  >
                    Add Quarterly Goal
                  </Button>
                </div>
                <div className="space-y-4">
                  {workGoals.map(goal => (
                    <GoalCard 
                      key={goal.id}
                      goal={goal}
                      onEdit={() => {
                        setEditingGoal(goal);
                        setShowAddGoalForm(true);
                      }}
                      onDelete={() => {}}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-600">Life Goals</h3>
                  <span className="text-sm font-medium text-gray-700">{lifeProgress}%</span>
                </div>
                {lifeGoals.map(goal => (
                  <div key={goal.id} className="flex items-center mb-2">
                    <span className="text-sm text-gray-700 truncate max-w-[200px] mr-3">
                      {goal.title}
                    </span>
                    <Progress 
                      value={goal.progress} 
                      color="primary" 
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-600">Work Goals</h3>
                  <span className="text-sm font-medium text-gray-700">{workProgress}%</span>
                </div>
                {workGoals.map(goal => (
                  <div key={goal.id} className="flex items-center mb-2">
                    <span className="text-sm text-gray-700 truncate max-w-[200px] mr-3">
                      {goal.title}
                    </span>
                    <Progress 
                      value={goal.progress} 
                      color="secondary" 
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Weekly Goals</h2>
          <div className="flex items-center space-x-4">
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
            <Button 
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => setShowAddMilestoneForm(true)}
            >
              Add Weekly Goal
            </Button>
          </div>
        </div>

        {weekMilestones.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">No weekly goals set for week {selectedWeek}.</p>
              <Button 
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={() => setShowAddMilestoneForm(true)}
              >
                Add Weekly Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {weekMilestones.map(milestone => {
              const goal = userGoals.find(g => g.id === milestone.goalId);
              return (
                <Card key={milestone.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={goal?.type === 'work' ? 'secondary' : 'primary'}>
                            {goal?.type.toUpperCase()}
                          </Badge>
                          <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">Goal: {goal?.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={
                            milestone.status === 'completed' ? 'success' :
                            milestone.status === 'in-progress' ? 'warning' : 'outline'
                          }
                        >
                          {milestone.status === 'completed' ? 'Completed' :
                           milestone.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                        </Badge>
                        {milestone.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleStatusChange(milestone, 'completed')}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Forms */}
      {showAddGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl animate-fadeIn">
            <CardHeader>
              <CardTitle>{editingGoal ? 'Edit Quarterly Goal' : 'Add New Quarterly Goal'}</CardTitle>
            </CardHeader>
            <CardContent>
              <GoalForm 
                initialData={editingGoal || {}}
                onSubmit={handleAddGoal}
                onCancel={() => {
                  setShowAddGoalForm(false);
                  setEditingGoal(null);
                }}
                podId={currentPod.id}
                userId={currentUser.id}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {showAddMilestoneForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl animate-fadeIn">
            <CardHeader>
              <CardTitle>Add New Weekly Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <MilestoneForm 
                onSubmit={handleAddMilestone}
                onCancel={() => setShowAddMilestoneForm(false)}
                goals={userGoals}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Goals;