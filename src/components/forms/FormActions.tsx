"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  submitText: string;
  submitLoadingText: string;
  isSubmitting: boolean;
  onReset?: () => void;
  resetText?: string;
  disabled?: boolean;
  className?: string;
  submitVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  submitClassName?: string;
  resetClassName?: string;
  showReset?: boolean;
}

export function FormActions({
  submitText,
  submitLoadingText,
  isSubmitting,
  onReset,
  resetText = "Reset Form",
  disabled = false,
  className,
  submitVariant = "default",
  submitClassName,
  resetClassName,
  showReset = true
}: FormActionsProps) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800",
      className
    )}>
      <Button 
        type="submit" 
        disabled={isSubmitting || disabled}
        variant={submitVariant}
        className={cn(
          "flex-1 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          submitVariant === "default" && "bg-blue-600 hover:bg-blue-700 text-white",
          submitClassName
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{submitLoadingText}</span>
          </span>
        ) : (
          submitText
        )}
      </Button>
      
      {showReset && onReset && (
        <Button 
          type="button" 
          variant="outline" 
          disabled={isSubmitting || disabled}
          onClick={onReset}
          className={cn(
            "flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
            resetClassName
          )}
        >
          {resetText}
        </Button>
      )}
    </div>
  );
}