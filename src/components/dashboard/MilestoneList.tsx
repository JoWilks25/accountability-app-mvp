import React from 'react';
import { CheckCircle, Circle, Clock, ChevronRight } from 'lucide-react';
import { Milestone } from '../../types';
import { getWeekDateRange } from '../../utils/dateUtils';

interface MilestoneListProps {
  milestones: Milestone[];
  onSelectMilestone?: (milestone: Milestone) => void;
  className?: string;
  weekStartDay?: number;
}

const MilestoneList: React.FC<MilestoneListProps> = ({ 
  milestones, 
  onSelectMilestone,
  className = '',
  weekStartDay = 1
}) => {
  // Sort milestones by week number
  const sortedMilestones = [...milestones].sort((a, b) => a.weekNumber - b.weekNumber);

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'not-started':
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusClass = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in-progress':
        return 'border-amber-200 bg-amber-50';
      case 'not-started':
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold mb-4">Weekly Goals</h3>
      <div className="space-y-3">
        {sortedMilestones.length === 0 ? (
          <p className="text-gray-500 text-sm">No goals found.</p>
        ) : (
          sortedMilestones.map((milestone) => (
            <div 
              key={milestone.id}
              className={`border rounded-lg p-3 ${getStatusClass(milestone.status)} transition-all duration-200 hover:shadow-md cursor-pointer`}
              onClick={() => onSelectMilestone && onSelectMilestone(milestone)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(milestone.status)}
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                    <div className="flex items-center mt-1">
                      <span className="text-xs font-medium text-gray-500">
                        Week {milestone.weekNumber} ({getWeekDateRange(milestone.weekNumber, weekStartDay)})
                      </span>
                      {milestone.completedAt && (
                        <>
                          <span className="mx-2 text-gray-300">•</span>
                          <span className="text-xs text-gray-500">
                            Completed on {new Date(milestone.completedAt).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MilestoneList;