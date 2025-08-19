import React, { useState } from 'react';
import Button from '../ui/Button';
import { Goal } from '../../types';
import { CheckCircle2 } from 'lucide-react';

interface GoalFormProps {
  initialData?: Partial<Goal>;
  onSubmit: (data: Omit<Goal, 'id' | 'createdAt' | 'completedAt' | 'progress'>) => void;
  onCancel?: () => void;
  podId: string;
  userId: string;
}

const GoalForm: React.FC<GoalFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  podId,
  userId,
}) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    type: initialData.type || 'life',
    quarter: initialData.quarter || getCurrentQuarter(),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function getCurrentQuarter(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    return `Q${quarter} ${year}`;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
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
    
    if (!formData.quarter.trim()) {
      newErrors.quarter = 'Quarter is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        ...formData,
        userId,
        podId,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Goal Title
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
          placeholder="Enter your goal title"
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
          placeholder="Describe your goal and what you want to achieve"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="life">Life</option>
            <option value="work">Work</option>
          </select>
        </div>

        <div className="w-1/2">
          <label htmlFor="quarter" className="block text-sm font-medium text-gray-700 mb-1">
            Quarter
          </label>
          <input
            type="text"
            id="quarter"
            name="quarter"
            value={formData.quarter}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
              errors.quarter ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Q2 2025"
          />
          {errors.quarter && <p className="mt-1 text-sm text-red-600">{errors.quarter}</p>}
        </div>
      </div>

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

export default GoalForm;