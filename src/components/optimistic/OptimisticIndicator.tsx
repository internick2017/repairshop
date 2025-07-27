"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Check, X, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface OptimisticIndicatorProps {
  status: 'idle' | 'pending' | 'success' | 'error' | 'offline';
  message?: string;
  showIcon?: boolean;
  showMessage?: boolean;
  variant?: 'badge' | 'banner' | 'toast' | 'inline' | 'floating';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
  duration?: number;
  onDismiss?: () => void;
  className?: string;
}

export function OptimisticIndicator({
  status,
  message,
  showIcon = true,
  showMessage = true,
  variant = 'badge',
  position = 'top-right',
  duration,
  onDismiss,
  className
}: OptimisticIndicatorProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration && (status === 'success' || status === 'error')) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [status, duration, onDismiss]);

  if (!isVisible || status === 'idle') return null;

  const getIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <Check className="h-4 w-4" />;
      case 'error':
        return <X className="h-4 w-4" />;
      case 'offline':
        return <WifiOff className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusClasses = () => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800';
      case 'success':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      case 'offline':
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'banner':
        return 'w-full p-4 border-l-4';
      case 'toast':
        return 'p-3 rounded-lg shadow-lg border max-w-sm';
      case 'inline':
        return 'inline-flex items-center px-2 py-1 rounded text-sm';
      case 'floating':
        return 'fixed z-50 p-3 rounded-lg shadow-lg border';
      default: // badge
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    }
  };

  const getPositionClasses = () => {
    if (variant !== 'floating') return '';
    
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

  const getDefaultMessage = () => {
    switch (status) {
      case 'pending':
        return 'Saving changes...';
      case 'success':
        return 'Changes saved!';
      case 'error':
        return 'Failed to save changes';
      case 'offline':
        return 'You are offline';
      default:
        return '';
    }
  };

  const displayMessage = message || getDefaultMessage();

  return (
    <div
      className={cn(
        getVariantClasses(),
        getPositionClasses(),
        getStatusClasses(),
        'transition-all duration-200',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center space-x-2">
        {showIcon && getIcon()}
        {showMessage && displayMessage && (
          <span className={cn(
            variant === 'badge' ? 'text-xs' : 'text-sm',
            'font-medium'
          )}>
            {displayMessage}
          </span>
        )}
        {onDismiss && (status === 'success' || status === 'error') && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className="ml-2 text-current opacity-70 hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

interface OptimisticStatusBarProps {
  pendingCount: number;
  successCount?: number;
  errorCount?: number;
  isOffline?: boolean;
  className?: string;
}

export function OptimisticStatusBar({
  pendingCount,
  successCount = 0,
  errorCount = 0,
  isOffline = false,
  className
}: OptimisticStatusBarProps) {
  if (pendingCount === 0 && successCount === 0 && errorCount === 0 && !isOffline) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 min-w-64",
      className
    )}>
      <div className="space-y-2">
        {isOffline && (
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm">You are offline</span>
          </div>
        )}
        
        {pendingCount > 0 && (
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">
              {pendingCount} change{pendingCount !== 1 ? 's' : ''} pending
            </span>
          </div>
        )}
        
        {successCount > 0 && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <Check className="h-4 w-4" />
            <span className="text-sm">
              {successCount} change{successCount !== 1 ? 's' : ''} saved
            </span>
          </div>
        )}
        
        {errorCount > 0 && (
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">
              {errorCount} change{errorCount !== 1 ? 's' : ''} failed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

interface OptimisticPulseProps {
  isActive: boolean;
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  color?: 'blue' | 'green' | 'red' | 'yellow';
  className?: string;
}

export function OptimisticPulse({
  isActive,
  children,
  intensity = 'medium',
  color = 'blue',
  className
}: OptimisticPulseProps) {
  const intensityClasses = {
    low: 'ring-2 ring-opacity-30',
    medium: 'ring-4 ring-opacity-50',
    high: 'ring-8 ring-opacity-70',
  };

  const colorClasses = {
    blue: 'ring-blue-500',
    green: 'ring-green-500',
    red: 'ring-red-500',
    yellow: 'ring-yellow-500',
  };

  return (
    <div
      className={cn(
        'relative transition-all duration-200',
        isActive && 'animate-pulse',
        isActive && intensityClasses[intensity],
        isActive && colorClasses[color],
        isActive && 'rounded-md',
        className
      )}
    >
      {children}
      {isActive && (
        <div className={cn(
          'absolute inset-0 rounded-md',
          intensityClasses[intensity],
          colorClasses[color],
          'animate-ping'
        )} />
      )}
    </div>
  );
}