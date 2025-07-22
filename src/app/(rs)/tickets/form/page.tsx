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
    searchParams: { 
        ticketId?: string; 
        customerId?: string; 
    };
}

export default async function TicketFormPage({ searchParams }: TicketFormPageProps) {
    // Await searchParams to comply with Next.js 15 requirements
    const { ticketId, customerId } = await Promise.resolve(searchParams);

    try {
        let ticket: Ticket | null = null;
        let customer: Customer | null = null;

        // If customerId is provided, fetch customer and their tickets
        if (customerId) {
            const parsedCustomerId = parseInt(customerId);
            if (isNaN(parsedCustomerId)) {
                return (
                    <div className="max-w-2xl mx-auto p-6">
                        <div className="flex items-center mb-6 space-x-4">
                            <BackButton href="/customers" label="Back to Customers" />
                            <h2 className="text-2xl font-bold">Invalid Customer ID</h2>
                        </div>
                    </div>
                );
            }

            customer = await getCustomer(parsedCustomerId);
            if (!customer) {
                return (
                    <div className="max-w-2xl mx-auto p-6">
                        <div className="flex items-center mb-6 space-x-4">
                            <BackButton href="/customers" label="Back to Customers" />
                            <h2 className="text-2xl font-bold">Customer not found</h2>
                        </div>
                    </div>
                );
            }
        }

        // If ticketId is provided, fetch specific ticket
        if (ticketId) {
            const parsedTicketId = parseInt(ticketId);
            if (isNaN(parsedTicketId)) {
                return (
                    <div className="max-w-2xl mx-auto p-6">
                        <div className="flex items-center mb-6 space-x-4">
                            <BackButton href="/tickets" label="Back to Tickets" />
                            <h2 className="text-2xl font-bold">Invalid Ticket ID</h2>
                        </div>
                    </div>
                );
            }

            ticket = await getTicket(parsedTicketId);
            if (!ticket) {
                return (
                    <div className="max-w-2xl mx-auto p-6">
                        <div className="flex items-center mb-6 space-x-4">
                            <BackButton href="/tickets" label="Back to Tickets" />
                            <h2 className="text-2xl font-bold">Ticket not found</h2>
                        </div>
                    </div>
                );
            }

            // If no customer was previously fetched but ticket has a customer ID, fetch customer
            if (!customer && ticket.customerId !== null) {
                customer = await getCustomer(ticket.customerId);
            }
        }

        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton href={customer ? `/customers` : `/tickets`} 
                                 label={customer ? "Back to Customers" : "Back to Tickets"} />
                </div>
                {customer && <TicketForm customer={customer} ticket={ticket || undefined} />}
            </div>
        );
    } catch (error) {
        // Log error to Sentry with context
        Sentry.captureException(error, {
            tags: {
                component: 'TicketFormPage',
                action: 'load_ticket_form'
            },
            extra: {
                ticketId,
                customerId,
                searchParams: { ticketId, customerId }
            }
        });

        console.error('Ticket Form Page Error:', error);
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton href="/tickets" label="Back to Tickets" />
                    <h2 className="text-2xl font-bold">Error loading ticket or customer</h2>
                    {error instanceof Error && (
                        <p className="text-red-500">{error.message}</p>
                    )}
                </div>
            </div>
        );
    }
}


