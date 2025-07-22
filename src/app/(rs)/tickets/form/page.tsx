import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import { getCustomer } from "@/lib/queries/getCustomer";
import { customers, tickets } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";
import { TicketForm } from "./TicketForm";

type Customer = InferSelectModel<typeof customers>;
type Ticket = InferSelectModel<typeof tickets>;

interface TicketFormPageProps {
    searchParams: Promise<{ 
        ticketId?: string; 
        customerId?: string; 
    }>;
}

export default async function TicketFormPage({ searchParams }: TicketFormPageProps) {
    try {
        const { ticketId, customerId } = await searchParams;
        let ticket: Ticket | null = null;
        let customer: Customer | null = null;

        // Validate and parse customerId if provided
        if (customerId) {
            const parsedCustomerId = parseInt(customerId);
            if (isNaN(parsedCustomerId)) {
                throw new Error("Invalid customer ID format");
            }

            customer = await getCustomer(parsedCustomerId);
            if (!customer) {
                throw new Error("Customer not found");
            }
        }

        // Validate and parse ticketId if provided
        if (ticketId) {
            const parsedTicketId = parseInt(ticketId);
            if (isNaN(parsedTicketId)) {
                throw new Error("Invalid ticket ID format");
            }

            ticket = await getTicket(parsedTicketId);
            if (!ticket) {
                throw new Error("Ticket not found");
            }

            // Fetch customer if not already fetched
            if (!customer && ticket.customerId) {
                customer = await getCustomer(ticket.customerId);
                if (!customer) {
                    throw new Error("Associated customer not found");
                }
            }
        }

        // Ensure we have a customer for the form
        if (!customer) {
            throw new Error("Customer information is required");
        }

        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton 
                        href={ticket ? `/tickets` : `/customers`} 
                        label={ticket ? "Back to Tickets" : "Back to Customers"} 
                    />
                </div>
                <TicketForm customer={customer} ticket={ticket || undefined} />
            </div>
        );
    } catch (error) {
        // Enhanced error logging
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        
        Sentry.captureException(error, {
            tags: {
                component: 'TicketFormPage',
                action: 'load_ticket_form'
            },
            extra: {
                searchParams: await searchParams,
                errorMessage
            }
        });

        console.error('Ticket Form Page Error:', errorMessage);

        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton href="/tickets" label="Back to Tickets" />
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error Loading Form
                    </h2>
                    <p className="text-red-700 dark:text-red-300">
                        {errorMessage}
                    </p>
                </div>
            </div>
        );
    }
}


