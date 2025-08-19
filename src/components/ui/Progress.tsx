import React from 'react';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  animate?: boolean;
  label?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className = '',
  size = 'md',
  color = 'primary',
  showValue = false,
  animate = true,
  label,
}) => {
  const percentage = (value / max) * 100;
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'bg-teal-600',
    secondary: 'bg-purple-600',
    success: 'bg-green-600',
    warning: 'bg-amber-500',
    danger: 'bg-red-600',
  };

  const animateClass = animate ? 'transition-all duration-300 ease-in-out' : '';

  return (
    <div className={`w-full ${className}`}>
      {label && <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && <span className="text-sm font-medium text-gray-500">{value}%</span>}
      </div>}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${animateClass} rounded-full`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {!label && showValue && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {value}%
        </div>
      )}
    </div>
  );
};

export default Progress;