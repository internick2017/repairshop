// Customer Types
export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  notes?: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Ticket Types
export interface Ticket {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  tech: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: number;
  customer?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

// Search-specific ticket interface with flattened customer data
export interface SearchTicket extends Ticket {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  isActive: boolean;
}

// Search Types
export interface SearchParams {
  query: string;
  page?: number;
  limit?: number;
}

// Table Props
export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T) => React.ReactNode;
}

// Form Types
export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
}

// Action Response Types
export interface ActionError {
  code: string;
  message: string;
  field?: string;
}

export interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: ActionError;
}