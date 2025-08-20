import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <div className="text-center py-16 px-4 bg-gray-800 rounded-lg">
      <i className={`${icon} text-5xl text-gray-500`}></i>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-1 text-gray-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;