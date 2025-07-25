import { getAllCustomers } from "@/lib/queries/getAllCustomers";
import { BackButton } from "@/components/BackButton";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { CustomerList } from "./CustomerList";

interface CustomersPageProps {
    searchParams: Promise<{
        select?: string | string[];
    }>;
}

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
    try {
        const params = await searchParams;
        const select = Array.isArray(params.select) ? params.select[0] : params.select;
        
        // Get user session
        const { getUser } = getKindeServerSession();
        const user = await getUser();

        // Ensure user exists
        if (!user) {
            redirect("/login");
        }

        // Fetch all customers
        const customers = await getAllCustomers();

        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <BackButton href="/home" label="Back to Home" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {select === "true" ? "Select Customer" : "Customers"}
                        </h1>
                    </div>
                </div>
                <CustomerList 
                    customers={customers} 
                    selectMode={select === "true"}
                />
            </div>
        );
    } catch (error) {
        console.error('Customers Page Error:', error);
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-center mb-6 space-x-4">
                    <BackButton href="/home" label="Back to Home" />
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
                        Error Loading Customers
                    </h2>
                    <p className="text-red-700 dark:text-red-300">
                        Failed to load customers. Please try again.
                    </p>
                </div>
            </div>
        );
    }
}