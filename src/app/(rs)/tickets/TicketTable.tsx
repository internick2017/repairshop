"use client";

import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Ticket } from "@/types";
import { CheckCircle, Clock } from "lucide-react";

interface TicketTableProps {
  tickets: Ticket[];
}

const statusOptions = [
  {
    value: "false",
    label: "Pending",
    icon: Clock,
  },
  {
    value: "true",
    label: "Completed",
    icon: CheckCircle,
  },
];

const filterOptions = [
  {
    columnId: "completed",
    title: "Status",
    options: statusOptions,
  },
];

export const TicketTable = React.memo<TicketTableProps>(function TicketTable({ tickets }) {
  return (
    <DataTable
      columns={columns}
      data={tickets}
      showToolbar={false}
      showPagination={true}
      filterOptions={filterOptions}
      showExport={true}
      exportFilename="tickets"
    />
  );
}); 