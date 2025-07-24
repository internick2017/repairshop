"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InputWithLabel } from "@/components/inputs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { 
  createCustomer, 
  deleteCustomer, 
  toggleCustomerStatus,
  getAllCustomers 
} from "@/lib/actions";
import { useSafeAction } from "@/lib/hooks/use-safe-action";
import { customerInsertSchema } from "@/lib/zod-schemas/customer";

// Demo form schema
const demoFormSchema = customerInsertSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
});

export function SafeActionDemo() {
  const [customers, setCustomers] = useState<Array<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    active: boolean;
  }>>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  // Safe Actions hooks
  const { execute: executeCreate, isLoading: isCreating, error: createError } = useSafeAction(createCustomer, {
    onSuccess: (data) => {
      setCustomers(prev => [...prev, data]);
      console.log("Customer created successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to create customer:", error);
    },
  });

  const { execute: executeDelete, isLoading: isDeleting } = useSafeAction(deleteCustomer, {
    onSuccess: (data) => {
      setCustomers(prev => prev.filter(c => c.id !== data.id));
      console.log("Customer deleted successfully:", data);
    },
  });

  const { execute: executeToggle, isLoading: isToggling } = useSafeAction(toggleCustomerStatus, {
    onSuccess: (data) => {
      setCustomers(prev => prev.map(c => c.id === data.id ? data : c));
      console.log("Customer status toggled:", data);
    },
  });

  const { execute: executeGetAll, isLoading: isGettingAll } = useSafeAction(getAllCustomers, {
    onSuccess: (data) => {
      setCustomers(data);
      console.log("All customers loaded:", data);
    },
  });

  const form = useForm<z.infer<typeof demoFormSchema>>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof demoFormSchema>) => {
    // Add required fields for demo
    const customerData = {
      ...data,
      address1: "Demo Address",
      city: "Demo City",
      state: "Demo State",
      zip: "12345",
      country: "US",
      active: true,
    };

    await executeCreate(customerData);
    form.reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Safe Actions Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          This demo showcases Next.js Safe Actions with proper error handling, loading states, and optimistic updates.
        </p>
      </div>

      {/* Create Customer Form */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Create Customer
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithLabel
                fieldTitle="First Name"
                nameInSchema="firstName"
                required={true}
                placeholder="John"
                className="space-y-2"
              />
              <InputWithLabel
                fieldTitle="Last Name"
                nameInSchema="lastName"
                required={true}
                placeholder="Doe"
                className="space-y-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithLabel
                fieldTitle="Email"
                nameInSchema="email"
                required={true}
                type="email"
                placeholder="john@example.com"
                className="space-y-2"
              />
              <InputWithLabel
                fieldTitle="Phone"
                nameInSchema="phone"
                required={true}
                type="tel"
                placeholder="+1234567890"
                className="space-y-2"
              />
            </div>
            
            {createError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Error: {createError}
                </p>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isCreating}
              className="w-full"
            >
              {isCreating ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </span>
              ) : (
                "Create Customer"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Actions Demo */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Customer Actions
        </h2>
        
        <div className="space-y-4">
          <Button 
            onClick={() => executeGetAll({})}
            disabled={isGettingAll}
            variant="outline"
            className="w-full"
          >
            {isGettingAll ? "Loading..." : "Load All Customers"}
          </Button>
          
          {customers.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                Customers ({customers.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {customers.map((customer) => (
                  <div 
                    key={customer.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCustomerId === customer.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedCustomerId(customer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {customer.email}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          customer.active 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                        }`}>
                          {customer.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            executeToggle({ id: customer.id });
                          }}
                          disabled={isToggling}
                        >
                          {isToggling ? "..." : customer.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            executeDelete({ id: customer.id });
                          }}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Safe Actions Features
        </h2>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Type-safe server actions with Zod validation</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Automatic error handling and validation</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Loading states and optimistic updates</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Automatic cache revalidation with revalidatePath</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Custom error messages and validation feedback</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Server-side data validation and sanitization</span>
          </li>
        </ul>
      </div>
    </div>
  );
} 