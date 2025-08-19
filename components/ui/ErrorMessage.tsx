import React from 'react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  icon?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Something Went Wrong',
  message,
  icon = 'fas fa-exclamation-triangle'
}) => {
  return (
    <div className="text-center py-16 px-4 bg-red-900/20 border border-red-500/50 rounded-lg">
      <i className={`${icon} text-5xl text-red-400`}></i>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-1 text-red-300">{message}</p>
    </div>
  );
};

export default ErrorMessage;