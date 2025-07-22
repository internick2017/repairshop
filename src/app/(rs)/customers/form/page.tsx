import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import { CustomerForm } from "./CustomerForm";



// Define the component props type
interface CustomerFormPageProps {
    searchParams: {
        customerId?: string;
    }
}

export default async function CustomerFormPage({ searchParams }: CustomerFormPageProps) {
    try {
        const { customerId } = await Promise.resolve(searchParams);
        
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
        
        const customer = await getCustomer(parseInt(customerId));
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
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton href="/customers" label="Back to Customers" />
                </div>
                <CustomerForm customer={customer} />
            </div>
        );
    } catch (error) {
        // Log error to Sentry with context
        Sentry.captureException(error, {
            tags: {
                component: 'CustomerFormPage',
                action: 'load_customer_form'
            },
            extra: {
                customerId: searchParams.customerId,
                searchParams: searchParams
            }
        });

        if (error instanceof Error) {
            console.error(error.message);
        }
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton href="/customers" label="Back to Customers" />
                    <h2 className="text-2xl font-bold">Error loading customer</h2>
                </div>
            </div>
        );
    }
}
