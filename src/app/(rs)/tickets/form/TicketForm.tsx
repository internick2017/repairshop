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
import { createTicket, updateTicket } from "@/lib/actions";
import { useSafeAction } from "@/lib/hooks/use-safe-action";
import { User } from "@/types";
import { createTechOptions, getTechDisplayName, type TechUser } from "@/lib/utils/tech-assignment";

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
    const [techOptions, setTechOptions] = useState<{ value: string; label: string; data?: TechUser }[]>([]);

    // Safe Actions hooks
    const { execute: executeCreate, isLoading: isCreating } = useSafeAction(createTicket, {
        onSuccess: () => {
            router.push("/tickets");
        },
        successMessage: "Ticket created successfully!",
        errorMessage: "Failed to create ticket. Please try again.",
    });

    const { execute: executeUpdate, isLoading: isUpdating } = useSafeAction(updateTicket, {
        onSuccess: () => {
            router.push("/tickets");
        },
        successMessage: "Ticket updated successfully!",
        errorMessage: "Failed to update ticket. Please try again.",
    });

    const isSubmitting = isCreating || isUpdating;

    // Prepare tech options based on user permissions
    useEffect(() => {
        // Convert users to TechUser format
        const techUsers: TechUser[] = users.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            isActive: user.isActive,
        }));

        let options = createTechOptions(techUsers);
        
        if (!isManager && ticket) {
            // Regular employees can only see themselves for tickets assigned to them
            if (currentUser && currentUser.email) {
                const currentUserTech: TechUser = {
                    id: currentUser.id || currentUser.email,
                    email: currentUser.email,
                    firstName: currentUser.given_name,
                    lastName: currentUser.family_name,
                    fullName: `${currentUser.given_name || ''} ${currentUser.family_name || ''}`.trim() || currentUser.email,
                    isActive: true,
                };
                
                options = [
                    { value: "unassigned", label: "Unassigned" },
                    {
                        value: currentUser.email,
                        label: currentUserTech.fullName,
                        data: currentUserTech
                    }
                ];
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
        kindeUserId: ticket.kindeUserId,
        customerId: customer.id,
    } : {
        id: "new",
        customerId: customer.id,
        title: "",
        description: "",
        completed: false,
        tech: currentUser?.email || "unassigned", // Default to current user for managers
        kindeUserId: undefined,
    };

    const form = useForm<z.infer<typeof ticketInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(ticketInsertSchema),
        defaultValues,
    });

    async function submitForm(data: z.infer<typeof ticketInsertSchema>) {
        if (ticket && ticket.id !== 0) {
            // Update existing ticket - remove the form id and use the actual ticket id
            const { id: _, ...updateData } = data;
            await executeUpdate({ id: ticket.id, ...updateData });
        } else {
            // Create new ticket - pass the data as-is since the action expects the full schema
            await executeCreate(data);
        }
    }

    const [statusText, setStatusText] = useState(defaultValues.completed ? "Completed" : "Pending");

    // Update status text when form resets
    const handleReset = () => {
        form.reset();
        setStatusText(defaultValues.completed ? "Completed" : "Pending");
    };

    // Get current tech display name
    const currentTechEmail = form.watch("tech");
    const currentTechDisplayName = getTechDisplayName(currentTechEmail, users.map(user => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        isActive: user.isActive,
    })));

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
                                                {currentTechDisplayName}
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
                                            {customer.country}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            📧 {customer.email}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            📞 {customer.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Column - Description and Status */}
                        <div className="space-y-6">
                            <TextareaWithLabel<InsertTicketSchema>
                                fieldTitle="Description"
                                nameInSchema="description"
                                required={true}
                                placeholder="Detailed description of the issue..."
                                className="space-y-3"
                                disabled={!canEdit}
                                rows={8}
                            />
                            
                            <CheckboxWithLabel<InsertTicketSchema>
                                fieldTitle="Completed"
                                nameInSchema="completed"
                                className="space-y-3"
                                disabled={!canEdit}
                                onChange={(checked) => setStatusText(checked ? "Completed" : "Pending")}
                            />
                            
                            {/* Status Indicator */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <div className={`p-3 rounded-lg border ${
                                    statusText === "Completed" 
                                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
                                        : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                                }`}>
                                    <span className={`font-medium ${
                                        statusText === "Completed" 
                                            ? "text-green-800 dark:text-green-200" 
                                            : "text-yellow-800 dark:text-yellow-200"
                                    }`}>
                                        {statusText}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>{ticket ? "Updating..." : "Creating..."}</span>
                                </div>
                            ) : (
                                <span>{ticket ? "Update Ticket" : "Create Ticket"}</span>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
