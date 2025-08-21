import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  description?: string;
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-5xl',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'lg', 
  message = 'Loading...', 
  description 
}) => {
  return (
    <div className="text-center py-16 px-4 bg-gray-800 rounded-lg">
      <i className={`fas fa-spinner fa-spin ${sizeClasses[size]} text-purple-400`}></i>
      <h3 className="mt-4 text-xl font-semibold text-white">{message}</h3>
      {description && <p className="mt-1 text-gray-400">{description}</p>}
    </div>
  );
};

export default LoadingSpinner;