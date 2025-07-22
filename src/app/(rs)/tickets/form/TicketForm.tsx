"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ticketInsertSchema, type InsertTicketSchema, type SelectTicketSchema } from "@/lib/zod-schemas/ticket";
import { z } from "zod";
import { SelectCustomerSchema } from "@/lib/zod-schemas/customer";
import { Button } from "@/components/ui/button";

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
        tech: "new@email.com",
    };

    const form = useForm<z.infer<typeof ticketInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(ticketInsertSchema),
        defaultValues,
    });

    async function submitForm(data: z.infer<typeof ticketInsertSchema>) {
        console.log(data);
    }

    return (
        <div className="flex flex-col gap-6 sm:p-6">
            <div className="flex items-center mb-6 space-x-4">
                {ticket && ticket.id !== 0 ? (
                    <h2 className="text-2xl font-bold">Edit Ticket: {ticket.title}</h2>
                ) : (
                    <h2 className="text-2xl font-bold">New Ticket for {customer.firstName} {customer.lastName}</h2>
                )}
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
                    <div className="p-4 bg-gray-100 rounded">
                        <h3 className="text-lg font-semibold mb-2">Form Data (Placeholder)</h3>
                        <pre className="text-sm">{JSON.stringify(form.getValues(), null, 2)}</pre>
                    </div>
                    
                    <div className="flex gap-4">
                        <Button type="submit" className="flex-1">
                            {ticket ? "Update Ticket" : "Create Ticket"}
                        </Button>
                        <Button type="button" variant="outline" className="flex-1">
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
