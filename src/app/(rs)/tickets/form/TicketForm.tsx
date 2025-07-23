"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel, TextareaWithLabel, CheckboxWithLabel, SelectWithLabel } from "@/components/inputs";
import { ticketInsertSchema, type InsertTicketSchema, type SelectTicketSchema } from "@/lib/zod-schemas/ticket";
import { z } from "zod";
import { SelectCustomerSchema } from "@/lib/zod-schemas/customer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type User = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName: string;
    isActive: boolean;
};

type TicketFormProps = {
    customer: SelectCustomerSchema;
    ticket?: SelectTicketSchema;
    users: User[];
    isManager: boolean;
    currentUser: {
        id?: string;
        email: string;
        given_name?: string;
        family_name?: string;
    };
    canEdit: boolean;
}

export function TicketForm({ customer, ticket, users, isManager, currentUser, canEdit }: TicketFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [techOptions, setTechOptions] = useState<{ value: string; label: string }[]>([]);

    // Prepare tech options based on user permissions
    useEffect(() => {
        let options = [{ value: "unassigned", label: "Unassigned" }];
        
        if (isManager && users.length > 0) {
            // Managers can assign any employee
            options = [
                ...options,
                ...users.map(user => ({
                    value: user.email,
                    label: user.fullName
                }))
            ];
        } else if (!isManager && ticket) {
            // Regular employees can only see themselves for tickets assigned to them
            if (currentUser && currentUser.email) {
                options.push({
                    value: currentUser.email,
                    label: `${currentUser.given_name || ''} ${currentUser.family_name || ''}`.trim() || currentUser.email
                });
            }
        }
        
        setTechOptions(options);
    }, [users, isManager, currentUser, ticket]);

    const defaultValues: z.infer<typeof ticketInsertSchema> = ticket ? {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        completed: ticket.completed ?? false,
        tech: ticket.tech,
        customerId: customer.id,
    } : {
        id: "new",
        customerId: customer.id,
        title: "",
        description: "",
        completed: false,
        tech: currentUser?.email || "unassigned", // Default to current user for managers
    };

    const form = useForm<z.infer<typeof ticketInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(ticketInsertSchema),
        defaultValues,
    });

    async function submitForm(data: z.infer<typeof ticketInsertSchema>) {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const isEditing = ticket && ticket.id !== 0;
            const url = "/api/tickets";
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save ticket");
            }

            // Redirect to tickets list on success
            router.push("/tickets");
            router.refresh();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred";
            setSubmitError(errorMessage);
            console.error("Form submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    const [statusText, setStatusText] = useState(defaultValues.completed ? "Completed" : "Pending");

    // Update status text when form resets
    const handleReset = () => {
        form.reset();
        setStatusText(defaultValues.completed ? "Completed" : "Pending");
        setSubmitError(null);
    };

    return (
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between">
                    {ticket && ticket.id !== 0 ? (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Edit Ticket #{ticket.id}
                        </h2>
                    ) : (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            New Ticket for {customer.firstName} {customer.lastName}
                        </h2>
                    )}
                </div>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="p-6">
                    {/* Error Message */}
                    {submitError && (
                        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-red-700 dark:text-red-300">{submitError}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Ticket Details */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <InputWithLabel<InsertTicketSchema>
                                    fieldTitle="Title"
                                    nameInSchema="title"
                                    required={true}
                                    placeholder="Brief description of the issue"
                                    className="space-y-3"
                                    disabled={!canEdit}
                                />
                                
                                {isManager ? (
                                    <SelectWithLabel<InsertTicketSchema>
                                        fieldTitle="Assigned Tech"
                                        nameInSchema="tech"
                                        required={true}
                                        options={techOptions}
                                        placeholder="Select a technician"
                                        className="space-y-3"
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Assigned Tech
                                        </label>
                                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-900 dark:text-gray-100">
                                                {ticket?.tech || "Unassigned"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            You can only edit tickets assigned to you.
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Customer Info Section */}
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Customer Info
                                    </h3>
                                </div>
                                
                                <div className="space-y-3 text-sm">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {customer.firstName} {customer.lastName}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {customer.address1}
                                        </p>
                                        {customer.address2 && (
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {customer.address2}
                                            </p>
                                        )}
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {customer.city}, {customer.state} {customer.zip}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {customer.email}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Phone: {customer.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Description */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <TextareaWithLabel<InsertTicketSchema>
                                    fieldTitle="Description"
                                    nameInSchema="description"
                                    required={true}
                                    placeholder="Detailed description of the problem, steps to reproduce, and any relevant information..."
                                    rows={12}
                                    className="space-y-3"
                                    disabled={!canEdit}
                                />
                            </div>
                            
                            {/* Status Section */}
                            <div className="space-y-4">
                                <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Status
                                    </h3>
                                </div>
                                
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Current Status:
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            statusText === "Completed" 
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                                        }`}>
                                            {statusText}
                                        </span>
                                    </div>
                                    
                                    <CheckboxWithLabel<InsertTicketSchema>
                                        fieldTitle="Ticket Completed"
                                        nameInSchema="completed"
                                        required={false}
                                        description="Mark this ticket as completed when the work is finished"
                                        className="space-y-3"
                                        disabled={!canEdit}
                                        onValueChange={(checked) => {
                                            setStatusText(checked ? "Completed" : "Pending");
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    {canEdit ? (
                        <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-8 border-t border-gray-200 dark:border-gray-800">
                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Saving..." : (ticket ? "Update Ticket" : "Create Ticket")}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                disabled={isSubmitting}
                                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
                                onClick={handleReset}
                            >
                                Reset Form
                            </Button>
                        </div>
                    ) : (
                        <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-800">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                                    <strong>Read-only mode:</strong> You can view this ticket but cannot make changes. 
                                    {!isManager && ticket && ticket.tech !== currentUser?.email && (
                                        <span> This ticket is assigned to another technician.</span>
                                    )}
                                    {!isManager && !ticket && (
                                        <span> Only managers can create new tickets.</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    );
}
