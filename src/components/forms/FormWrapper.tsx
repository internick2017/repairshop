"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface FormWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export function FormWrapper({ 
  title, 
  subtitle, 
  children, 
  className,
  headerActions 
}: FormWrapperProps) {
  return (
    <div className={cn(
      "max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              {title}
            </h2>
            {subtitle && (
              <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="ml-6">
              {headerActions}
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 bg-gradient-to-b from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-900/50">
        {children}
      </div>
    </div>
  );
}