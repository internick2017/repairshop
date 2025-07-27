"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, User, Calendar, Wrench, CheckCircle, Edit } from "lucide-react"
import Link from "next/link"

export interface Ticket {
  id: number
  title: string
  description: string
  completed: boolean
  tech: string
  createdAt: Date
  updatedAt: Date
  customerId: number
  customer?: {
    firstName: string
    lastName: string
    email: string
  }
}

export const columns: ColumnDef<Ticket>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Ticket ID",
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <span className="font-mono text-sm">#{ticket.id}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <div>
          <div className="font-medium">{ticket.title}</div>
          <div className="text-sm text-muted-foreground line-clamp-1">
            {ticket.description}
          </div>
        </div>
      )
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "tech",
    header: "Tech",
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <div className="flex items-center gap-2">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{ticket.tech}</span>
        </div>
      )
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const ticket = row.original
      return ticket.customer ? (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">
              {ticket.customer.firstName} {ticket.customer.lastName}
            </div>
            <div className="text-xs text-muted-foreground">
              {ticket.customer.email}
            </div>
          </div>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">No customer</span>
      )
    },
    accessorFn: (row) => row.customer ? `${row.customer.firstName} ${row.customer.lastName}` : "No customer",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "completed",
    header: "Status",
    cell: ({ row }) => {
      const ticket = row.original
      const getStatusColor = (completed: boolean) => {
        return completed 
          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      }
      
      const getStatusText = (completed: boolean) => {
        return completed ? "Completed" : "Pending"
      }

      return (
        <Badge className={getStatusColor(ticket.completed)} variant="secondary">
          {getStatusText(ticket.completed)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <div className="flex items-center gap-2">
          <Link href={`/tickets/form?ticketId=${ticket.id}`}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/tickets/form?ticketId=${ticket.id}`}>
            <Button variant="ghost" size="sm">
              <CheckCircle className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )
    },
  },
] 