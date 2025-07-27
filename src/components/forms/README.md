# Reusable Form Components

This directory contains a collection of reusable form components designed to reduce code duplication and provide consistent form patterns across the application.

## Components Overview

### `FormWrapper`
A container component that provides consistent styling and layout for forms.

```tsx
<FormWrapper
  title="Edit Customer"
  subtitle="Update customer information"
  headerActions={<SomeButton />}
>
  {/* Form content */}
</FormWrapper>
```

**Props:**
- `title: string` - Main form title
- `subtitle?: string` - Optional subtitle description
- `headerActions?: React.ReactNode` - Optional actions in the header
- `className?: string` - Additional CSS classes

### `FormSection`
Organizes form content into logical sections with consistent headers and dividers.

```tsx
<FormSection
  title="Personal Information"
  description="Basic customer details"
  showDivider={true}
>
  {/* Form fields */}
</FormSection>
```

**Props:**
- `title: string` - Section title
- `description?: string` - Optional section description
- `showDivider?: boolean` - Whether to show bottom border (default: true)
- `className?: string` - Additional CSS classes

### `FormGrid`
Responsive grid layout for form fields with predefined column configurations.

```tsx
<FormGrid columns={2}>
  <InputWithLabel />
  <InputWithLabel />
</FormGrid>
```

**Props:**
- `columns?: 1 | 2 | 3` - Number of columns (default: 2)
- `className?: string` - Additional CSS classes

### `FormActions`
Standardized form action buttons with loading states and consistent styling.

```tsx
<FormActions
  submitText="Update Customer"
  submitLoadingText="Updating..."
  isSubmitting={isLoading}
  onReset={() => form.reset()}
  resetText="Reset Form"
/>
```

**Props:**
- `submitText: string` - Submit button text
- `submitLoadingText: string` - Text shown during submission
- `isSubmitting: boolean` - Loading state
- `onReset?: () => void` - Reset handler (optional)
- `resetText?: string` - Reset button text (default: "Reset Form")
- `showReset?: boolean` - Whether to show reset button (default: true)
- `submitVariant?: ButtonVariant` - Submit button variant
- `disabled?: boolean` - Disable all buttons

### `PermissionField`
Handles permission-based field rendering with loading states and appropriate UI for different user roles.

```tsx
<PermissionField<CustomerSchema>
  fieldTitle="Active Customer"
  nameInSchema="active"
  description="Mark this customer as active"
  isLoading={isCheckingPermissions}
  hasPermission={isManager}
  currentValue={customer?.active}
/>
```

**Props:**
- `fieldTitle: string` - Field label
- `nameInSchema: FieldPath<TFieldValues>` - Form field name
- `description?: string` - Field description
- `isLoading: boolean` - Permission check loading state
- `hasPermission: boolean` - Whether user has permission
- `currentValue?: boolean` - Current field value for read-only display
- `loadingText?: string` - Loading state text
- `permissionBadgeText?: string` - Text for permission badge
- `noPermissionBadgeText?: string` - Text for no permission badge

### `CountryStateFields`
Integrated country and state/region selection with dynamic region loading.

```tsx
<CountryStateFields<CustomerSchema>
  countryFieldName="country"
  stateFieldName="state"
  defaultCountry="US"
  required={true}
/>
```

**Props:**
- `countryFieldName: FieldPath<TFieldValues>` - Country field name
- `stateFieldName: FieldPath<TFieldValues>` - State/region field name
- `countryLabel?: string` - Country field label (default: "Country")
- `stateLabel?: string` - State field label (default: "State/Region")
- `required?: boolean` - Whether fields are required (default: true)
- `defaultCountry?: string` - Default country selection

### `SearchForm<T>`
Generic search form component that can be configured for different data types.

```tsx
<SearchForm<Customer>
  onSearchResults={handleResults}
  searchAction={searchCustomersAction}
  placeholder="Search customers..."
  title="Search Customers"
  emptyMessage="No customers found"
  errorMessage="Search failed"
  icon={<Search />}
/>
```

**Props:**
- `onSearchResults: (results: T[]) => void` - Search results handler
- `searchAction: SearchActionType` - Server action for search
- `placeholder?: string` - Input placeholder
- `title?: string` - Search form title
- `emptyMessage?: string` - Message when no results found
- `errorMessage?: string` - Error message for failed searches
- `icon?: React.ReactNode` - Icon for the search form header

## Usage Patterns

### Basic Form Structure

```tsx
export function MyForm() {
  return (
    <FormWrapper title="Form Title" subtitle="Form description">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormSection title="Section 1" description="Section description">
            <FormGrid columns={2}>
              <InputWithLabel fieldTitle="Field 1" nameInSchema="field1" required />
              <InputWithLabel fieldTitle="Field 2" nameInSchema="field2" required />
            </FormGrid>
          </FormSection>
          
          <FormSection title="Section 2">
            <CountryStateFields 
              countryFieldName="country" 
              stateFieldName="state" 
            />
          </FormSection>
          
          <FormActions
            submitText="Save"
            submitLoadingText="Saving..."
            isSubmitting={isLoading}
            onReset={() => form.reset()}
          />
        </form>
      </Form>
    </FormWrapper>
  );
}
```

### Search Form Implementation

```tsx
// Type-specific search form
export function CustomerSearchForm({ onResults }: { onResults: (results: Customer[]) => void }) {
  return (
    <SearchForm<Customer>
      onSearchResults={onResults}
      searchAction={searchCustomersAction}
      placeholder="Search customers by name, email, or phone..."
      title="Search Customers"
      emptyMessage="No customers found matching your search."
      errorMessage="Failed to search customers"
      icon={<Search className="h-5 w-5" />}
    />
  );
}
```

## Benefits

1. **Consistency**: All forms follow the same visual and interaction patterns
2. **Reduced Duplication**: Common form patterns are abstracted into reusable components
3. **Type Safety**: Full TypeScript support with generic types where appropriate
4. **Accessibility**: Built-in ARIA labels and semantic HTML
5. **Responsive**: Mobile-first responsive design patterns
6. **Loading States**: Consistent loading and error state handling
7. **Permission Handling**: Built-in role-based field rendering

## Migration Guide

To migrate existing forms to use these components:

1. Replace custom form wrappers with `FormWrapper`
2. Group related fields using `FormSection`
3. Use `FormGrid` for consistent field layouts
4. Replace custom form buttons with `FormActions`
5. Use `PermissionField` for role-based fields
6. Replace country/state logic with `CountryStateFields`
7. Migrate search forms to use the generic `SearchForm`

This approach significantly reduces code duplication while maintaining flexibility and type safety.