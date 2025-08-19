import React, { useState } from 'react';
import { PlusCircle, Calendar, CheckCircle, CircleSlash } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import MilestoneForm from '../components/forms/MilestoneForm';
import Badge from '../components/ui/Badge';
import { Milestone } from '../types';

const Milestones: React.FC = () => {
  const { currentUser, currentPod, goals, milestones, addMilestone, updateMilestoneStatus } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  
  if (!currentUser || !currentPod) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Milestones</h2>
        <p className="text-gray-600">Please select or create a pod to manage milestones.</p>
      </div>
    );
  }

  // Get user's goals
  const userGoals = goals.filter(goal => goal.userId === currentUser.id);
  
  // Get milestones for user's goals
  const userMilestones = milestones.filter(milestone => 
    userGoals.some(goal => goal.id === milestone.goalId)
  );

  // Group milestones by week
  const milestonesByWeek: Record<number, typeof userMilestones> = {};
  
  userMilestones.forEach(milestone => {
    if (!milestonesByWeek[milestone.weekNumber]) {
      milestonesByWeek[milestone.weekNumber] = [];
    }
    milestonesByWeek[milestone.weekNumber].push(milestone);
  });

  const getGoalById = (goalId: string) => {
    return goals.find(goal => goal.id === goalId);
  };

  const handleAddMilestone = (milestoneData: Omit<Milestone, 'id' | 'createdAt' | 'completedAt'>) => {
    addMilestone(milestoneData);
    setShowAddForm(false);
  };

  const handleStatusChange = (milestone: Milestone, status: Milestone['status']) => {
    updateMilestoneStatus(milestone.id, status);
  };

  const getStatusBadge = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'not-started':
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Weekly Milestones</h1>
        <Button 
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => {
            setEditingMilestone(null);
            setShowAddForm(true);
          }}
        >
          Add Milestone
        </Button>
      </div>
      
      {showAddForm && (
        <Card className="mb-8 animate-fadeIn">
          <CardHeader>
            <CardTitle>{editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}</CardTitle>
          </CardHeader>
          <CardContent>
            <MilestoneForm 
              initialData={editingMilestone || {}}
              onSubmit={handleAddMilestone}
              onCancel={() => setShowAddForm(false)}
              goals={userGoals}
            />
          </CardContent>
        </Card>
      )}
      
      {Object.keys(milestonesByWeek).length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You haven't set any milestones yet.</p>
              <Button 
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={() => setShowAddForm(true)}
              >
                Create Your First Milestone
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        Object.entries(milestonesByWeek)
          .sort(([weekA], [weekB]) => parseInt(weekA) - parseInt(weekB))
          .map(([week, weekMilestones]) => (
            <Card key={week} className="mb-6">
              <CardHeader className="border-b">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-teal-600" />
                  <CardTitle>Week {week}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {weekMilestones.map(milestone => {
                    const relatedGoal = getGoalById(milestone.goalId);
                    return (
                      <div key={milestone.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium text-lg text-gray-900">
                                {milestone.title}
                              </h3>
                              <div className="ml-3">
                                {getStatusBadge(milestone.status)}
                              </div>
                            </div>
                            {relatedGoal && (
                              <p className="text-sm text-gray-600 mt-1">
                                Goal: {relatedGoal.title}
                              </p>
                            )}
                            <p className="mt-2 text-gray-700">
                              {milestone.description}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {milestone.status !== 'completed' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                leftIcon={<CheckCircle className="w-4 h-4 text-green-600" />}
                                onClick={() => handleStatusChange(milestone, 'completed')}
                              >
                                Mark Complete
                              </Button>
                            )}
                            {milestone.status !== 'in-progress' && milestone.status !== 'completed' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusChange(milestone, 'in-progress')}
                              >
                                Start
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))
      )}
    </div>
  );
};

export default Milestones;