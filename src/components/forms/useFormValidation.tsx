"use client";

import { useCallback, useMemo } from 'react';
import { UseFormReturn, FieldValues, FieldPath } from 'react-hook-form';
import { useFormState } from './FormStateProvider';
import { addBreadcrumb } from '@/lib/sentry-utils';

interface ValidationRule<T> {
  field: FieldPath<T>;
  validator: (value: unknown, formData: T) => string | null;
  dependencies?: FieldPath<T>[];
  debounceMs?: number;
}

interface CrossFieldValidation<T> {
  name: string;
  validator: (formData: T) => Record<string, string>;
  dependencies: FieldPath<T>[];
}

interface ValidationOptions<T extends FieldValues> {
  customRules?: ValidationRule<T>[];
  crossFieldValidations?: CrossFieldValidation<T>[];
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export function useFormValidation<T extends FieldValues>(
  form: UseFormReturn<T>,
  options: ValidationOptions<T> = {}
) {
  const {
    customRules = [],
    crossFieldValidations = [],
    validateOnChange = true,
    validateOnBlur = true,
    debounceMs = 500,
  } = options;

  const { setFieldError, clearFieldError, setFieldTouched } = useFormState();

  // Validate individual field with custom rules
  const validateField = useCallback(
    (fieldName: FieldPath<T>, value: unknown) => {
      const fieldRules = customRules.filter(rule => rule.field === fieldName);
      const formData = form.getValues();

      for (const rule of fieldRules) {
        const error = rule.validator(value, formData);
        if (error) {
          setFieldError(fieldName, error);
          form.setError(fieldName, { type: 'custom', message: error });
          
          addBreadcrumb({
            message: `Custom validation failed for field: ${fieldName}`,
            category: 'form',
            level: 'warning',
            data: { field: fieldName, error },
          });
          
          return false;
        }
      }

      clearFieldError(fieldName);
      form.clearErrors(fieldName);
      return true;
    },
    [customRules, form, setFieldError, clearFieldError]
  );

  // Validate cross-field dependencies
  const validateCrossFields = useCallback(() => {
    const formData = form.getValues();
    let hasErrors = false;

    for (const validation of crossFieldValidations) {
      const errors = validation.validator(formData);
      
      Object.entries(errors).forEach(([field, error]) => {
        if (error) {
          setFieldError(field, error);
          form.setError(field as FieldPath<T>, { type: 'cross-field', message: error });
          hasErrors = true;
          
          addBreadcrumb({
            message: `Cross-field validation failed: ${validation.name}`,
            category: 'form',
            level: 'warning',
            data: { validation: validation.name, field, error },
          });
        } else {
          clearFieldError(field);
          form.clearErrors(field as FieldPath<T>);
        }
      });
    }

    return !hasErrors;
  }, [crossFieldValidations, form, setFieldError, clearFieldError]);

  // Validate all fields
  const validateAll = useCallback(async () => {
    // First run react-hook-form validation
    const isValid = await form.trigger();
    
    // Then run custom validations
    const formData = form.getValues();
    let customValid = true;

    // Validate each field with custom rules
    Object.keys(formData).forEach(fieldName => {
      const fieldValue = formData[fieldName as FieldPath<T>];
      const fieldValid = validateField(fieldName as FieldPath<T>, fieldValue);
      if (!fieldValid) customValid = false;
    });

    // Validate cross-field rules
    const crossFieldValid = validateCrossFields();

    const allValid = isValid && customValid && crossFieldValid;
    
    addBreadcrumb({
      message: `Form validation completed`,
      category: 'form',
      level: allValid ? 'info' : 'warning',
      data: { 
        isValid: allValid, 
        rhfValid: isValid, 
        customValid, 
        crossFieldValid 
      },
    });

    return allValid;
  }, [form, validateField, validateCrossFields]);

  // Get validation status for a specific field
  const getFieldValidationStatus = useCallback(
    (fieldName: FieldPath<T>) => {
      const error = form.formState.errors[fieldName];
      const isDirty = form.formState.dirtyFields[fieldName];
      const isTouched = form.formState.touchedFields[fieldName];

      return {
        hasError: !!error,
        error: error?.message,
        isDirty: !!isDirty,
        isTouched: !!isTouched,
        isValid: !error && (isDirty || isTouched),
      };
    },
    [form.formState]
  );

  // Enhanced field touch handler
  const handleFieldTouch = useCallback(
    (fieldName: FieldPath<T>) => {
      setFieldTouched(fieldName, true);
      
      if (validateOnBlur) {
        const value = form.getValues(fieldName);
        validateField(fieldName, value);
      }
    },
    [setFieldTouched, validateOnBlur, form, validateField]
  );

  // Enhanced field change handler
  const handleFieldChange = useCallback(
    (fieldName: FieldPath<T>, value: unknown) => {
      if (validateOnChange) {
        // Debounce validation for performance
        const timer = setTimeout(() => {
          validateField(fieldName, value);
          
          // Check if this field affects cross-field validations
          const affectedValidations = crossFieldValidations.filter(validation =>
            validation.dependencies.includes(fieldName)
          );
          
          if (affectedValidations.length > 0) {
            validateCrossFields();
          }
        }, debounceMs);

        return () => clearTimeout(timer);
      }
    },
    [validateOnChange, validateField, crossFieldValidations, validateCrossFields, debounceMs]
  );

  // Get overall form validation summary
  const validationSummary = useMemo(() => {
    const errors = form.formState.errors;
    const errorCount = Object.keys(errors).length;
    const fieldCount = Object.keys(form.formState.dirtyFields).length;
    const touchedCount = Object.keys(form.formState.touchedFields).length;

    return {
      isValid: errorCount === 0 && form.formState.isValid,
      errorCount,
      fieldCount,
      touchedCount,
      hasErrors: errorCount > 0,
      progress: fieldCount > 0 ? ((fieldCount - errorCount) / fieldCount) * 100 : 0,
    };
  }, [form.formState]);

  return {
    validateField,
    validateCrossFields,
    validateAll,
    getFieldValidationStatus,
    handleFieldTouch,
    handleFieldChange,
    validationSummary,
    isValidating: form.formState.isValidating,
  };
}