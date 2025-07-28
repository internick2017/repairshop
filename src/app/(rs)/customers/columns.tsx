"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Phone, User, Calendar, Edit, Trash2, Plus, ArrowUpDown } from "lucide-react"
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
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
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
    header: "Email",
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
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const customer = row.original
      return (
        <Badge variant={customer.active ? "default" : "secondary"}>
          {customer.active ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer Since
          <ArrowUpDown className="ml-2 h-4 w-4" />
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