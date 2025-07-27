"use client";

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { addBreadcrumb } from '@/lib/sentry-utils';

// Form state types
interface FormState {
  isDirty: boolean;
  isSubmitting: boolean;
  lastSaved?: Date;
  autoSaveEnabled: boolean;
  hasUnsavedChanges: boolean;
  submitAttempts: number;
  errors: Record<string, string>;
  fieldTouched: Record<string, boolean>;
}

type FormAction = 
  | { type: 'SET_DIRTY'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: Date }
  | { type: 'SET_AUTO_SAVE'; payload: boolean }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'INCREMENT_SUBMIT_ATTEMPTS' }
  | { type: 'RESET_SUBMIT_ATTEMPTS' }
  | { type: 'SET_FIELD_ERROR'; payload: { field: string; error: string } }
  | { type: 'CLEAR_FIELD_ERROR'; payload: string }
  | { type: 'SET_FIELD_TOUCHED'; payload: { field: string; touched: boolean } }
  | { type: 'RESET_STATE' };

const initialState: FormState = {
  isDirty: false,
  isSubmitting: false,
  autoSaveEnabled: false,
  hasUnsavedChanges: false,
  submitAttempts: 0,
  errors: {},
  fieldTouched: {},
};

function formStateReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_DIRTY':
      return { ...state, isDirty: action.payload, hasUnsavedChanges: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.payload, hasUnsavedChanges: false };
    case 'SET_AUTO_SAVE':
      return { ...state, autoSaveEnabled: action.payload };
    case 'SET_UNSAVED_CHANGES':
      return { ...state, hasUnsavedChanges: action.payload };
    case 'INCREMENT_SUBMIT_ATTEMPTS':
      return { ...state, submitAttempts: state.submitAttempts + 1 };
    case 'RESET_SUBMIT_ATTEMPTS':
      return { ...state, submitAttempts: 0 };
    case 'SET_FIELD_ERROR':
      return { 
        ...state, 
        errors: { ...state.errors, [action.payload.field]: action.payload.error }
      };
    case 'CLEAR_FIELD_ERROR':
      const { [action.payload]: _, ...remainingErrors } = state.errors;
      return { ...state, errors: remainingErrors };
    case 'SET_FIELD_TOUCHED':
      return {
        ...state,
        fieldTouched: { ...state.fieldTouched, [action.payload.field]: action.payload.touched }
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

interface FormStateContextType {
  state: FormState;
  setDirty: (dirty: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setLastSaved: (date: Date) => void;
  setAutoSave: (enabled: boolean) => void;
  setUnsavedChanges: (hasChanges: boolean) => void;
  incrementSubmitAttempts: () => void;
  resetSubmitAttempts: () => void;
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  resetState: () => void;
}

const FormStateContext = createContext<FormStateContextType | undefined>(undefined);

interface FormStateProviderProps {
  children: React.ReactNode;
  formId?: string;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
}

export function FormStateProvider({ 
  children, 
  formId,
  enableAutoSave = false,
  autoSaveInterval = 30000 // 30 seconds
}: FormStateProviderProps) {
  const [state, dispatch] = useReducer(formStateReducer, initialState);

  const setDirty = useCallback((dirty: boolean) => {
    dispatch({ type: 'SET_DIRTY', payload: dirty });
    
    if (dirty && formId) {
      addBreadcrumb({
        message: `Form ${formId} marked as dirty`,
        category: 'form',
        level: 'info',
        data: { formId, action: 'dirty' },
      });
    }
  }, [formId]);

  const setSubmitting = useCallback((submitting: boolean) => {
    dispatch({ type: 'SET_SUBMITTING', payload: submitting });
    
    if (formId) {
      addBreadcrumb({
        message: `Form ${formId} ${submitting ? 'started' : 'finished'} submitting`,
        category: 'form',
        level: 'info',
        data: { formId, action: submitting ? 'submit_start' : 'submit_end' },
      });
    }
  }, [formId]);

  const setLastSaved = useCallback((date: Date) => {
    dispatch({ type: 'SET_LAST_SAVED', payload: date });
  }, []);

  const setAutoSave = useCallback((enabled: boolean) => {
    dispatch({ type: 'SET_AUTO_SAVE', payload: enabled });
  }, []);

  const setUnsavedChanges = useCallback((hasChanges: boolean) => {
    dispatch({ type: 'SET_UNSAVED_CHANGES', payload: hasChanges });
  }, []);

  const incrementSubmitAttempts = useCallback(() => {
    dispatch({ type: 'INCREMENT_SUBMIT_ATTEMPTS' });
  }, []);

  const resetSubmitAttempts = useCallback(() => {
    dispatch({ type: 'RESET_SUBMIT_ATTEMPTS' });
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    dispatch({ type: 'SET_FIELD_ERROR', payload: { field, error } });
  }, []);

  const clearFieldError = useCallback((field: string) => {
    dispatch({ type: 'CLEAR_FIELD_ERROR', payload: field });
  }, []);

  const setFieldTouched = useCallback((field: string, touched: boolean) => {
    dispatch({ type: 'SET_FIELD_TOUCHED', payload: { field, touched } });
  }, []);

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (enableAutoSave && state.autoSaveEnabled && state.hasUnsavedChanges) {
      const interval = setInterval(() => {
        // Auto-save logic would go here
        // This is a placeholder for the actual auto-save implementation
        addBreadcrumb({
          message: `Auto-save triggered for form ${formId}`,
          category: 'form',
          level: 'info',
          data: { formId, action: 'auto_save' },
        });
      }, autoSaveInterval);

      return () => clearInterval(interval);
    }
  }, [enableAutoSave, state.autoSaveEnabled, state.hasUnsavedChanges, formId, autoSaveInterval]);

  // Browser beforeunload warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  const value: FormStateContextType = {
    state,
    setDirty,
    setSubmitting,
    setLastSaved,
    setAutoSave,
    setUnsavedChanges,
    incrementSubmitAttempts,
    resetSubmitAttempts,
    setFieldError,
    clearFieldError,
    setFieldTouched,
    resetState,
  };

  return (
    <FormStateContext.Provider value={value}>
      {children}
    </FormStateContext.Provider>
  );
}

export function useFormState() {
  const context = useContext(FormStateContext);
  if (context === undefined) {
    throw new Error('useFormState must be used within a FormStateProvider');
  }
  return context;
}