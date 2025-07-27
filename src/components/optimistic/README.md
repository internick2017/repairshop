# Optimistic UI Components

A comprehensive set of React components that provide optimistic UI updates for better user experience. These components show immediate feedback to users while operations complete in the background, with automatic rollback on failures.

## Features

- ✅ **Immediate Feedback** - Show changes instantly before server confirmation
- 🔄 **Automatic Rollback** - Revert changes if operations fail
- 🎯 **Loading States** - Visual indicators for pending operations
- 🛡️ **Error Handling** - Graceful error display and recovery
- 📱 **Responsive Design** - Works across all device sizes
- ♿ **Accessibility** - ARIA labels and keyboard navigation
- 🎨 **Themeable** - Dark mode and custom styling support

## Components

### OptimisticButton

Buttons with optimistic state management showing loading, success, and error states.

```tsx
import { OptimisticButton, OptimisticToggleButton, OptimisticActionButton } from '@/components/optimistic';

// Basic optimistic button
<OptimisticButton
  onOptimisticClick={async () => {
    await saveChanges();
  }}
  successText="Saved!"
  errorText="Failed to save"
>
  Save Changes
</OptimisticButton>

// Toggle button with optimistic state
<OptimisticToggleButton
  isToggled={isActive}
  onToggle={async (newState) => {
    await updateStatus(newState);
  }}
  toggledText="Active"
  untoggledText="Inactive"
/>

// Pre-configured action button
<OptimisticActionButton
  actionType="delete"
  entityName="ticket"
  onOptimisticClick={async () => {
    await deleteTicket(id);
  }}
>
  Delete Ticket
</OptimisticActionButton>
```

### OptimisticList

Lists with optimistic add, update, and delete operations.

```tsx
import { OptimisticList, SimpleOptimisticList } from '@/components/optimistic';

// Advanced list with custom rendering
<OptimisticList
  items={tickets}
  onAdd={async (ticket) => await createTicket(ticket)}
  onRemove={async (id) => await deleteTicket(id)}
  onUpdate={async (id, updates) => await updateTicket(id, updates)}
  renderItem={(item, { isOptimistic, isDeleting, onDelete }) => (
    <div className="p-4 border rounded">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {onDelete && (
        <button onClick={onDelete} disabled={isDeleting}>
          Delete
        </button>
      )}
    </div>
  )}
/>

// Simple string list
<SimpleOptimisticList
  items={tags}
  onAdd={async (tag) => await addTag(tag)}
  onRemove={async (index) => await removeTag(index)}
/>
```

### OptimisticForm

Forms with field-level optimistic updates and auto-save functionality.

```tsx
import { OptimisticForm, OptimisticField, OptimisticSubmitButton } from '@/components/optimistic';

<OptimisticForm
  defaultValues={customer}
  onSubmit={async (data) => await saveCustomer(data)}
  onFieldChange={async (field, value) => await updateField(field, value)}
  autoSave={true}
  autoSaveDelay={1000}
  optimisticFields={['firstName', 'lastName', 'email']}
>
  {(form, { isSubmitting, hasOptimisticChanges }) => (
    <div>
      <OptimisticField
        label="First Name"
        isOptimistic={hasOptimisticChanges}
      >
        <input {...form.register('firstName')} />
      </OptimisticField>
      
      <OptimisticSubmitButton
        isSubmitting={isSubmitting}
        hasOptimisticChanges={hasOptimisticChanges}
      >
        Save Customer
      </OptimisticSubmitButton>
    </div>
  )}
</OptimisticForm>
```

### OptimisticTable

Tables with optimistic row operations and sorting.

```tsx
import { OptimisticTable, SimpleOptimisticTable } from '@/components/optimistic';

<OptimisticTable
  columns={[
    { key: 'title', header: 'Title', sortable: true },
    { key: 'status', header: 'Status', render: (value) => <Badge>{value}</Badge> },
    { key: 'created', header: 'Created', render: (value) => formatDate(value) }
  ]}
  data={tickets}
  onUpdate={async (id, data) => await updateTicket(id, data)}
  onDelete={async (id) => await deleteTicket(id)}
  onSort={(column, direction) => setSorting({ column, direction })}
  sortColumn={sorting.column}
  sortDirection={sorting.direction}
/>
```

### OptimisticCard

Cards with optimistic content updates and actions.

