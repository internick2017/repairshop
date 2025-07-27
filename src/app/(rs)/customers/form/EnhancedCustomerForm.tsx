"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form} from "@/components/ui/form";
import { InputWithLabel, TextareaWithLabel } from "@/components/inputs";
import { 
  FormWrapper, 
  FormSection, 
  FormGrid, 
  FormActions, 
  PermissionField, 
  CountryStateFields,
  FormStateProvider,
  useFormState,
  useFormPersistence,
  useOptimisticUpdates,
  FormIndicator,
  useFormValidation
} from "@/components/forms";
import { customerInsertSchema, type InsertCustomerSchema, type SelectCustomerSchema } from "@/lib/zod-schemas/customer";
import { z } from "zod";
import React, { useEffect } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { createCustomer, updateCustomer } from "@/lib/actions";
import { useSafeAction } from "@/lib/hooks/use-safe-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CustomerFormProps = {
    customer?: SelectCustomerSchema;
}

function CustomerFormContent({ customer }: CustomerFormProps) {
    const {getPermission, isLoading} = useKindeBrowserClient();
    const router = useRouter();
    const { setSubmitting, setLastSaved, incrementSubmitAttempts, resetSubmitAttempts } = useFormState();

    const isManager = !isLoading && getPermission("manager")?.isGranted;

    // Safe Actions hooks with optimistic updates
    const optimisticUpdates = useOptimisticUpdates<SelectCustomerSchema>();

    const { execute: executeCreate, isLoading: isCreating } = useSafeAction(createCustomer, {
        onSuccess: () => {
            setLastSaved(new Date());
            resetSubmitAttempts();
            router.push("/customers");
        },
        successMessage: "Customer created successfully!",
        errorMessage: "Failed to create customer. Please try again.",
    });

    const { execute: executeUpdate, isLoading: isUpdating } = useSafeAction(updateCustomer, {
        onSuccess: (result) => {
            setLastSaved(new Date());
            resetSubmitAttempts();
            if (result.data) {
                optimisticUpdates.setData(result.data as SelectCustomerSchema);
            }
            router.push("/customers");
        },
        successMessage: "Customer updated successfully!",
        errorMessage: "Failed to update customer. Please try again.",
    });

    const defaultValues: z.infer<typeof customerInsertSchema> = customer ? {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address1: customer.address1,
        address2: customer.address2,
        city: customer.city,
        state: customer.state,
        zip: customer.zip,
        country: customer.country,
        notes: customer.notes,
        active: Boolean(customer.active),
    } : {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        notes: "",
        active: true,
    };

    const form = useForm<z.infer<typeof customerInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(customerInsertSchema),
        defaultValues,
    });

    // Form persistence
    const formPersistence = useFormPersistence(form, {
        key: `customer-form-${customer?.id || 'new'}`,
        enabled: true,
        excludeFields: ['active'], // Don't persist sensitive permission field
        onRestore: (data) => {
            toast.info("Draft restored from previous session");
        },
        onSave: () => {
            // Optionally show subtle save indicator
        }
    });

    // Enhanced validation with custom rules
    const validation = useFormValidation(form, {
        customRules: [
            {
                field: 'email',
                validator: (value) => {
                    if (typeof value === 'string' && value.includes('+')) {
                        return 'Email addresses with + symbols may not be supported by all systems';
                    }
                    return null;
                },
            },
            {
                field: 'phone',
                validator: (value) => {
                    if (typeof value === 'string' && value.length > 0 && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
                        return 'Phone number contains invalid characters';
                    }
                    return null;
                },
            }
        ],
        crossFieldValidations: [
            {
                name: 'address-consistency',
                validator: (data) => {
                    const errors: Record<string, string> = {};
                    
                    // If address1 is provided, city, state, country, and zip should also be provided
                    if (data.address1 && (!data.city || !data.state || !data.country || !data.zip)) {
                        if (!data.city) errors.city = 'City is required when address is provided';
                        if (!data.state) errors.state = 'State is required when address is provided';
                        if (!data.country) errors.country = 'Country is required when address is provided';
                        if (!data.zip) errors.zip = 'ZIP code is required when address is provided';
                    }
                    
                    return errors;
                },
                dependencies: ['address1', 'city', 'state', 'country', 'zip']
            }
        ]
    });

    // Set up form state tracking
    useEffect(() => {
        setSubmitting(isCreating || isUpdating);
    }, [isCreating, isUpdating, setSubmitting]);

    async function submitForm(data: z.infer<typeof customerInsertSchema>) {
        incrementSubmitAttempts();

        // Validate all fields before submission
        const isValid = await validation.validateAll();
        if (!isValid) {
            toast.error("Please fix the form errors before submitting");
            return;
        }

        // If user is not a manager, preserve the original active status
        if (!isManager && customer) {
            data.active = Boolean(customer.active);
        }

        if (customer) {
            // Apply optimistic update for better UX
            const optimisticData = { ...customer, ...data } as SelectCustomerSchema;
            
            optimisticUpdates.applyOptimisticUpdate(
                'update-customer',
                optimisticData,
                () => executeUpdate({ id: customer.id, ...data }).then(result => {
                    if (result.data) {
                        return result.data as SelectCustomerSchema;
                    }
                    throw new Error('Update failed');
                }),
                {
                    successMessage: "Customer updated successfully!",
                    errorMessage: "Failed to update customer - changes reverted",
                }
            );
        } else {
            // Create new customer
            await executeCreate(data);
        }
    }

    const handleReset = () => {
        form.reset();
        formPersistence.clearStorage();
        toast.info("Form reset");
    };

    return (
        <FormWrapper
            title={customer && customer.id !== 0 ? `Edit Customer: ${customer.id}` : "New Customer"}
            subtitle={customer ? "Update customer information" : "Create a new customer record"}
            headerActions={
                <FormIndicator 
                    showLastSaved={true}
                    showSubmitAttempts={true}
                />
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="space-y-8">
                    {/* Optimistic update indicator */}
                    {optimisticUpdates.isOptimistic && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">
                                    Updates are being processed...
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Form validation summary */}
                    {validation.validationSummary.hasErrors && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                            <div className="text-red-800 dark:text-red-200">
                                <span className="text-sm font-medium">
                                    Please fix {validation.validationSummary.errorCount} error(s) before submitting
                                </span>
                                <div className="mt-2 bg-red-200 dark:bg-red-800 rounded-full h-2">
                                    <div 
                                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.max(validation.validationSummary.progress, 10)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Personal Information Section */}
                    <FormSection
                        title="Personal Information"
                        description="Basic customer details"
                    >
                        <FormGrid columns={2}>
                            <InputWithLabel<InsertCustomerSchema>
                                fieldTitle="First Name"
                                nameInSchema="firstName"
                                required={true}
                                placeholder="Enter first name"
                                className="space-y-3"
                                onBlur={() => validation.handleFieldTouch('firstName')}
                            />
                            <InputWithLabel<InsertCustomerSchema>
                                fieldTitle="Last Name"
                                nameInSchema="lastName"
                                required={true}
                                placeholder="Enter last name"
                                className="space-y-3"
                                onBlur={() => validation.handleFieldTouch('lastName')}
                            />
                        </FormGrid>
                    </FormSection>

                    {/* Contact Information Section */}
                    <FormSection
                        title="Contact Information"
                        description="How to reach the customer"
                    >
                        <FormGrid columns={2}>
                            <InputWithLabel<InsertCustomerSchema>
                                fieldTitle="Email Address"
                                nameInSchema="email"
                                required={true}
                                type="email"
                                placeholder="customer@example.com"
                                className="space-y-3"
                                onBlur={() => validation.handleFieldTouch('email')}
                            />
                            <InputWithLabel<InsertCustomerSchema>
                                fieldTitle="Phone Number"
                                nameInSchema="phone"
                                required={true}
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                className="space-y-3"
                                onBlur={() => validation.handleFieldTouch('phone')}
                            />
                        </FormGrid>
                    </FormSection>

                    {/* Address Information Section */}
                    <FormSection
                        title="Address Information"
                        description="Customer's physical address"
                    >
                        <div className="space-y-6">
                            {/* Country and State/Region */}
                            <CountryStateFields<InsertCustomerSchema>
                                countryFieldName="country"
                                stateFieldName="state"
                                defaultCountry={defaultValues.country}
                            />
                            
                            {/* City and ZIP/Postal Code */}
                            <FormGrid columns={2}>
                                <InputWithLabel<InsertCustomerSchema>
                                    fieldTitle="City"
                                    nameInSchema="city"
                                    required={true}
                                    placeholder="Enter city"
                                    className="space-y-3"
                                    onBlur={() => validation.handleFieldTouch('city')}
                                />
                                <InputWithLabel<InsertCustomerSchema>
                                    fieldTitle="ZIP/Postal Code"
                                    nameInSchema="zip"
                                    required={true}
                                    placeholder="12345"
                                    maxLength={10}
                                    className="space-y-3"
                                    onBlur={() => validation.handleFieldTouch('zip')}
                                />
                            </FormGrid>
                            
                            {/* Street Address */}
                            <InputWithLabel<InsertCustomerSchema>
                                fieldTitle="Address Line 1"
                                nameInSchema="address1"
                                required={true}
                                placeholder="123 Main Street"
                                className="space-y-3"
                                onBlur={() => validation.handleFieldTouch('address1')}
                            />
                            <InputWithLabel<InsertCustomerSchema>
                                fieldTitle="Address Line 2"
                                nameInSchema="address2"
                                required={false}
                                placeholder="Apartment, suite, unit, etc. (optional)"
                                className="space-y-3"
                            />
                        </div>
                    </FormSection>

                    {/* Additional Information Section */}
                    <FormSection
                        title="Additional Information"
                        description="Any additional notes or special requirements"
                    >
                        <div className="space-y-6">
                            <PermissionField<InsertCustomerSchema>
                                fieldTitle="Active Customer"
                                nameInSchema="active"
                                description="Mark this customer as active (uncheck to deactivate)"
                                isLoading={isLoading}
                                hasPermission={isManager}
                                currentValue={customer?.active}
                            />
                            
                            <TextareaWithLabel<InsertCustomerSchema>
                                fieldTitle="Notes"
                                nameInSchema="notes"
                                required={false}
                                placeholder="Enter any additional notes, special requirements, or important information about this customer..."
                                rows={4}
                                className="space-y-3"
                            />
                        </div>
                    </FormSection>

                    {/* Form Actions */}
                    <FormActions
                        submitText={customer ? "Update Customer" : "Create Customer"}
                        submitLoadingText={customer ? "Updating..." : "Creating..."}
                        isSubmitting={isCreating || isUpdating}
                        onReset={handleReset}
                        disabled={validation.validationSummary.hasErrors}
                    />
                </form>
            </Form>
        </FormWrapper>
    );
}

export function EnhancedCustomerForm({ customer }: CustomerFormProps) {
    return (
        <FormStateProvider 
            formId={`customer-${customer?.id || 'new'}`}
            enableAutoSave={false}
        >
            <CustomerFormContent customer={customer} />
        </FormStateProvider>
    );
}