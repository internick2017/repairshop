"use client";

import React, { useState, useRef, useTransition } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Save, Check, X, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OptimisticFormProps<T extends Record<string, any>> {
  defaultValues: T;
  onSubmit: (data: T) => Promise<void>;
  onFieldChange?: (field: keyof T, value: any) => Promise<void>;
  children: (form: UseFormReturn<T>, options: {
    isSubmitting: boolean;
    isOptimistic: boolean;
    hasOptimisticChanges: boolean;
  }) => React.ReactNode;
  autoSave?: boolean;
  autoSaveDelay?: number;
  className?: string;
  showOptimisticIndicator?: boolean;
  optimisticFields?: (keyof T)[];
}

export function OptimisticForm<T extends Record<string, any>>({
  defaultValues,
  onSubmit,
  onFieldChange,
  children,
  autoSave = false,
  autoSaveDelay = 1000,
  className,
  showOptimisticIndicator = true,
  optimisticFields = []
}: OptimisticFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optimisticChanges, setOptimisticChanges] = useState<Partial<T>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  const form = useForm<T>({
    defaultValues: { ...defaultValues, ...optimisticChanges }
  });

  const { watch, reset } = form;

  // Watch for changes to trigger optimistic updates
  React.useEffect(() => {
    if (!onFieldChange) return;

    const subscription = watch((value, { name }) => {
      if (!name || !optimisticFields.includes(name as keyof T)) return;

      const fieldValue = value[name];
      if (fieldValue === defaultValues[name as keyof T]) return;

      // Clear any existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Optimistic update
      setOptimisticChanges(prev => ({
        ...prev,
        [name]: fieldValue
      }));

      // Auto-save with debounce
      if (autoSave) {
        autoSaveTimeoutRef.current = setTimeout(() => {
          handleFieldChange(name as keyof T, fieldValue);
        }, autoSaveDelay);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, onFieldChange, defaultValues, optimisticFields, autoSave, autoSaveDelay]);

  const handleFieldChange = async (field: keyof T, value: any) => {
    if (!onFieldChange) return;

    try {
      startTransition(async () => {
        await onFieldChange(field, value);
        // Remove from optimistic changes after successful save
        setOptimisticChanges(prev => {
          const { [field]: _, ...rest } = prev;
          return rest;
        });
        // Clear field error if it exists
        setFieldErrors(prev => {
          const { [field as string]: _, ...rest } = prev;
          return rest;
        });
      });
    } catch (error) {
      // Revert optimistic change
      setOptimisticChanges(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
      
      // Reset form field to original value
      form.setValue(field as any, defaultValues[field]);
      
      // Set field error
      setFieldErrors(prev => ({
        ...prev,
        [field as string]: error instanceof Error ? error.message : 'Save failed'
      }));
    }
  };

  const handleSubmit = async (data: T) => {
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      await onSubmit(data);
      setOptimisticChanges({});
      reset(data); // Update form with new default values
    } catch (error) {
      console.error('Form submission failed:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasOptimisticChanges = Object.keys(optimisticChanges).length > 0;
  const isOptimistic = isPending || hasOptimisticChanges;

  return (
    <form 
      onSubmit={form.handleSubmit(handleSubmit)}
      className={cn("relative", className)}
    >
      {/* Optimistic indicator */}
      {showOptimisticIndicator && isOptimistic && (
        <div className="absolute top-0 right-0 z-10">
          <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-lg text-sm">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </div>
        </div>
      )}

      {/* Field errors indicator */}
      {Object.keys(fieldErrors).length > 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Some changes could not be saved:
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                {Object.entries(fieldErrors).map(([field, error]) => (
                  <li key={field}>{field}: {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {children(form, {
        isSubmitting,
        isOptimistic,
        hasOptimisticChanges
      })}
    </form>
  );
}

interface OptimisticFieldProps {
  label: string;
  error?: string;
  isOptimistic?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function OptimisticField({
  label,
  error,
  isOptimistic = false,
  children,
  className
}: OptimisticFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className={cn(
        "text-sm font-medium text-gray-900 dark:text-gray-100",
        isOptimistic && "text-blue-600 dark:text-blue-400"
      )}>
        {label}
        {isOptimistic && (
          <span className="ml-2 inline-flex items-center">
            <Loader2 className="h-3 w-3 animate-spin" />
          </span>
        )}
      </label>
      
      <div className={cn(
        "relative",
        isOptimistic && "ring-2 ring-blue-500 ring-opacity-20 rounded-md"
      )}>
        {children}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
          <AlertCircle className="h-3 w-3" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

interface OptimisticSubmitButtonProps {
  isSubmitting: boolean;
  hasOptimisticChanges: boolean;
  children: React.ReactNode;
  className?: string;
}

export function OptimisticSubmitButton({
  isSubmitting,
  hasOptimisticChanges,
  children,
  className
}: OptimisticSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "relative transition-all duration-200",
        hasOptimisticChanges && "ring-2 ring-blue-500 ring-opacity-50",
        className
      )}
    >
      {isSubmitting ? (
        <span className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Saving...</span>
        </span>
      ) : (
        <span className="flex items-center space-x-2">
          {hasOptimisticChanges ? <Save className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          <span>{children}</span>
        </span>
      )}
    </Button>
  );
}