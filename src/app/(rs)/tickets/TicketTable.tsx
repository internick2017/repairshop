"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Ticket } from "@/types";

interface TicketTableProps {
  tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  return (
    <DataTable
      columns={columns}
      data={tickets}
      searchKeys={["title", "tech", "customer"]}
      searchPlaceholder="Search tickets by title, tech, or customer..."
      showPagination={true}
    />
  );
} 