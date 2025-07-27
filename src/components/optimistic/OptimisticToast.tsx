"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { cn } from '@/lib/utils';
import { X, Check, AlertCircle, Info, Loader2 } from 'lucide-react';

interface OptimisticToast {
  id: string;
  type: 'success' | 'error' | 'info' | 'pending';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

interface OptimisticToastContextType {
  toasts: OptimisticToast[];
  addToast: (toast: Omit<OptimisticToast, 'id'>) => string;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<OptimisticToast>) => void;
}

const OptimisticToastContext = createContext<OptimisticToastContextType | undefined>(undefined);

export function useOptimisticToast() {
  const context = useContext(OptimisticToastContext);
  if (!context) {
    throw new Error('useOptimisticToast must be used within an OptimisticToastProvider');
  }
  return context;
}

interface OptimisticToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export function OptimisticToastProvider({
  children,
  maxToasts = 5,
  position = 'top-right'
}: OptimisticToastProviderProps) {
  const [toasts, setToasts] = useState<OptimisticToast[]>([]);

  const addToast = (toast: Omit<OptimisticToast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto-remove toast after duration (except for pending toasts)
    if (toast.duration !== 0 && toast.type !== 'pending') {
      const duration = toast.duration || (toast.type === 'error' ? 7000 : 4000);
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const updateToast = (id: string, updates: Partial<OptimisticToast>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <OptimisticToastContext.Provider value={{ toasts, addToast, removeToast, updateToast }}>
      {children}
      
      {/* Toast Container */}
      <div className={cn(
        'fixed z-50 pointer-events-none',
        getPositionClasses()
      )}>
        <div className="space-y-3 w-96 max-w-sm">
          {toasts.map(toast => (
            <OptimisticToastComponent
              key={toast.id}
              toast={toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </OptimisticToastContext.Provider>
  );
}

interface OptimisticToastComponentProps {
  toast: OptimisticToast;
  onDismiss: () => void;
}

function OptimisticToastComponent({ toast, onDismiss }: OptimisticToastComponentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onDismiss();
      toast.onDismiss?.();
    }, 150);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTypeClasses = () => {
    switch (toast.type) {
      case 'success':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
      case 'pending':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  return (
    <div
      className={cn(
        'pointer-events-auto relative overflow-hidden rounded-lg border shadow-lg transition-all duration-300 ease-in-out',
        getTypeClasses(),
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        isLeaving && 'translate-x-full opacity-0'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {toast.title}
            </p>
            {toast.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {toast.description}
              </p>
            )}
            
            {toast.action && (
              <div className="mt-3">
                <button
                  onClick={toast.action.onClick}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  {toast.action.label}
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="inline-flex rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper hook for common optimistic operations
export function useOptimisticOperations() {
  const { addToast, updateToast } = useOptimisticToast();

  const executeOptimisticOperation = async <T,>(
    operation: () => Promise<T>,
    options: {
      pendingMessage: string;
      successMessage: string;
      errorMessage?: string;
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    }
  ): Promise<T | null> => {
    const toastId = addToast({
      type: 'pending',
      title: options.pendingMessage,
      duration: 0, // Don't auto-dismiss pending toasts
    });

    try {
      const result = await operation();
      
      updateToast(toastId, {
        type: 'success',
        title: options.successMessage,
        duration: 3000,
      });

      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = options.errorMessage || 
        (error instanceof Error ? error.message : 'Operation failed');
      
      updateToast(toastId, {
        type: 'error',
        title: errorMessage,
        duration: 5000,
      });

      options.onError?.(error as Error);
      return null;
    }
  };

  const showSuccess = (title: string, description?: string) => {
    addToast({
      type: 'success',
      title,
      description,
    });
  };

  const showError = (title: string, description?: string) => {
    addToast({
      type: 'error',
      title,
      description,
    });
  };

  const showInfo = (title: string, description?: string) => {
    addToast({
      type: 'info',
      title,
      description,
    });
  };

  return {
    executeOptimisticOperation,
    showSuccess,
    showError,
    showInfo,
  };
}