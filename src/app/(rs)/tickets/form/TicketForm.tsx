"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputWithLabel, TextareaWithLabel, CheckboxWithLabel } from "@/components/inputs";
import { ticketInsertSchema, type InsertTicketSchema, type SelectTicketSchema } from "@/lib/zod-schemas/ticket";
import { z } from "zod";
import { SelectCustomerSchema } from "@/lib/zod-schemas/customer";
import { useState } from "react";

type TicketFormProps = {
    customer: SelectCustomerSchema;
    ticket?: SelectTicketSchema;
}

export function TicketForm({ customer, ticket }: TicketFormProps) {
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
        tech: "",
    };

    const form = useForm<z.infer<typeof ticketInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(ticketInsertSchema),
        defaultValues,
    });

    async function submitForm(data: z.infer<typeof ticketInsertSchema>) {
        console.log(data);
    }

    const [statusText, setStatusText] = useState(defaultValues.completed ? "Completed" : "Pending");

    // Update status text when form resets
    const handleReset = () => {
        form.reset();
        setStatusText(defaultValues.completed ? "Completed" : "Pending");
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
                                />
                                
                                <InputWithLabel<InsertTicketSchema>
                                    fieldTitle="Tech"
                                    nameInSchema="tech"
                                    required={true}
                                    type="email"
                                    placeholder="tech@repairshop.com"
                                    className="space-y-3"
                                />
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
                                        onValueChange={(checked) => {
                                            setStatusText(checked ? "Completed" : "Pending");
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-8 border-t border-gray-200 dark:border-gray-800">
                        <Button 
                            type="submit" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                        >
                            {ticket ? "Update Ticket" : "Create Ticket"}
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                            onClick={handleReset}
                        >
                            Reset Form
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
