"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { CheckCircle, XCircle } from "lucide-react";
import { Customer } from "@/types";

interface CustomerTableProps {
  customers: Customer[];
  selectMode?: boolean;
  onCustomerSelect?: (customer: Customer) => void;
}

const statusOptions = [
  {
    value: "true",
    label: "Active",
    icon: CheckCircle,
  },
  {
    value: "false",
    label: "Inactive",
    icon: XCircle,
  },
];

const filterOptions = [
  {
    columnId: "active",
    title: "Status",
    options: statusOptions,
  },
];

export const CustomerTable = React.memo<CustomerTableProps>(function CustomerTable({ 
  customers, 
  selectMode = false 
}) {
  return (
    <DataTable
      columns={columns}
      data={customers}
      showToolbar={false}
      showPagination={true}
      filterOptions={filterOptions}
      showExport={true}
      exportFilename="customers"
    />
  );
}); 