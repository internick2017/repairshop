"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, User } from "lucide-react";
import Link from "next/link";
import { Customer } from "@/types";

interface SearchResultsProps {
  results: Customer[];
  className?: string;
}

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
        {results.map((customer) => (
          <Card key={customer.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                             <CardTitle className="flex items-center gap-2 text-lg">
                 <User className="h-5 w-5" />
                 {customer.firstName} {customer.lastName}
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary">
                  Customer since {new Date(customer.createdAt).toLocaleDateString()}
                </Badge>
                <Button asChild size="sm">
                  <Link href={`/customers/${customer.id}`}>
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