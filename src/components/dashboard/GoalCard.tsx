import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import Progress from '../ui/Progress';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Goal } from '../../types';

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'success';
    if (progress >= 40) return 'primary';
    if (progress >= 20) return 'warning';
    return 'danger';
  };

  return (
    <Card hover className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge 
              variant={goal.type === 'work' ? 'secondary' : 'primary'} 
              className="mb-2"
            >
              {goal.type.toUpperCase()}
            </Badge>
            <CardTitle>{goal.title}</CardTitle>
            <CardDescription className="mt-1">{goal.quarter}</CardDescription>
          </div>
          <div className="flex space-x-1">
            {onEdit && (
              <button 
                onClick={() => onEdit(goal)}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Pencil className="w-4 h-4" />
                <span className="sr-only">Edit</span>
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(goal.id)}
                className="p-1 text-gray-500 hover:text-red-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="sr-only">Delete</span>
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
        <div className="mt-2">
          <Progress 
            value={goal.progress} 
            color={getProgressColor(goal.progress)} 
            label="Progress" 
            showValue 
          />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 mt-2">
        <div className="flex justify-between w-full items-center">
          <span className="text-xs text-gray-500">
            Created: {new Date(goal.createdAt).toLocaleDateString()}
          </span>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GoalCard;