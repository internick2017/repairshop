"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, Check, X, RotateCcw } from 'lucide-react';

interface OptimisticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onOptimisticClick: () => Promise<void>;
  children: React.ReactNode;
  successText?: string;
  errorText?: string;
  showSuccess?: boolean;
  showError?: boolean;
  resetDelay?: number;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export function OptimisticButton({
  onOptimisticClick,
  children,
  successText,
  errorText,
  showSuccess = true,
  showError = true,
  resetDelay = 2000,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  ...props
}: OptimisticButtonProps) {
  const [state, setState] = useState<ButtonState>('idle');

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (state !== 'idle' || disabled) return;

    setState('loading');

    try {
      await onOptimisticClick();
      
      if (showSuccess) {
        setState('success');
        setTimeout(() => setState('idle'), resetDelay);
      } else {
        setState('idle');
      }
    } catch (error) {
      if (showError) {
        setState('error');
        setTimeout(() => setState('idle'), resetDelay);
      } else {
        setState('idle');
      }
    }
  };

  const getButtonContent = () => {
    switch (state) {
      case 'loading':
        return (
          <span className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </span>
        );
      case 'success':
        return (
          <span className="flex items-center space-x-2">
            <Check className="h-4 w-4" />
            <span>{successText || 'Success!'}</span>
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center space-x-2">
            <X className="h-4 w-4" />
            <span>{errorText || 'Error'}</span>
          </span>
        );
      default:
        return children;
    }
  };

  const getButtonVariant = () => {
    switch (state) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      default:
        return variant;
    }
  };

  return (
    <Button
      {...props}
      variant={getButtonVariant()}
      size={size}
      disabled={disabled || state === 'loading'}
      onClick={handleClick}
      className={cn(
        "transition-all duration-200",
        state === 'success' && "bg-green-600 hover:bg-green-700 border-green-600",
        state === 'error' && "bg-red-600 hover:bg-red-700 border-red-600",
        className
      )}
    >
      {getButtonContent()}
    </Button>
  );
}

interface OptimisticToggleButtonProps extends Omit<OptimisticButtonProps, 'onOptimisticClick' | 'children'> {
  isToggled: boolean;
  onToggle: (newState: boolean) => Promise<void>;
  toggledText: string;
  untoggledText: string;
  toggledIcon?: React.ReactNode;
  untoggledIcon?: React.ReactNode;
}

export function OptimisticToggleButton({
  isToggled,
  onToggle,
  toggledText,
  untoggledText,
  toggledIcon,
  untoggledIcon,
  ...props
}: OptimisticToggleButtonProps) {
  const [optimisticState, setOptimisticState] = useState(isToggled);

  const handleToggle = async () => {
    const newState = !optimisticState;
    setOptimisticState(newState); // Optimistic update
    
    try {
      await onToggle(newState);
    } catch (error) {
      setOptimisticState(isToggled); // Revert on error
      throw error;
    }
  };

  return (
    <OptimisticButton
      {...props}
      onOptimisticClick={handleToggle}
      variant={optimisticState ? 'default' : 'outline'}
      className={cn(
        optimisticState && "bg-blue-600 hover:bg-blue-700 text-white",
        props.className
      )}
    >
      <span className="flex items-center space-x-2">
        {optimisticState ? toggledIcon : untoggledIcon}
        <span>{optimisticState ? toggledText : untoggledText}</span>
      </span>
    </OptimisticButton>
  );
}

interface OptimisticActionButtonProps extends OptimisticButtonProps {
  actionType: 'create' | 'update' | 'delete' | 'custom';
  entityName?: string;
}

export function OptimisticActionButton({
  actionType,
  entityName = 'item',
  children,
  successText,
  errorText,
  ...props
}: OptimisticActionButtonProps) {
  const getDefaultTexts = () => {
    switch (actionType) {
      case 'create':
        return {
          success: `${entityName} created successfully!`,
          error: `Failed to create ${entityName}`,
        };
      case 'update':
        return {
          success: `${entityName} updated successfully!`,
          error: `Failed to update ${entityName}`,
        };
      case 'delete':
        return {
          success: `${entityName} deleted successfully!`,
          error: `Failed to delete ${entityName}`,
        };
      default:
        return {
          success: 'Action completed successfully!',
          error: 'Action failed',
        };
    }
  };

  const { success, error } = getDefaultTexts();

  return (
    <OptimisticButton
      {...props}
      successText={successText || success}
      errorText={errorText || error}
      variant={actionType === 'delete' ? 'destructive' : props.variant}
    >
      {children}
    </OptimisticButton>
  );
}