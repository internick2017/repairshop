"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomerTableProps {
  customers: Customer[];
  selectMode?: boolean;
  onCustomerSelect?: (customer: Customer) => void;
}

export function CustomerTable({ customers, selectMode = false, onCustomerSelect }: CustomerTableProps) {
  return (
    <div className="space-y-4">
      {/* Actions */}
      {!selectMode && (
        <div className="flex justify-end">
          <Link href="/customers/form">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </Link>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={customers}
        searchKeys={["name", "email", "phone", "location"]}
        searchPlaceholder="Search customers by name, email, phone, or location..."
        showPagination={true}
      />
    </div>
  );
} 