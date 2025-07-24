# Next.js Safe Actions Implementation

This project uses **Next.js Safe Actions** for type-safe server actions with built-in validation, error handling, and optimistic updates.

## Overview

Safe Actions provide a secure and type-safe way to handle server-side operations in Next.js applications. They combine the power of Zod validation with automatic error handling and cache revalidation.

## Features

- ✅ **Type-safe server actions** with full TypeScript support
- ✅ **Automatic validation** using Zod schemas
- ✅ **Built-in error handling** with custom error messages
- ✅ **Loading states** and optimistic updates
- ✅ **Automatic cache revalidation** with `revalidatePath()`
- ✅ **Custom React hooks** for easy client-side integration

## Project Structure

```
src/
├── lib/
│   ├── safe-actions.ts          # Safe Actions configuration
│   ├── actions/
│   │   ├── index.ts            # Export all actions
│   │   ├── customer-actions.ts # Customer CRUD operations
│   │   └── ticket-actions.ts   # Ticket CRUD operations
│   └── hooks/
│       └── use-safe-action.ts  # Custom hook for Safe Actions
├── components/
│   └── SafeActionDemo.tsx      # Demo component
└── app/
    └── (rs)/
        └── safe-actions-demo/
            └── page.tsx        # Demo page
```

## Quick Start

### 1. Using Safe Actions in Components

```tsx
"use client";

import { createCustomer } from "@/lib/actions";
import { useSafeAction } from "@/lib/hooks/use-safe-action";

export function CustomerForm() {
  const { execute, isLoading, error } = useSafeAction(createCustomer, {
    onSuccess: (data) => {
      console.log("Customer created:", data);
      // Navigate or show success message
    },
    onError: (error) => {
      console.error("Failed to create customer:", error);
    },
  });

  const handleSubmit = async (formData: FormData) => {
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      // ... other fields
    };

    await execute(data);
  };

  return (
    <form action={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Customer"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
```

### 2. Creating a Safe Action

```tsx
// src/lib/actions/customer-actions.ts
import { action } from "@/lib/safe-actions";
import { customerInsertSchema } from "@/lib/zod-schemas/customer";
import { db } from "@/db";
import { customers } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const createCustomer = action
  .inputSchema(customerInsertSchema)
  .action(async ({ parsedInput }) => {
    try {
      const [newCustomer] = await db
        .insert(customers)
        .values(parsedInput)
        .returning();

      // Revalidate cache
      revalidatePath("/customers");
      revalidatePath("/");

      return {
        data: newCustomer,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("unique constraint")) {
        return {
          serverError: "A customer with this email already exists.",
        };
      }
      throw error;
    }
  });
```

### 3. Using with React Hook Form

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCustomer } from "@/lib/actions";
import { useSafeAction } from "@/lib/hooks/use-safe-action";

export function CustomerForm() {
  const { execute, isLoading } = useSafeAction(createCustomer);

  const form = useForm({
    resolver: zodResolver(customerInsertSchema),
  });

  const onSubmit = async (data) => {
    await execute(data);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Customer"}
      </button>
    </form>
  );
}
```

## Available Actions

### Customer Actions

- `createCustomer(data)` - Create a new customer
- `updateCustomer(data)` - Update an existing customer
- `deleteCustomer({ id })` - Delete a customer
- `getCustomer({ id })` - Get customer by ID
- `getAllCustomers({ active? })` - Get all customers (optionally filtered by status)
- `toggleCustomerStatus({ id })` - Toggle customer active status

### Ticket Actions

- `createTicket(data)` - Create a new ticket
- `updateTicket(data)` - Update an existing ticket
- `deleteTicket({ id })` - Delete a ticket
- `getTicket({ id })` - Get ticket by ID
- `getAllTickets({ completed?, tech? })` - Get all tickets (optionally filtered)
- `getTicketsByCustomer({ customerId })` - Get tickets for a specific customer
- `assignTicket({ id, tech })` - Assign ticket to a technician
- `toggleTicketStatus({ id })` - Toggle ticket completion status

## Error Handling

Safe Actions automatically handle validation errors and server errors:

```tsx
const { execute, error, validationErrors } = useSafeAction(createCustomer);

// error - Contains server error messages
// validationErrors - Contains field-specific validation errors
```

## Loading States

The `useSafeAction` hook provides loading states for better UX:

```tsx
const { execute, isLoading } = useSafeAction(createCustomer);

return (
  <button disabled={isLoading}>
    {isLoading ? (
      <span className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Creating...</span>
      </span>
    ) : (
      "Create Customer"
    )}
  </button>
);
```

## Cache Revalidation

Safe Actions automatically revalidate the cache using `revalidatePath()`:

```tsx
export const createCustomer = action(customerInsertSchema, async (data) => {
  // ... database operation

  // Revalidate relevant pages
  revalidatePath("/customers");
  revalidatePath("/");
  revalidatePath(`/customers/${newCustomer.id}`);

  return { data: newCustomer };
});
```

## Demo

Visit `/safe-actions-demo` to see Safe Actions in action with a comprehensive demo that includes:

- Customer creation form
- Customer list with actions
- Status toggling
- Deletion with confirmation
- Loading states and error handling
- Optimistic updates

## Best Practices

1. **Always use Zod schemas** for input validation
2. **Handle errors gracefully** with meaningful messages
3. **Use loading states** for better user experience
4. **Revalidate cache** after mutations
5. **Implement optimistic updates** when possible
6. **Use TypeScript** for full type safety
7. **Test error scenarios** to ensure proper handling

## Migration from API Routes

If you're migrating from API routes to Safe Actions:

1. Replace API route handlers with Safe Actions
2. Update client-side code to use `useSafeAction` hook
3. Remove manual error handling (Safe Actions handle it automatically)
4. Update form submissions to use action functions
5. Add proper cache revalidation

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Ensure all schemas are properly typed
2. **Validation errors**: Check Zod schema definitions
3. **Cache not updating**: Verify `revalidatePath()` calls
4. **Loading states not working**: Check hook implementation

### Debug Mode

Enable debug mode in development:

```tsx
// src/lib/safe-actions.ts
export const action = createSafeActionClient({
  handleServerError: (error) => {
    console.error("Server error:", error); // Debug logging
    return {
      serverError: "Something went wrong. Please try again.",
    };
  },
});
```

## Resources

- [Next.js Safe Actions Documentation](https://next-safe-action.dev/)
- [Zod Documentation](https://zod.dev/)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) 