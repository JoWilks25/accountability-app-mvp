import React, { useState } from 'react';
import Button from '../ui/Button';
import { CheckIn } from '../../types';
import { Send } from 'lucide-react';
import { getWeekDateRange } from '../../utils/dateUtils';

interface CheckInFormProps {
  initialData?: Partial<CheckIn>;
  onSubmit: (data: Omit<CheckIn, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
  podId: string;
  userId: string;
  weekNumber: number;
  weekStartDay?: number;
}

const CheckInForm: React.FC<CheckInFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  podId,
  userId,
  weekNumber,
  weekStartDay = 1,
}) => {
  const [formData, setFormData] = useState({
    content: initialData.content || '',
    challenges: initialData.challenges || '',
    wins: initialData.wins || '',
    nextSteps: initialData.nextSteps || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    
    if (!formData.content.trim()) {
      newErrors.content = 'Weekly summary is required';
    }
    
    if (!formData.challenges.trim()) {
      newErrors.challenges = 'Challenges section is required';
    }
    
    if (!formData.wins.trim()) {
      newErrors.wins = 'Wins section is required';
    }
    
    if (!formData.nextSteps.trim()) {
      newErrors.nextSteps = 'Next steps are required';
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
        weekNumber,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Weekly Summary
        </label>
        <textarea
          id="content"
          name="content"
          rows={3}
          value={formData.content}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="How did your week go overall?"
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
      </div>

      <div>
        <label htmlFor="challenges" className="block text-sm font-medium text-gray-700 mb-1">
          Challenges
        </label>
        <textarea
          id="challenges"
          name="challenges"
          rows={3}
          value={formData.challenges}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
            errors.challenges ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="What challenges did you face?"
        />
        {errors.challenges && <p className="mt-1 text-sm text-red-600">{errors.challenges}</p>}
      </div>

      <div>
        <label htmlFor="wins" className="block text-sm font-medium text-gray-700 mb-1">
          Wins
        </label>
        <textarea
          id="wins"
          name="wins"
          rows={3}
          value={formData.wins}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
            errors.wins ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="What went well? What did you accomplish?"
        />
        {errors.wins && <p className="mt-1 text-sm text-red-600">{errors.wins}</p>}
      </div>

      <div>
        <label htmlFor="nextSteps" className="block text-sm font-medium text-gray-700 mb-1">
          Next Steps
        </label>
        <textarea
          id="nextSteps"
          name="nextSteps"
          rows={3}
          value={formData.nextSteps}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 ${
            errors.nextSteps ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="What are your priorities for next week?"
        />
        {errors.nextSteps && <p className="mt-1 text-sm text-red-600">{errors.nextSteps}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" rightIcon={<Send className="w-4 h-4" />}>
          Submit Check-In
        </Button>
      </div>
    </form>
  );
};

export default CheckInForm;