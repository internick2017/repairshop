"use client";

import { Ticket } from "@/types";

export async function fetchTickets(): Promise<{ tickets: Ticket[] }> {
  const response = await fetch('/api/tickets', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tickets: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return { tickets: data.tickets || data }; // Ensure consistent format
}

export async function fetchTicket(id: string): Promise<Ticket> {
  const response = await fetch(`/api/tickets/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ticket: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.ticket || data;
}