# Advanced Form State Management

This document describes the comprehensive state management system for complex forms in the repair shop application.

## Overview

The state management system provides:
- **Global Form State**: Centralized state management with React Context
- **Form Persistence**: Auto-save to localStorage with data recovery
- **Optimistic Updates**: Instant UI feedback with rollback on errors
- **Enhanced Validation**: Custom validation rules and cross-field validation
- **Real-time Indicators**: Visual feedback for form status and progress

## Components

### 1. FormStateProvider

Central state management for form lifecycle and user interactions.

```tsx
<FormStateProvider formId="customer-123" enableAutoSave={false}>
  <MyForm />
</FormStateProvider>
```

**Features:**
- Tracks dirty state, submission status, and field interactions
- Manages unsaved changes warnings
- Integrates with Sentry for form interaction tracking
- Provides browser beforeunload protection

**State Properties:**
- `isDirty: boolean` - Form has been modified
- `isSubmitting: boolean` - Form is currently being submitted
- `lastSaved?: Date` - Timestamp of last successful save
- `autoSaveEnabled: boolean` - Auto-save functionality status
- `hasUnsavedChanges: boolean` - Form has unsaved modifications
- `submitAttempts: number` - Number of submission attempts
- `errors: Record<string, string>` - Field-specific error messages
- `fieldTouched: Record<string, boolean>` - Field interaction tracking

### 2. useFormPersistence

Automatic form data persistence with localStorage integration.

```tsx
const formPersistence = useFormPersistence(form, {
  key: 'customer-form-123',
  enabled: true,
  excludeFields: ['password', 'active'],
  debounceMs: 1000,
  onRestore: (data) => toast.info("Draft restored"),
  onSave: (data) => console.log("Saved to localStorage")
});
```

**Features:**
- Debounced auto-save to localStorage
- Data restoration on form mount
- Automatic cleanup after successful submission
- Configurable field exclusion for sensitive data
- Data versioning and expiration (24 hours)

**Methods:**
- `saveToStorage()` - Manually save current form data
- `loadFromStorage()` - Load saved data
- `clearStorage()` - Clear saved data
- `hasStoredData()` - Check if saved data exists

### 3. useOptimisticUpdates

Optimistic UI updates with automatic rollback on failure.

```tsx
const optimisticUpdates = useOptimisticUpdates<CustomerType>();

// Apply optimistic update
optimisticUpdates.applyOptimisticUpdate(
  'update-customer',
  optimisticCustomerData,
  () => updateCustomerAPI(data),
  {
    successMessage: "Customer updated!",
    errorMessage: "Update failed - changes reverted",
    revertDelay: 5000
  }
);
```

**Features:**
- Instant UI updates for better user experience
- Automatic rollback on API failures
- Timeout-based rollback for slow operations
- Multiple concurrent optimistic updates
- Toast notifications for success/failure

**State Properties:**
- `data: T | null` - Current data (optimistic or confirmed)
- `isOptimistic: boolean` - Data includes unconfirmed changes
- `hasPendingActions: boolean` - Has pending optimistic updates
- `pendingActions: string[]` - List of pending action IDs

### 4. useFormValidation

Enhanced validation with custom rules and cross-field validation.

```tsx
const validation = useFormValidation(form, {
  customRules: [
    {
      field: 'email',
      validator: (value) => value.includes('+') ? 'Plus signs may cause issues' : null,
    }
  ],
  crossFieldValidations: [
    {
      name: 'address-consistency',
      validator: (data) => {
        const errors = {};
        if (data.address1 && !data.city) errors.city = 'City required with address';
        return errors;
      },
      dependencies: ['address1', 'city']
    }
  ]
});
```

**Features:**
- Custom validation rules with dependencies
- Cross-field validation logic
- Real-time validation feedback
- Validation progress tracking
- Integration with react-hook-form

**Methods:**
- `validateField(field, value)` - Validate single field
- `validateCrossFields()` - Run cross-field validations
- `validateAll()` - Comprehensive form validation
- `getFieldValidationStatus(field)` - Get field validation state

### 5. FormIndicator

Visual indicator for form status and progress.

```tsx
<FormIndicator 
  showLastSaved={true}
  showSubmitAttempts={true}
  className="text-sm"
/>
```

**Features:**
- Real-time form status display
- Last saved timestamp with relative time
- Submit attempt counter for debugging
- Color-coded status indicators
- Responsive design

**Status Types:**
- **Saving** - Form is being submitted (blue, spinning icon)
- **Unsaved** - Form has unsaved changes (yellow, warning icon)
- **Saved** - Form successfully saved (green, check icon)
- **Auto-save** - Auto-save enabled (gray, save icon)
- **Ready** - Form ready for input (gray, clock icon)

