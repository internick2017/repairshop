import { getTicket } from "@/lib/queries/getTicket";
import { BackButton } from "@/components/BackButton";
import { getCustomer } from "@/lib/queries/getCustomer";
import { customers, tickets } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import * as Sentry from "@sentry/nextjs";
import { TicketForm } from "./TicketForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Users, init as kindeInit } from "@kinde/management-api-js";

type Customer = InferSelectModel<typeof customers>;
type Ticket = InferSelectModel<typeof tickets>;

interface KindeUser {
    id?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    is_suspended?: boolean;
}

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    fullName: string;
    isActive: boolean;
}

interface TicketFormPageProps {
    searchParams: Promise<{
        ticketId?: string | string[];
        customerId?: string | string[];
        from?: string | string[];
    }>;
}

export default async function TicketFormPage({ searchParams }: TicketFormPageProps) {
    try {
        const params = await searchParams;
        const ticketId = Array.isArray(params.ticketId) ? params.ticketId[0] : params.ticketId;
        const customerId = Array.isArray(params.customerId) ? params.customerId[0] : params.customerId;
        const from = Array.isArray(params.from) ? params.from[0] : params.from;
        let ticket: Ticket | null = null;
        let customer: Customer | null = null;
        let users: User[] = [];

        // Get user session and permissions
        const { getUser, getPermission } = getKindeServerSession();
        const [managerPermission, user] = await Promise.all([
            getPermission("manager"),
            getUser()
        ]);

        const isManager = managerPermission?.isGranted || false;

        // Ensure user exists
        if (!user) {
            throw new Error("User not authenticated");
        }

        // Handle different scenarios based on URL parameters
        if (ticketId && typeof ticketId === 'string' && ticketId.trim() !== '') {
            // Scenario 1: Editing existing ticket
            const parsedTicketId = parseInt(ticketId);
            if (isNaN(parsedTicketId)) {
                throw new Error("Invalid ticket ID format");
            }

            ticket = await getTicket(parsedTicketId);
            if (!ticket) {
                throw new Error("Ticket not found");
            }

            // Permission check: Regular employees can only edit tickets assigned to them
            if (!isManager && ticket.tech !== user.email) {
                throw new Error("You can only edit tickets assigned to you");
            }

            // Fetch associated customer
            customer = await getCustomer(ticket.customerId);
            if (!customer) {
                throw new Error("Associated customer not found");
            }
        } else if (customerId && typeof customerId === 'string' && customerId.trim() !== '') {
            // Scenario 2: Creating new ticket for existing customer
            // Only managers can create new tickets
            if (!isManager) {
                throw new Error("Only managers can create new tickets");
            }

            const parsedCustomerId = parseInt(customerId);
            if (isNaN(parsedCustomerId)) {
                throw new Error("Invalid customer ID format");
            }

            customer = await getCustomer(parsedCustomerId);
            if (!customer) {
                throw new Error("Customer not found");
            }
        } else {
            // Scenario 3: No parameters - redirect to customer selection (managers only)
            if (!isManager) {
                redirect("/tickets"); // Regular employees go back to tickets list
            }
            redirect("/customers?select=true");
        }

        // Fetch all users from Kinde Management API for managers
        if (isManager) {
            try {
                // Ensure the domain has the https:// protocol
                const kindeDomain = process.env.KINDE_DOMAIN!.startsWith('http') 
                    ? process.env.KINDE_DOMAIN! 
                    : `https://${process.env.KINDE_DOMAIN!}`;

                await kindeInit({
                    kindeDomain: kindeDomain,
                    clientId: process.env.KINDE_MANAGEMENT_CLIENT_ID!,
                    clientSecret: process.env.KINDE_MANAGEMENT_CLIENT_SECRET!
                });
                
                const usersResponse = await Users.getUsers();
                console.log(usersResponse);
                users = usersResponse?.users?.map((kindeUser: KindeUser) => ({
                    id: kindeUser.id || '',
                    email: kindeUser.email || '',
                    firstName: kindeUser.first_name,
                    lastName: kindeUser.last_name,
                    fullName: kindeUser.full_name || kindeUser.email || '',
                    isActive: kindeUser.is_suspended === false
                })).filter(user => user.id && user.email) || [];
            } catch (error) {
                console.error('Error fetching users from Kinde:', error);
                // Fallback to current user only
                users = [{
                    id: user.id || user.email || '',
                    email: user.email || '',
                    firstName: user.given_name || undefined,
                    lastName: user.family_name || undefined,
                    fullName: `${user.given_name || ''} ${user.family_name || ''}`.trim() || (user.email || ''),
                    isActive: true
                }];
            }
        }

        // Determine back button destination
        const getBackDestination = () => {
            if (from && typeof from === 'string' && from === "customers") {
                return { href: "/customers", label: "Back to Customers" };
            } else if (ticket) {
                return { href: "/tickets", label: "Back to Tickets" };
            } else {
                return { href: "/customers", label: "Back to Customers" };
            }
        };

        const backDestination = getBackDestination();

        // Determine if user can edit the ticket
        let canEdit = isManager || (ticket && user.email && ticket.tech && ticket.tech === user.email)
        if (typeof canEdit !== 'boolean') {
            canEdit = false;
        }
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton
                        href={backDestination.href}
                        label={backDestination.label}
                    />
                </div>
                <TicketForm
                    customer={customer}
                    ticket={ticket || undefined}
                    users={users}
                    isManager={isManager}
                    currentUser={{
                        id: user.id || undefined,
                        email: user.email || '',
                        given_name: user.given_name || undefined,
                        family_name: user.family_name || undefined
                    }}
                    canEdit={canEdit}
                />
            </div>
        );
    } catch (error) {
        // Enhanced error logging
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

        // Log the full error for debugging
        console.error('Full error object:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

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


