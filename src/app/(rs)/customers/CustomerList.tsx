import { customers } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { Plus, User, Mail, Phone, MapPin, FileText } from "lucide-react";
import Link from "next/link";

type Customer = InferSelectModel<typeof customers>;

interface CustomerListProps {
    customers: Customer[];
    selectMode: boolean;
}

export function CustomerList({ customers, selectMode }: CustomerListProps) {
    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {selectMode 
                            ? "Choose a customer to create a new repair ticket" 
                            : "Manage your customer database"
                        }
                    </p>
                </div>
                
                {!selectMode && (
                    <Link href="/customers/form">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Customer
                        </Button>
                    </Link>
                )}
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer) => (
                    <div 
                        key={customer.id}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                    >
                        {/* Customer Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                        {customer.firstName} {customer.lastName}
                                    </h3>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                        customer.active 
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                    }`}>
                                        {customer.active ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <Mail className="w-4 h-4" />
                                <span>{customer.email}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <Phone className="w-4 h-4" />
                                <span>{customer.phone}</span>
                            </div>
                            
                            <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4 mt-0.5" />
                                <div>
                                    <div>{customer.address1}</div>
                                    {customer.address2 && <div>{customer.address2}</div>}
                                    <div>{customer.city}, {customer.state} {customer.zip}</div>
                                </div>
                            </div>
                            
                            {customer.notes && (
                                <div className="flex items-start space-x-2 text-gray-600 dark:text-gray-400">
                                    <FileText className="w-4 h-4 mt-0.5" />
                                    <span className="line-clamp-2">{customer.notes}</span>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            {selectMode ? (
                                <Link 
                                    href={`/tickets/form?customerId=${customer.id}&from=customers`}
                                    className="flex-1"
                                >
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                        Select for Ticket
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={`/customers/form?customerId=${customer.id}`} className="flex-1">
                                        <Button variant="outline" className="w-full">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Link href={`/tickets/form?customerId=${customer.id}&from=customers`} className="flex-1">
                                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                            New Ticket
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {customers.length === 0 && (
                <div className="text-center py-12">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No customers found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {selectMode 
                            ? "You need to create a customer first before creating a ticket."
                            : "Get started by adding your first customer."
                        }
                    </p>
                    {!selectMode && (
                        <Link href="/customers/form">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Your First Customer
                            </Button>
                        </Link>
                    )}
                </div>
            )}
        </>
    );
} 