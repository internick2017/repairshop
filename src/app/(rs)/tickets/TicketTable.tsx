"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

interface Ticket {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  tech: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: number;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

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