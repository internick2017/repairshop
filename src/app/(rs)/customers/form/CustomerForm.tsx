"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { customerInsertSchema, type InsertCustomerSchema, type SelectCustomerSchema } from "@/lib/zod-schemas/customer";
import { z } from "zod";



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
    };

    const form = useForm<z.infer<typeof customerInsertSchema>>({
        mode: "onBlur",
        resolver: zodResolver(customerInsertSchema),
        defaultValues,
    });

    async function submitForm(data: z.infer<typeof customerInsertSchema>) {
        console.log(data);
    }

    return (
        <div className="flex flex-col gap-6 sm:p-6">
            <div className="flex items-center mb-6 space-x-4">
                {customer && customer.id !== 0 ? (
                    <h2 className="text-2xl font-bold">Edit Customer: {customer.firstName} {customer.lastName}</h2>
                ) : (
                    <h2 className="text-2xl font-bold">New Customer</h2>
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
                            {customer ? "Update Customer" : "Create Customer"}
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