import React, { useState } from 'react';
import { PlusCircle, UserPlus, Crown, Settings, LogOut, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

const Members: React.FC = () => {
  const { currentUser, currentPod } = useApp();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  
  if (!currentUser || !currentPod) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pod Members</h2>
        <p className="text-gray-600">Please select or create a pod to view members.</p>
      </div>
    );
  }

  const isOwner = currentPod.ownerId === currentUser.id;

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send an invitation
    alert(`Invitation would be sent to ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteForm(false);
  };

  return (
    <div className="pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pod Members</h1>
        <Button 
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => setShowInviteForm(true)}
        >
          Invite Member
        </Button>
      </div>
      
      {showInviteForm && (
        <Card className="mb-8 animate-fadeIn">
          <CardHeader>
            <CardTitle>Invite New Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowInviteForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Send Invitation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>Members of {currentPod.name}</CardTitle>
            <Badge variant={currentPod.members.length >= 10 ? 'danger' : 'success'}>
              {currentPod.members.length}/10 Members
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {currentPod.members.map((member) => (
              <div key={member.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar src={member.avatarUrl} alt={member.name} />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        {currentPod.ownerId === member.id && (
                          <Badge variant="secondary" className="ml-2">
                            <Crown className="w-3 h-3 mr-1" />
                            Owner
                          </Badge>
                        )}
                        {member.id === currentUser.id && (
                          <Badge variant="outline" className="ml-2">You</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  
                  {isOwner && member.id !== currentUser.id && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        {isOwner && (
          <CardFooter className="border-t p-4">
            <div className="w-full flex justify-end">
              <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
                Manage Pod Settings
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Members;