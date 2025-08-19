import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: string;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-purple-600 hover:bg-purple-500 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-500 text-white',
  success: 'bg-green-600 hover:bg-green-500 text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 border border-gray-600',
};

const sizeClasses = {
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-sm',
  lg: 'py-3 px-6 text-base',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || isLoading;
  
  const baseClasses = 'font-bold rounded-lg transition-colors flex items-center justify-center';
  const disabledClasses = isDisabled ? 'disabled:bg-gray-600 disabled:cursor-not-allowed' : '';
  
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.trim();

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <>
          <i className="fas fa-spinner fa-spin mr-2"></i>
          {children}
        </>
      ) : (
        <>
          {icon && <i className={`${icon} mr-2`}></i>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;