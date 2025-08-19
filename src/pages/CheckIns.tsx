import React, { useState } from 'react';
import { PlusCircle, Calendar, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import CheckInForm from '../components/forms/CheckInForm';
import { getCurrentQuarterWeek, getWeekDateRange, getQuarterWeeks } from '../utils/dateUtils';

const CheckIns: React.FC = () => {
  const { currentUser, currentPod, checkIns, addCheckIn } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number>(getCurrentQuarterWeek());
  
  if (!currentUser || !currentPod) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Weekly Check-Ins</h2>
        <p className="text-gray-600">Please select or create a pod to view check-ins.</p>
      </div>
    );
  }

  // Filter check-ins for the current pod
  const podCheckIns = checkIns.filter(checkIn => checkIn.podId === currentPod.id);
  
  // Check if the current user has a check-in for the selected week
  const userHasCheckIn = podCheckIns.some(
    checkIn => checkIn.userId === currentUser.id && checkIn.weekNumber === selectedWeek
  );

  const handleAddCheckIn = (checkInData: any) => {
    addCheckIn(checkInData);
    setShowAddForm(false);
  };

  // Get available weeks for the quarter
  const quarterWeeks = getQuarterWeeks(currentPod.settings.weekStartDay);

  // Filter check-ins for the selected week
  const weekCheckIns = podCheckIns.filter(checkIn => checkIn.weekNumber === selectedWeek);

  const getUserById = (userId: string) => {
    return currentPod.members.find(member => member.id === userId);
  };

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Weekly Check-Ins</h1>
        {!userHasCheckIn && !showAddForm && (
          <Button 
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setShowAddForm(true)}
          >
            Submit Check-In
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Select Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quarterWeeks.map(({ number, dateRange }) => (
                  <button
                    key={number}
                    onClick={() => setSelectedWeek(number)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedWeek === number 
                        ? 'bg-teal-100 text-teal-800' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">Week {number}</div>
                    <div className="text-xs text-gray-500">{dateRange}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          {showAddForm ? (
            <Card className="mb-6 animate-fadeIn">
              <CardHeader>
                <CardTitle>Submit Weekly Check-In</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Week {selectedWeek} ({getWeekDateRange(selectedWeek, currentPod.settings.weekStartDay)})
                </p>
              </CardHeader>
              <CardContent>
                <CheckInForm 
                  onSubmit={handleAddCheckIn}
                  onCancel={() => setShowAddForm(false)}
                  podId={currentPod.id}
                  userId={currentUser.id}
                  weekNumber={selectedWeek}
                />
              </CardContent>
            </Card>
          ) : weekCheckIns.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">
                    No check-ins for Week {selectedWeek}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    {getWeekDateRange(selectedWeek, currentPod.settings.weekStartDay)}
                  </p>
                  {!userHasCheckIn && (
                    <Button 
                      leftIcon={<PlusCircle className="w-4 h-4" />}
                      onClick={() => setShowAddForm(true)}
                    >
                      Submit Check-In
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {weekCheckIns.map(checkIn => {
                const user = getUserById(checkIn.userId);
                return (
                  <Card key={checkIn.id}>
                    <CardHeader className="border-b">
                      <div className="flex items-center">
                        <Avatar 
                          src={user?.avatarUrl} 
                          alt={user?.name || "User"}
                          size="md"
                        />
                        <div className="ml-3">
                          <CardTitle>{user?.name || "Unknown User"}</CardTitle>
                          <p className="text-sm text-gray-500">
                            Submitted on {new Date(checkIn.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Weekly Summary</h3>
                          <p className="text-gray-700">{checkIn.content}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-red-50 p-3 rounded-lg">
                            <h4 className="font-medium text-red-800 mb-1">Challenges</h4>
                            <p className="text-gray-700 text-sm">{checkIn.challenges}</p>
                          </div>
                          
                          <div className="bg-green-50 p-3 rounded-lg">
                            <h4 className="font-medium text-green-800 mb-1">Wins</h4>
                            <p className="text-gray-700 text-sm">{checkIn.wins}</p>
                          </div>
                          
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <h4 className="font-medium text-blue-800 mb-1">Next Steps</h4>
                            <p className="text-gray-700 text-sm">{checkIn.nextSteps}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIns;