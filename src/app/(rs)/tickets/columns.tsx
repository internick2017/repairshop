"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, User, Calendar, Wrench, CheckCircle, Edit, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"

export interface Ticket {
  id: number
  title: string
  description: string
  completed: boolean
  tech: string
  kindeUserId?: string | null
  createdAt: Date
  updatedAt: Date
  customerId: number
  customer?: {
    firstName: string
    lastName: string
    email: string
  } | null
}

// Helper function to highlight search terms
function highlightText(text: string, searchTerm: string) {
  if (!searchTerm || !text) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
        {part}
      </mark>
    ) : part
  );
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
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Ticket ID
          {sorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    },
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
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Title
          {sorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    },
    cell: ({ row, table }) => {
      const ticket = row.original
      const globalFilter = table.getState().globalFilter as string || '';
      
      return (
        <div className="flex items-center gap-2">
          <div className="max-w-[200px]">
            <div className="text-sm font-medium truncate">
              {globalFilter ? highlightText(ticket.title, globalFilter) : ticket.title}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {globalFilter ? highlightText(ticket.description, globalFilter) : ticket.description}
            </div>
          </div>
        </div>
      )
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "tech",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Assigned Tech
          {sorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    },
    cell: ({ row, table }) => {
      const ticket = row.original
      const isUnassigned = ticket.tech === "unassigned"
      const globalFilter = table.getState().globalFilter as string || '';
      
      return (
        <div className="flex items-center gap-2">
          <Wrench className={`h-4 w-4 ${isUnassigned ? 'text-muted-foreground' : 'text-blue-600'}`} />
          <div className="flex flex-col">
            <span className={`text-sm ${isUnassigned ? 'text-muted-foreground italic' : 'font-medium'}`}>
              {isUnassigned 
                ? "Unassigned" 
                : (globalFilter ? highlightText(ticket.tech, globalFilter) : ticket.tech)
              }
            </span>
            {ticket.kindeUserId && !isUnassigned && (
              <span className="text-xs text-muted-foreground">
                ID: {ticket.kindeUserId.slice(0, 8)}...
              </span>
            )}
          </div>
        </div>
      )
    },
    enableGlobalFilter: true,
    filterFn: (row, id, value) => {
      const tech = row.getValue(id) as string;
      return value.includes(tech);
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row, table }) => {
      const ticket = row.original
      const globalFilter = table.getState().globalFilter as string || '';
      
      return ticket.customer ? (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">
              {globalFilter 
                ? highlightText(`${ticket.customer.firstName} ${ticket.customer.lastName}`, globalFilter)
                : `${ticket.customer.firstName} ${ticket.customer.lastName}`
              }
            </div>
            <div className="text-xs text-muted-foreground">
              {globalFilter 
                ? highlightText(ticket.customer.email, globalFilter)
                : ticket.customer.email
              }
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
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Status
          {sorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    },
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
        <div className="flex items-center gap-2">
          <CheckCircle className={`h-4 w-4 ${ticket.completed ? 'text-green-600' : 'text-yellow-600'}`} />
          <Badge className={getStatusColor(ticket.completed)}>
            {getStatusText(ticket.completed)}
          </Badge>
        </div>
      )
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Created
          {sorted === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sorted === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    },
    cell: ({ row }) => {
      const ticket = row.original
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm">
            {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
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
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link href={`/tickets/form?ticketId=${ticket.id}`}>
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit ticket</span>
            </Link>
          </Button>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
] 