import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };
  
  if (!isVisible) return null;
  
  const typeConfig = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-400',
      textColor: 'text-green-800',
      icon: <CheckCircle className="h-5 w-5 text-green-400" />
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-400',
      textColor: 'text-red-800',
      icon: <AlertCircle className="h-5 w-5 text-red-400" />
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-800',
      icon: <Info className="h-5 w-5 text-blue-400" />
    }
  };
  
  const { bgColor, borderColor, textColor, icon } = typeConfig[type];
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <div className={`${bgColor} border-l-4 ${borderColor} p-4 rounded shadow-md flex items-start max-w-sm`}>
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className={`ml-3 ${textColor}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={handleClose}
          className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-400 hover:text-gray-900 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

// Toast container to manage multiple toasts
interface ToastContainerProps {
  children: React.ReactNode;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ children }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {children}
    </div>
  );
};