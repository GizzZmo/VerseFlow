import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ 
  label, 
  error, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-colors';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  
  const textareaClasses = `${baseClasses} ${errorClasses} ${className}`.trim();

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormTextarea;