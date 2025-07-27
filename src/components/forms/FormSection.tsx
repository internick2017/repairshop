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
    <div className={cn("space-y-6", className)}>
      <div className={cn(
        "pb-2",
        showDivider && "border-b border-gray-200 dark:border-gray-700"
      )}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}