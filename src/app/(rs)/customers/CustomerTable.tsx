"use client";

import React from "react";
import { DataTableEnhanced } from "@/components/ui/data-table-enhanced";
import { columns } from "./columns";
import { CheckCircle, XCircle, MapPin } from "lucide-react";
import { Customer } from "@/types";
import { ColumnFiltersState } from "@tanstack/react-table";

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

// Get unique states from customers for state filter
const getStateOptions = (customers: Customer[]) => {
  const states = Array.from(new Set(customers.map(c => c.state).filter(Boolean)));
  return states.map(state => ({
    value: state,
    label: state,
    icon: MapPin,
  }));
};

const filterPresets = [
  {
    label: "Active Customers",
    filters: [
      { id: "active", value: ["true"] }
    ] as ColumnFiltersState,
  },
  {
    label: "New Customers (Last 30 days)",
    filters: [
      { 
        id: "createdAt", 
        value: [
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          new Date()
        ] 
      }
    ] as ColumnFiltersState,
  },
  {
    label: "Inactive Customers",
    filters: [
      { id: "active", value: ["false"] }
    ] as ColumnFiltersState,
  },
];

export const CustomerTable = React.memo<CustomerTableProps>(function CustomerTable({ 
  customers, 
  selectMode = false,
  onCustomerSelect
}) {
  const filterOptions = React.useMemo(() => [
    {
      columnId: "active",
      title: "Status",
      options: statusOptions,
    },
    {
      columnId: "state",
      title: "State",
      options: getStateOptions(customers),
    },
  ], [customers]);

  const handleRowClick = React.useCallback((row: any) => {
    if (selectMode && onCustomerSelect) {
      onCustomerSelect(row.original);
    }
  }, [selectMode, onCustomerSelect]);

  return (
    <DataTableEnhanced
      columns={columns}
      data={customers}
      showToolbar={true}
      showPagination={false}
      filterOptions={filterOptions}
      dateFilterColumns={["createdAt"]}
      filterPresets={filterPresets}
      showExport={true}
      exportFilename="customers"
      defaultSorting={[
        {
          id: "createdAt",
          desc: true,
        },
      ]}
      enableMultiSort={true}
      stickyHeader={true}
      onRowClick={selectMode ? handleRowClick : undefined}
    />
  );
}); 