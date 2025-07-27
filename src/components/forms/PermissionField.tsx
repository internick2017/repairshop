"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { CheckboxWithLabel } from '@/components/inputs';
import { FieldValues, FieldPath } from 'react-hook-form';

interface PermissionFieldProps<TFieldValues extends FieldValues> {
  fieldTitle: string;
  nameInSchema: FieldPath<TFieldValues>;
  description?: string;
  isLoading: boolean;
  hasPermission: boolean;
  currentValue?: boolean;
  className?: string;
  loadingText?: string;
  permissionBadgeText?: string;
  noPermissionBadgeText?: string;
}

export function PermissionField<TFieldValues extends FieldValues>({
  fieldTitle,
  nameInSchema,
  description,
  isLoading,
  hasPermission,
  currentValue = false,
  className,
  loadingText = "Checking permissions...",
  permissionBadgeText = "Manager Permission",
  noPermissionBadgeText = "Manager Only"
}: PermissionFieldProps<TFieldValues>) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-gray-400 animate-pulse"></div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {fieldTitle}
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {loadingText}
              </p>
            </div>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 animate-pulse">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (hasPermission) {
    return (
      <div className={cn("space-y-3", className)}>
        <CheckboxWithLabel<TFieldValues>
          fieldTitle={fieldTitle}
          nameInSchema={nameInSchema}
          required={false}
          description={description}
          className="space-y-3"
        />
        <div className="flex justify-end">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200">
            {permissionBadgeText}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <div className={`w-2 h-2 rounded-sm ${currentValue ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {fieldTitle}
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentValue ? 'Active' : 'Inactive'} - Only managers can change this status
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
            {noPermissionBadgeText}
          </span>
        </div>
      </div>
    </div>
  );
}