```tsx
import { OptimisticCard, OptimisticCardGrid } from '@/components/optimistic';

// Single card
<OptimisticCard
  title="Customer Details"
  content={<CustomerInfo customer={customer} />}
  onUpdate={async (data) => await updateCustomer(data)}
  onDelete={async () => await deleteCustomer(customer.id)}
  variant="elevated"
/>

// Card grid with optimistic operations
<OptimisticCardGrid
  cards={customers.map(customer => ({
    id: customer.id,
    title: customer.name,
    content: <CustomerPreview customer={customer} />,
  }))}
  onUpdate={async (id, data) => await updateCustomer(id, data)}
  onDelete={async (id) => await deleteCustomer(id)}
  columns={3}
  cardVariant="outlined"
/>
```

### OptimisticIndicator

Visual indicators for optimistic operation status.

```tsx
import { 
  OptimisticIndicator, 
  OptimisticStatusBar, 
  OptimisticPulse 
} from '@/components/optimistic';

// Status indicator
<OptimisticIndicator
  status="pending"
  message="Saving changes..."
  variant="toast"
  position="top-right"
  duration={3000}
/>

// Status bar for multiple operations
<OptimisticStatusBar
  pendingCount={pendingOperations.length}
  successCount={completedOperations.length}
  errorCount={failedOperations.length}
  isOffline={!navigator.onLine}
/>

// Pulse effect for active elements
<OptimisticPulse
  isActive={isUpdating}
  intensity="medium"
  color="blue"
>
  <div>Content being updated</div>
</OptimisticPulse>
```

### OptimisticToast

Toast notifications for optimistic operations with context provider.

```tsx
import { 
  OptimisticToastProvider, 
  useOptimisticToast, 
  useOptimisticOperations 
} from '@/components/optimistic';

// Wrap your app with the provider
<OptimisticToastProvider position="top-right" maxToasts={5}>
  <App />
</OptimisticToastProvider>

// Use in components
function MyComponent() {
  const { addToast } = useOptimisticToast();
  const { executeOptimisticOperation } = useOptimisticOperations();

  const handleSave = async () => {
    await executeOptimisticOperation(
      () => saveData(),
      {
        pendingMessage: "Saving...",
        successMessage: "Saved successfully!",
        errorMessage: "Failed to save",
      }
    );
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## Best Practices

### 1. Error Handling
Always implement proper error handling with user-friendly messages:

```tsx
<OptimisticButton
  onOptimisticClick={async () => {
    try {
      await apiCall();
    } catch (error) {
      // Error will be shown automatically
      throw new Error('Unable to save changes. Please try again.');
    }
  }}
  errorText="Save failed"
/>
```

### 2. Loading States
Use appropriate loading indicators for better UX:

```tsx
<OptimisticForm
  showOptimisticIndicator={true}
  optimisticFields={['field1', 'field2']} // Only these fields show optimistic updates
>
  {/* form content */}
</OptimisticForm>
```

### 3. Performance
- Use `React.memo` for expensive components
- Implement pagination for large lists
- Debounce auto-save operations

```tsx
<OptimisticForm
  autoSave={true}
  autoSaveDelay={1000} // Debounce auto-save
/>
```

### 4. Accessibility
Components include built-in accessibility features:
- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Color contrast compliance

### 5. Testing
Test optimistic operations with both success and failure scenarios:

```tsx
// Test success case
await user.click(saveButton);
expect(screen.getByText('Saving...')).toBeInTheDocument();
await waitFor(() => {
  expect(screen.getByText('Saved!')).toBeInTheDocument();
});

// Test error case
server.use(
  rest.post('/api/save', (req, res, ctx) => {
    return res(ctx.status(500));
  })
);
await user.click(saveButton);
await waitFor(() => {
  expect(screen.getByText('Save failed')).toBeInTheDocument();
});
```

## Styling

All components support custom styling through className props and CSS variables:

```css
:root {
  --optimistic-primary: #3b82f6;
  --optimistic-success: #10b981;
  --optimistic-error: #ef4444;
  --optimistic-pending: #f59e0b;
}
```

## TypeScript Support

All components are fully typed with TypeScript for better developer experience:

```tsx
interface MyData {
  id: number;
  title: string;
  description: string;
}

<OptimisticList<MyData>
  items={data}
  onAdd={async (item: Omit<MyData, 'id'>) => {
    // TypeScript ensures correct typing
    return await createItem(item);
  }}
/>
```