"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel, TextareaWithLabel, SelectWithLabel, CheckboxWithLabel } from "@/components/inputs";
import { customerInsertSchema, type InsertCustomerSchema, type SelectCustomerSchema } from "@/lib/zod-schemas/customer";
import { z } from "zod";
import React, { useMemo, useState } from "react";
import { allCountries } from "country-region-data";

type CustomerFormProps = {
    customer?: SelectCustomerSchema;
}

export function CustomerForm({ customer }: CustomerFormProps) {
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

    // Dynamic country/state logic
    const countryOptions = useMemo(
        () => (allCountries as any[]).map(c => ({
            value: c[1],   // country short code
            label: c[0],   // country name
        })),
        []
    );

    const [selectedCountry, setSelectedCountry] = useState(defaultValues.country || countryOptions[0]?.value || "");
    const regionOptions = useMemo(() => {
        const country = (allCountries as any[]).find(c => c[1] === selectedCountry);
        return country && country[2].length > 0
            ? country[2].map((r: any) => ({
                value: r[1] || r[0], // region short code or name
                label: r[0],         // region name
            }))
            : [];
    }, [selectedCountry]);

    const form = useForm<z.infer<typeof customerInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(customerInsertSchema),
        defaultValues,
    });

    // Keep react-hook-form in sync with dynamic country
    React.useEffect(() => {
        form.setValue("country", selectedCountry);
        // If the selected country changes, clear the state field
        form.setValue("state", "");
    }, [selectedCountry]);

    async function submitForm(data: z.infer<typeof customerInsertSchema>) {
        console.log(data);
    }

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    {customer && customer.id !== 0 ? (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Edit Customer: {customer.firstName} {customer.lastName}
                        </h2>
                    ) : (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            New Customer
                        </h2>
                    )}
                </div>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="p-6 space-y-8">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Personal Information
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Basic customer details
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Contact Information
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                How to reach the customer
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                    </div>

                    {/* Address Information Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Address Information
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Customer's physical address
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Country and State/Region */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectWithLabel<InsertCustomerSchema>
                                    fieldTitle="Country"
                                    nameInSchema="country"
                                    required={true}
                                    placeholder="Select country"
                                    options={countryOptions}
                                    onValueChange={val => setSelectedCountry(val)}
                                    className="space-y-3"
                                />
                                <SelectWithLabel<InsertCustomerSchema>
                                    fieldTitle="State/Region"
                                    nameInSchema="state"
                                    required={true}
                                    placeholder={regionOptions.length ? "Select state/region" : "No regions available"}
                                    options={regionOptions}
                                    disabled={regionOptions.length === 0}
                                    className="space-y-3"
                                />
                            </div>
                            
                            {/* City and ZIP/Postal Code */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div>
                            
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
                    </div>

                    {/* Additional Information Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Additional Information
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Any additional notes or special requirements
                            </p>
                        </div>
                        
                        <div className="space-y-6">
                            <CheckboxWithLabel<InsertCustomerSchema>
                                fieldTitle="Active Customer"
                                nameInSchema="active"
                                required={false}
                                description="Mark this customer as active (uncheck to deactivate)"
                                className="space-y-3"
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
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <Button 
                            type="submit" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            {customer ? "Update Customer" : "Create Customer"}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                            onClick={() => {
                                form.reset();
                                setSelectedCountry(defaultValues.country || countryOptions[0]?.value || "");
                            }}
                        >
                            Reset Form
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}