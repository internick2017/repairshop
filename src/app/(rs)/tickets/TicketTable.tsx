"use client";

import React from "react";
import { DataTableEnhanced } from "@/components/ui/data-table-enhanced";
import { columns } from "./columns";
import { Ticket } from "@/types";
import { CheckCircle, Clock, Wrench } from "lucide-react";
import { ColumnFiltersState } from "@tanstack/react-table";

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

// Get unique techs from tickets for tech filter
const getTechOptions = (tickets: Ticket[]) => {
  const techs = Array.from(new Set(tickets.map(t => t.tech).filter(Boolean)));
  return techs.map(tech => ({
    value: tech,
    label: tech,
    icon: Wrench,
  }));
};

const filterPresets = [
  {
    label: "Pending Tickets",
    filters: [
      { id: "completed", value: ["false"] }
    ] as ColumnFiltersState,
  },
  {
    label: "Completed Tickets",
    filters: [
      { id: "completed", value: ["true"] }
    ] as ColumnFiltersState,
  },
  {
    label: "Recent Tickets (Last 7 days)",
    filters: [
      { 
        id: "createdAt", 
        value: [
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          new Date()
        ] 
      }
    ] as ColumnFiltersState,
  },
];

export const TicketTable = React.memo<TicketTableProps>(function TicketTable({ tickets }) {
  const filterOptions = React.useMemo(() => [
    {
      columnId: "completed",
      title: "Status",
      options: statusOptions,
    },
    {
      columnId: "tech",
      title: "Technician",
      options: getTechOptions(tickets),
    },
  ], [tickets]);

  return (
    <DataTableEnhanced
      columns={columns}
      data={tickets}
      showToolbar={false}
      showPagination={false}
      filterOptions={filterOptions}
      dateFilterColumns={["createdAt"]}
      filterPresets={filterPresets}
      showExport={true}
      exportFilename="tickets"
      defaultSorting={[
        {
          id: "createdAt",
          desc: true,
        },
      ]}
      enableMultiSort={true}
      stickyHeader={true}
    />
  );
}); 