## Usage Patterns

### Basic Implementation

```tsx
export function MyForm() {
  return (
    <FormStateProvider formId="my-form" enableAutoSave={false}>
      <FormContent />
    </FormStateProvider>
  );
}

function FormContent() {
  const form = useForm();
  const { setSubmitting, setLastSaved } = useFormState();
  
  const formPersistence = useFormPersistence(form, {
    key: 'my-form',
    enabled: true,
  });

  const validation = useFormValidation(form, {
    customRules: [/* custom rules */],
  });

  return (
    <FormWrapper 
      title="My Form"
      headerActions={<FormIndicator />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* form fields */}
        </form>
      </Form>
    </FormWrapper>
  );
}
```

### Advanced Implementation with Optimistic Updates

```tsx
function AdvancedForm({ data }: { data?: MyDataType }) {
  const optimisticUpdates = useOptimisticUpdates<MyDataType>();
  
  const handleSubmit = async (formData) => {
    if (data) {
      // Apply optimistic update
      const optimisticData = { ...data, ...formData };
      
      optimisticUpdates.applyOptimisticUpdate(
        'update-data',
        optimisticData,
        () => updateAPI(formData),
        {
          successMessage: "Updated successfully!",
          errorMessage: "Update failed - changes reverted"
        }
      );
    } else {
      // Create new data
      await createAPI(formData);
    }
  };

  return (
    <div>
      {/* Optimistic update indicator */}
      {optimisticUpdates.isOptimistic && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
          <span>Updates are being processed...</span>
        </div>
      )}
      
      {/* Form content */}
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        {/* fields */}
      </form>
    </div>
  );
}
```

### Form Persistence Configuration

```tsx
const formPersistence = useFormPersistence(form, {
  key: `form-${entityId}-${userId}`, // Unique key per user/entity
  enabled: isDraft, // Only enable for draft forms
  excludeFields: ['password', 'confirmPassword', 'active'], // Sensitive fields
  debounceMs: 2000, // 2 second debounce
  onRestore: (data) => {
    toast.info("Draft restored from previous session", {
      action: {
        label: "Dismiss",
        onClick: () => formPersistence.clearStorage()
      }
    });
  },
  onSave: (data) => {
    // Optional: Show subtle save indicator
    console.log(`Auto-saved ${Object.keys(data).length} fields`);
  }
});
```

## Integration with Existing Forms

To upgrade existing forms to use the new state management:

1. **Wrap with FormStateProvider**:
   ```tsx
   <FormStateProvider formId="unique-id">
     <ExistingForm />
   </FormStateProvider>
   ```

2. **Add state hooks inside form component**:
   ```tsx
   const { setSubmitting, setLastSaved } = useFormState();
   const formPersistence = useFormPersistence(form, { key: 'form-key' });
   ```

3. **Update submission handlers**:
   ```tsx
   const handleSubmit = async (data) => {
     setSubmitting(true);
     try {
       await submitAPI(data);
       setLastSaved(new Date());
       formPersistence.clearStorage();
     } finally {
       setSubmitting(false);
     }
   };
   ```

4. **Add visual indicators**:
   ```tsx
   <FormWrapper 
     title="Form Title"
     headerActions={<FormIndicator />}
   >
   ```

## Performance Considerations

- **Debouncing**: Form persistence uses configurable debouncing (default: 1s)
- **Memory Management**: Automatic cleanup of timeouts and subscriptions
- **Storage Limits**: localStorage has ~5MB limit; large forms may need custom storage
- **Validation Performance**: Custom validation is debounced (default: 500ms)
- **Optimistic Updates**: Limited concurrent updates to prevent memory leaks

## Security Considerations

- **Sensitive Data**: Use `excludeFields` to prevent persisting passwords/tokens
- **Data Expiration**: Stored data expires after 24 hours
- **Error Handling**: All localStorage operations are wrapped in try-catch
- **XSS Prevention**: All stored data is JSON-serialized, preventing code injection
- **User Isolation**: Include user ID in storage keys for multi-user environments

## Error Handling

All state management components include comprehensive error handling:

- **Sentry Integration**: Errors are automatically logged to Sentry
- **Graceful Degradation**: Forms continue working if localStorage fails
- **Recovery Mechanisms**: Corrupted data is automatically cleaned up
- **User Feedback**: Clear error messages via toast notifications

This state management system provides a robust foundation for complex forms while maintaining excellent user experience and data integrity.