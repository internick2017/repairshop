"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Ticket } from "@/types";
import { CheckCircle, Clock } from "lucide-react";

interface TicketTableProps {
  tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
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

  return (
    <DataTable
      columns={columns}
      data={tickets}
      searchKeys={["title", "tech", "customer"]}
      searchPlaceholder="Search tickets by title, tech, or customer..."
      showPagination={true}
      filterOptions={filterOptions}
      showExport={true}
      exportFilename="tickets"
    />
  );
} 