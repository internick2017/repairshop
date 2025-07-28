"use client";

import { Customer } from "@/types";

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch('/api/customers', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch customers: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.customers || data; // Handle different response formats
}

export async function fetchCustomer(id: string): Promise<Customer> {
  const response = await fetch(`/api/customers/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch customer: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.customer || data;
}