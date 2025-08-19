import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import { Camera, Mail, User as UserIcon, Calendar, CheckCircle } from 'lucide-react';
import Progress from '../components/ui/Progress';

const Profile: React.FC = () => {
  const { currentUser, goals, milestones } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    avatarUrl: currentUser?.avatarUrl || '',
  });

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  // Calculate statistics
  const userGoals = goals.filter(goal => goal.userId === currentUser.id);
  const userMilestones = milestones.filter(milestone => 
    userGoals.some(goal => goal.id === milestone.goalId)
  );

  const stats = {
    totalGoals: userGoals.length,
    completedGoals: userGoals.filter(goal => goal.progress === 100).length,
    totalMilestones: userMilestones.length,
    completedMilestones: userMilestones.filter(m => m.status === 'completed').length,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user's profile
    setIsEditing(false);
  };

  return (
    <div className="pb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <Avatar 
                        src={formData.avatarUrl} 
                        alt={formData.name}
                        size="xl"
                      />
                      <button
                        type="button"
                        className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border hover:bg-gray-50"
                      >
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Avatar 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.name}
                        size="xl"
                      />
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {currentUser.name}
                        </h2>
                        <p className="text-gray-500">Member since {new Date(currentUser.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-5 h-5 mr-2" />
                      {currentUser.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <UserIcon className="w-5 h-5 mr-2" />
                      Active in {stats.totalGoals} goals
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      {stats.completedMilestones} milestones completed
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Goals</span>
                    <span className="text-sm text-gray-500">
                      {stats.completedGoals} of {stats.totalGoals} completed
                    </span>
                  </div>
                  <Progress 
                    value={stats.totalGoals > 0 ? (stats.completedGoals / stats.totalGoals) * 100 : 0}
                    color="primary"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Milestones</span>
                    <span className="text-sm text-gray-500">
                      {stats.completedMilestones} of {stats.totalMilestones} completed
                    </span>
                  </div>
                  <Progress 
                    value={stats.totalMilestones > 0 ? (stats.completedMilestones / stats.totalMilestones) * 100 : 0}
                    color="secondary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userMilestones
                  .filter(m => m.status === 'completed')
                  .slice(0, 3)
                  .map(milestone => {
                    const goal = userGoals.find(g => g.id === milestone.goalId);
                    return (
                      <div key={milestone.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {milestone.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {goal?.title}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;