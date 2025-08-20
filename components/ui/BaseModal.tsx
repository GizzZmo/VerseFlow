import React from 'react';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};
const BaseModal: React.FC<BaseModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  icon, 
  maxWidth = 'lg',
  children 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn" 
      onClick={onClose}
    >
      <div 
        className={`bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full ${maxWidthClasses[maxWidth]} text-white transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            {icon && <i className={`${icon} text-purple-400 mr-3`}></i>}
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            &times;
          </button>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default BaseModal;