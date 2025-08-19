import React from 'react';
import { User } from '../../types';
import Avatar from '../ui/Avatar';

interface MembersListProps {
  members: User[];
  className?: string;
  limit?: number;
  showMore?: boolean;
}

const MembersList: React.FC<MembersListProps> = ({ 
  members, 
  className = '',
  limit = 5,
  showMore = true
}) => {
  const displayMembers = members.slice(0, limit);
  const remainingCount = members.length - limit;

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-3">Pod Members</h3>
      <div className="space-y-3">
        {displayMembers.map((member) => (
          <div key={member.id} className="flex items-center">
            <Avatar src={member.avatarUrl} alt={member.name} />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.email}</p>
            </div>
          </div>
        ))}
        {showMore && remainingCount > 0 && (
          <div className="mt-2 text-sm text-teal-600 font-medium cursor-pointer hover:text-teal-800">
            View {remainingCount} more member{remainingCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default MembersList;