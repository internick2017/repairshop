import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import { getCustomer } from "@/lib/queries/getCustomer";
import { getTicketsByCustomer } from "@/lib/queries/getTicketsByCustomer";
import { customers, tickets } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";

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
        let customerTickets: Ticket[] = [];

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

            // Fetch tickets for this customer
            customerTickets = await getTicketsByCustomer(parsedCustomerId);
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
                    <h2 className="text-2xl font-bold">
                        {ticket 
                            ? `Ticket Form for Ticket #${ticket.id}` 
                            : customer 
                            ? `Tickets for Customer: ${customer.firstName} ${customer.lastName}` 
                            : "No Ticket or Customer Selected"}
                    </h2>
                </div>

                {/* Display customer details if available */}
                {customer && (
                    <div className="mb-6 p-4 bg-gray-100 rounded">
                        <h3 className="text-xl font-semibold mb-2">Customer Details</h3>
                        <pre>{JSON.stringify(customer, null, 2)}</pre>
                    </div>
                )}

                {/* Display specific ticket if available */}
                {ticket && (
                    <div className="mb-6 p-4 bg-gray-100 rounded">
                        <h3 className="text-xl font-semibold mb-2">Ticket Details</h3>
                        <pre>{JSON.stringify(ticket, null, 2)}</pre>
                    </div>
                )}

                {/* Display customer's tickets if available */}
                {customerTickets.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Customer Tickets</h3>
                        {customerTickets.map((customerTicket) => (
                            <div key={customerTicket.id} className="p-4 bg-gray-50 rounded mb-2">
                                <pre>{JSON.stringify(customerTicket, null, 2)}</pre>
                            </div>
                        ))}
                    </div>
                )}

                {/* No tickets found message */}
                {customerTickets.length === 0 && customer && (
                    <div className="text-center p-4 bg-gray-100 rounded">
                        <p>No tickets found for this customer.</p>
                    </div>
                )}
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


