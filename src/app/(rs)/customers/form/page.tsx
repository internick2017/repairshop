import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import { CustomerForm } from "./CustomerForm";

interface CustomerFormPageProps {
    searchParams: Promise<{
        customerId?: string;
    }>;
}

export default async function CustomerFormPage({ searchParams }: CustomerFormPageProps) {
    try {
        const { customerId } = await searchParams;
        
        // If no customerId, show new customer form
        if (!customerId) {
            return (
                <div className="max-w-2xl mx-auto p-6">
                    <div className="flex items-center mb-6 space-x-4">
                        <BackButton href="/customers" label="Back to Customers" />
                    </div>
                    <CustomerForm />
                </div>
            );
        }
        
        // Validate and parse customerId
        const parsedCustomerId = parseInt(customerId);
        if (isNaN(parsedCustomerId)) {
            throw new Error("Invalid customer ID format");
        }
        
        const customer = await getCustomer(parsedCustomerId);
        if (!customer) {
            throw new Error("Customer not found");
        }

        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton href="/customers" label="Back to Customers" />
                </div>
                <CustomerForm customer={customer} />
            </div>
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        
        // Log error to Sentry with context
        Sentry.captureException(error, {
            tags: {
                component: 'CustomerFormPage',
                action: 'load_customer_form'
            },
            extra: {
                searchParams: await searchParams,
                errorMessage
            }
        });

        console.error('Customer Form Page Error:', errorMessage);
        
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton href="/customers" label="Back to Customers" />
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error Loading Customer
                    </h2>
                    <p className="text-red-700 dark:text-red-300">
                        {errorMessage}
                    </p>
                </div>
            </div>
        );
    }
}
