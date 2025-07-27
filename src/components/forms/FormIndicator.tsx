"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useFormState } from './FormStateProvider';
import { Loader2, AlertTriangle, CheckCircle, Clock, Save } from 'lucide-react';

interface FormIndicatorProps {
  className?: string;
  showLastSaved?: boolean;
  showSubmitAttempts?: boolean;
}

export function FormIndicator({ 
  className, 
  showLastSaved = true, 
  showSubmitAttempts = false 
}: FormIndicatorProps) {
  const { state } = useFormState();

  const getStatusIcon = () => {
    if (state.isSubmitting) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    
    if (state.hasUnsavedChanges) {
      return <AlertTriangle className="h-4 w-4" />;
    }
    
    if (state.lastSaved) {
      return <CheckCircle className="h-4 w-4" />;
    }
    
    if (state.autoSaveEnabled) {
      return <Save className="h-4 w-4" />;
    }
    
    return <Clock className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (state.isSubmitting) {
      return 'Saving...';
    }
    
    if (state.hasUnsavedChanges) {
      return 'Unsaved changes';
    }
    
    if (state.lastSaved && showLastSaved) {
      const timeAgo = formatTimeAgo(state.lastSaved);
      return `Saved ${timeAgo}`;
    }
    
    if (state.autoSaveEnabled) {
      return 'Auto-save enabled';
    }
    
    return 'Ready';
  };

  const getStatusColor = () => {
    if (state.isSubmitting) {
      return 'text-blue-600 dark:text-blue-400';
    }
    
    if (state.hasUnsavedChanges) {
      return 'text-yellow-600 dark:text-yellow-400';
    }
    
    if (state.lastSaved) {
      return 'text-green-600 dark:text-green-400';
    }
    
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className={cn(
      "flex items-center gap-2 text-sm",
      getStatusColor(),
      className
    )}>
      {getStatusIcon()}
      <span>{getStatusText()}</span>
      
      {showSubmitAttempts && state.submitAttempts > 1 && (
        <span className="text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
          Attempt {state.submitAttempts}
        </span>
      )}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}