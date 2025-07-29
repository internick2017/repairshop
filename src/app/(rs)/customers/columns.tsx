"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Phone, User, Calendar, Edit, Trash2, Plus, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import Link from "next/link"

export interface Customer {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  city: string
  state: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export const columns: ColumnDef<Customer>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Name
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
      const customer = row.original
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              ID: {customer.id}
            </div>
          </div>
        </div>
      )
    },
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      const sorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-accent"
        >
          Email
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
      const customer = row.original
      return (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{customer.email}</span>
        </div>
      )
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{customer.phone}</span>
        </div>
      )
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => row.original.state,
    enableHiding: true,
    enableGlobalFilter: false,
    filterFn: (row, id, value) => {
      const state = row.getValue(id) as string;
      return value.includes(state);
    },
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="text-sm">
          <div>{customer.city}, {customer.state}</div>
          <div className="text-muted-foreground truncate max-w-32">
            {customer.address1}
          </div>
        </div>
      )
    },
    accessorFn: (row) => `${row.city}, ${row.state}`,
    enableGlobalFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "active",
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
      const customer = row.original
      return (
        <Badge variant={customer.active ? "default" : "secondary"}>
          {customer.active ? "Active" : "Inactive"}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      // Convert string filter values to boolean for comparison
      const isActive = row.getValue(id) as boolean;
      return value.includes(isActive.toString());
    },
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
          Customer Since
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
      const customer = row.original
      return (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {new Date(customer.createdAt).toLocaleDateString()}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      if (!value || !Array.isArray(value)) return true
      
      const cellValue = row.getValue(id)
      if (!cellValue || typeof cellValue === 'object' && Object.keys(cellValue).length === 0) return true
      
      const date = new Date(cellValue as string | number | Date)
      if (isNaN(date.getTime())) return true
      
      const [start, end] = value
      
      if (!start && !end) return true
      
      if (start && !end) {
        const startDate = new Date(start)
        return isNaN(startDate.getTime()) ? true : date >= startDate
      }
      
      if (!start && end) {
        const endDate = new Date(end)
        return isNaN(endDate.getTime()) ? true : date <= endDate
      }
      
      const startDate = new Date(start)
      const endDate = new Date(end)
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return true
      
      return date >= startDate && date <= endDate
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const customer = row.original
      return (
        <div className="flex items-center gap-2">
          <Link href={`/customers/form?customerId=${customer.id}`}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/tickets/form?customerId=${customer.id}&from=customers`}>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
] 