"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showDivider?: boolean;
}

export function FormSection({ 
  title, 
  description, 
  children, 
  className,
  showDivider = true 
}: FormSectionProps) {
  return (
    <div className={cn("space-y-6 bg-white dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <div className={cn(
        "pb-3",
        showDivider && "border-b border-gray-200 dark:border-gray-700"
      )}>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          {title}
        </h3>
        {description && (
          <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}