"use client";

import { useEffect, useCallback, useRef } from 'react';
import { UseFormReturn, FieldValues } from 'react-hook-form';
import { useFormState } from './FormStateProvider';
import { addBreadcrumb, captureException } from '@/lib/sentry-utils';

interface FormPersistenceOptions {
  key: string;
  enabled?: boolean;
  debounceMs?: number;
  excludeFields?: string[];
  onRestore?: (data: unknown) => void;
  onSave?: (data: unknown) => void;
}

export function useFormPersistence<T extends FieldValues>(
  form: UseFormReturn<T>,
  options: FormPersistenceOptions
) {
  const { key, enabled = true, debounceMs = 1000, excludeFields = [], onRestore, onSave } = options;
  const { setUnsavedChanges } = useFormState();
  const debounceRef = useRef<NodeJS.Timeout>();
  const storageKey = `form_${key}`;

  // Save form data to localStorage
  const saveToStorage = useCallback((data: T) => {
    if (!enabled) return;

    try {
      // Filter out excluded fields
      const filteredData = Object.keys(data).reduce((acc, fieldKey) => {
        if (!excludeFields.includes(fieldKey)) {
          acc[fieldKey] = data[fieldKey];
        }
        return acc;
      }, {} as Partial<T>);

      const serializedData = JSON.stringify({
        data: filteredData,
        timestamp: Date.now(),
        version: '1.0'
      });

      localStorage.setItem(storageKey, serializedData);
      onSave?.(filteredData);

      addBreadcrumb({
        message: `Form data saved to localStorage`,
        category: 'form',
        level: 'info',
        data: { key, fieldCount: Object.keys(filteredData).length },
      });
    } catch (error) {
      captureException(error, {
        tags: {
          component: 'FormPersistence',
          action: 'save',
          formKey: key,
        },
        extra: {
          storageKey,
          dataKeys: Object.keys(data),
        },
        level: 'warning',
      });
    }
  }, [enabled, excludeFields, storageKey, onSave, key]);

  // Load form data from localStorage
  const loadFromStorage = useCallback(() => {
    if (!enabled) return null;

    try {
      const stored = localStorage.getItem(storageKey);
      if (!stored) return null;

      const parsed = JSON.parse(stored);
      
      // Check if stored data is recent (within 24 hours)
      const isRecent = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
      if (!isRecent) {
        localStorage.removeItem(storageKey);
        return null;
      }

      onRestore?.(parsed.data);
      
      addBreadcrumb({
        message: `Form data restored from localStorage`,
        category: 'form',
        level: 'info',
        data: { key, fieldCount: Object.keys(parsed.data).length },
      });

      return parsed.data;
    } catch (error) {
      // Clean up corrupted data
      localStorage.removeItem(storageKey);
      
      captureException(error, {
        tags: {
          component: 'FormPersistence',
          action: 'load',
          formKey: key,
        },
        extra: {
          storageKey,
        },
        level: 'warning',
      });
      
      return null;
    }
  }, [enabled, storageKey, onRestore, key]);

  // Clear stored data
  const clearStorage = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
      
      addBreadcrumb({
        message: `Form data cleared from localStorage`,
        category: 'form',
        level: 'info',
        data: { key },
      });
    } catch (error) {
      captureException(error, {
        tags: {
          component: 'FormPersistence',
          action: 'clear',
          formKey: key,
        },
        level: 'warning',
      });
    }
  }, [storageKey, key]);

  // Watch form changes and save with debouncing
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((data) => {
      // Clear existing debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      // Set unsaved changes flag
      setUnsavedChanges(form.formState.isDirty);

      // Debounced save
      debounceRef.current = setTimeout(() => {
        if (form.formState.isDirty) {
          saveToStorage(data as T);
        }
      }, debounceMs);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [form, enabled, debounceMs, saveToStorage, setUnsavedChanges]);

  // Load data on mount
  useEffect(() => {
    if (!enabled) return;

    const storedData = loadFromStorage();
    if (storedData) {
      // Only restore if form is clean (not already filled)
      if (!form.formState.isDirty) {
        form.reset(storedData);
      }
    }
  }, [enabled, form, loadFromStorage]);

  // Clear storage on successful submit
  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      clearStorage();
      setUnsavedChanges(false);
    }
  }, [form.formState.isSubmitSuccessful, clearStorage, setUnsavedChanges]);

  return {
    saveToStorage: () => saveToStorage(form.getValues()),
    loadFromStorage,
    clearStorage,
    hasStoredData: () => !!localStorage.getItem(storageKey),
  };
}