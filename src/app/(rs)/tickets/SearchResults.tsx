"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Ticket {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  tech: string;
  createdAt: Date;
  updatedAt: Date;
  customerId: number;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string;
}

interface SearchResultsProps {
  results: Ticket[];
  className?: string;
}

const getStatusColor = (completed: boolean) => {
  return completed 
    ? "bg-green-100 text-green-800" 
    : "bg-yellow-100 text-yellow-800";
};

const getStatusText = (completed: boolean) => {
  return completed ? "Completed" : "Pending";
};

export function SearchResults({ results, className }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">
        Search Results ({results.length})
      </h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                {ticket.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ticket.description}
              </p>
              
                             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                 <User className="h-4 w-4" />
                 <span>{ticket.customerFirstName} {ticket.customerLastName}</span>
               </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
              </div>
              
                             <div className="flex items-center gap-2">
                 <Badge 
                   className={getStatusColor(ticket.completed)}
                   variant="secondary"
                 >
                   {getStatusText(ticket.completed)}
                 </Badge>
                 <Badge 
                   className="bg-blue-100 text-blue-800"
                   variant="secondary"
                 >
                   {ticket.tech}
                 </Badge>
               </div>
              
              <div className="flex items-center justify-between pt-2">
                <Button asChild size="sm">
                  <Link href={`/tickets/${ticket.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 