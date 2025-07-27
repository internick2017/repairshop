"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { memo } from "react";

interface SearchButtonProps {
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const SearchButton = memo(function SearchButton({ 
  children = "Search", 
  className,
  variant = "default",
  size = "default"
}: SearchButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending}
      className={className}
      variant={variant}
      size={size}
      aria-busy={pending}
      aria-label={pending ? "Searching, please wait" : undefined}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          <span aria-live="polite" aria-atomic="true">Searching...</span>
        </>
      ) : (
        <>
          <Search className="mr-2 h-4 w-4" aria-hidden="true" />
          {children}
        </>
      )}
    </Button>
  );
}); 