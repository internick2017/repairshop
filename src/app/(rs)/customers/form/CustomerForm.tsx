"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form} from "@/components/ui/form";
import { InputWithLabel, TextareaWithLabel } from "@/components/inputs";
import { FormWrapper, FormSection, FormGrid, FormActions, PermissionField, CountryStateFields } from "@/components/forms";
import { customerInsertSchema, type InsertCustomerSchema, type SelectCustomerSchema } from "@/lib/zod-schemas/customer";
import { z } from "zod";
import React from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { createCustomer, updateCustomer } from "@/lib/actions";
import { useSafeAction } from "@/lib/hooks/use-safe-action";
import { useRouter } from "next/navigation";
type CustomerFormProps = {
    customer?: SelectCustomerSchema;
}

export function CustomerForm({ customer }: CustomerFormProps) {
    const {getPermission, isLoading} = useKindeBrowserClient();
    const router = useRouter();

    const isManager = !isLoading && getPermission("manager")?.isGranted;

    // Safe Actions hooks
    const { execute: executeCreate, isLoading: isCreating } = useSafeAction(createCustomer, {
        onSuccess: () => {
            router.push("/customers");
        },
        successMessage: "Customer created successfully!",
        errorMessage: "Failed to create customer. Please try again.",
    });

    const { execute: executeUpdate, isLoading: isUpdating } = useSafeAction(updateCustomer, {
        onSuccess: () => {
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


    async function submitForm(data: z.infer<typeof customerInsertSchema>) {
        // If user is not a manager, preserve the original active status
        if (!isManager && customer) {
            data.active = Boolean(customer.active);
        }

        if (customer) {
            // Update existing customer
            await executeUpdate({ id: customer.id, ...data });
        } else {
            // Create new customer
            await executeCreate(data);
        }
    }

    const handleReset = () => {
        form.reset();
    };

    return (
        <FormWrapper
            title={customer && customer.id !== 0 ? `Edit Customer: ${customer.id}` : "New Customer"}
            subtitle={customer ? "Update customer information" : "Create a new customer record"}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="space-y-8">
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
                            />
                            <InputWithLabel<InsertCustomerSchema>
                                fieldTitle="Last Name"
                                nameInSchema="lastName"
                                required={true}
                                placeholder="Enter last name"
                                className="space-y-3"
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
                            />
                            <InputWithLabel<InsertCustomerSchema>
                                fieldTitle="Phone Number"
                                nameInSchema="phone"
                                required={true}
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                className="space-y-3"
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
                                />
                                <InputWithLabel<InsertCustomerSchema>
                                    fieldTitle="ZIP/Postal Code"
                                    nameInSchema="zip"
                                    required={true}
                                    placeholder="12345"
                                    maxLength={10}
                                    className="space-y-3"
                                />
                            </FormGrid>
                            
                            {/* Street Address */}
                            <InputWithLabel<InsertCustomerSchema>
                                fieldTitle="Address Line 1"
                                nameInSchema="address1"
                                required={true}
                                placeholder="123 Main Street"
                                className="space-y-3"
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
                    />
                </form>
            </Form>
        </FormWrapper>
    );
}