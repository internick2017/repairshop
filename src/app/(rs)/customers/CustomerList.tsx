import { customers } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { CustomerTable } from "./CustomerTable";

type Customer = InferSelectModel<typeof customers>;

interface CustomerListProps {
    customers: Customer[];
    selectMode: boolean;
}

export function CustomerList({ customers, selectMode }: CustomerListProps) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <p className="text-gray-600 dark:text-gray-400">
                    {selectMode 
                        ? "Choose a customer to create a new repair ticket" 
                        : "Manage your customer database"
                    }
                </p>
            </div>

            {/* Customer Table */}
            <CustomerTable 
                customers={customers} 
                selectMode={selectMode}
            />
        </div>
    );
} 