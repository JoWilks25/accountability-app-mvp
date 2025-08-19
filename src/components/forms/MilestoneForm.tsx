import React, { useState } from 'react';
import Button from '../ui/Button';
import { Milestone, Goal } from '../../types';
import { CheckCircle2 } from 'lucide-react';
import { getWeekDateRange } from '../../utils/dateUtils';

interface MilestoneFormProps {
  initialData?: Partial<Milestone>;
  onSubmit: (data: Omit<Milestone, 'id' | 'createdAt' | 'completedAt'>) => void;
  onCancel?: () => void;
  goals: Goal[];
  weekStartDay?: number;
}

const MilestoneForm: React.FC<MilestoneFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  goals,
  weekStartDay = 1,
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    weekNumber: initialData.weekNumber || 1,
    goalId: initialData.goalId || (goals.length > 0 ? goals[0].id : ''),
    status: initialData.status || 'not-started',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert weekNumber to a number
    if (name === 'weekNumber') {
      const numValue = parseInt(value, 10);
      setFormData((prev) => ({ ...prev, [name]: isNaN(numValue) ? 1 : numValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.goalId) {
      newErrors.goalId = 'Please select a goal';
    }
    
    if (formData.weekNumber < 1 || formData.weekNumber > 12) {
      newErrors.weekNumber = 'Week number must be between 1 and 12';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Weekly Goal Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter goal title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe what needs to be done for this goal"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="goalId" className="block text-sm font-medium text-gray-700 mb-1">
            Related Goal
          </label>
          <select
            id="goalId"
            name="goalId"
            value={formData.goalId}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
              errors.goalId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="" disabled>Select a goal</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title} ({goal.type})
              </option>
            ))}
          </select>
          {errors.goalId && <p className="mt-1 text-sm text-red-600">{errors.goalId}</p>}
        </div>

        <div className="w-1/2">
          <label htmlFor="weekNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Week Number (1-12)
          </label>
          <select
            id="weekNumber"
            name="weekNumber"
            value={formData.weekNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
              errors.weekNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(week => (
              <option key={week} value={week}>
                Week {week} ({getWeekDateRange(week, weekStartDay)})
              </option>
            ))}
          </select>
          {errors.weekNumber && <p className="mt-1 text-sm text-red-600">{errors.weekNumber}</p>}
        </div>
      </div>

      {initialData.id && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="not-started">Not Started</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
          {initialData.id ? 'Update Goal' : 'Create Goal'}
        </Button>
      </div>
    </form>
  );
};

export default MilestoneForm;