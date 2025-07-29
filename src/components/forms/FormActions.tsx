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
      "flex flex-col sm:flex-row gap-6 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg p-6 -mx-6 -mb-6",
      className
    )}>
      <Button 
        type="submit" 
        disabled={isSubmitting || disabled}
        variant={submitVariant}
        className={cn(
          "flex-1 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg",
          submitVariant === "default" && "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
          submitClassName
        )}
      >
        {isSubmitting ? (
          <span className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-lg">{submitLoadingText}</span>
          </span>
        ) : (
          <span className="text-lg">{submitText}</span>
        )}
      </Button>
      
      {showReset && onReset && (
        <Button 
          type="button" 
          variant="outline" 
          disabled={isSubmitting || disabled}
          onClick={onReset}
          className={cn(
            "flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold py-4 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
            resetClassName
          )}
        >
          <span className="text-lg">{resetText}</span>
        </Button>
      )}
    </div>
  );
}