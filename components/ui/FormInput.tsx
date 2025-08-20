import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  error, 
  icon, 
  className = '',
  ...props 
}) => {
  const baseClasses = 'w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';
  const iconClasses = icon ? 'pl-10' : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`.trim();

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <i className={`${icon} text-gray-400`}></i>
          </span>
        )}
        <input className={inputClasses} {...props} />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormInput;