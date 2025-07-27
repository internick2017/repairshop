"use client";

import React, { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Check, X, Edit, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OptimisticCardProps {
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode;
  onUpdate?: (data: any) => Promise<void>;
  onDelete?: () => Promise<void>;
  isOptimistic?: boolean;
  isDeleting?: boolean;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
}

export function OptimisticCard({
  title,
  content,
  actions,
  onUpdate,
  onDelete,
  isOptimistic = false,
  isDeleting = false,
  className,
  variant = 'default'
}: OptimisticCardProps) {
  const [localOptimistic, setLocalOptimistic] = useState(false);
  const [localDeleting, setLocalDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isCardOptimistic = isOptimistic || localOptimistic;
  const isCardDeleting = isDeleting || localDeleting;

  const handleUpdate = async (data: any) => {
    if (!onUpdate) return;

    setLocalOptimistic(true);

    try {
      startTransition(async () => {
        await onUpdate(data);
        setLocalOptimistic(false);
      });
    } catch (error) {
      setLocalOptimistic(false);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setLocalDeleting(true);

    try {
      startTransition(async () => {
        await onDelete();
      });
    } catch (error) {
      setLocalDeleting(false);
      throw error;
    }
  };

  const getCardVariant = () => {
    switch (variant) {
      case 'outlined':
        return "bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-800";
      case 'elevated':
        return "bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800";
      default:
        return "bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg p-6 transition-all duration-200 relative",
        getCardVariant(),
        isCardOptimistic && "ring-2 ring-blue-500 ring-opacity-50 bg-blue-50/50 dark:bg-blue-900/10",
        isCardDeleting && "opacity-50 ring-2 ring-red-500 ring-opacity-50 bg-red-50/50 dark:bg-red-900/10",
        className
      )}
    >
      {/* Optimistic/Deleting indicator */}
      {(isCardOptimistic || isCardDeleting) && (
        <div className="absolute top-4 right-4">
          <div className={cn(
            "flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium",
            isCardOptimistic && "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
            isCardDeleting && "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
          )}>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>{isCardDeleting ? 'Deleting...' : 'Saving...'}</span>
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className={cn(
          "text-lg font-semibold text-gray-900 dark:text-gray-100",
          isCardDeleting && "line-through text-gray-500"
        )}>
          {title}
        </h3>
      </div>

      {/* Card Content */}
      <div className={cn(
        "mb-4",
        isCardDeleting && "opacity-70"
      )}>
        {content}
      </div>

      {/* Card Actions */}
      {(actions || onUpdate || onDelete) && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {actions}
          </div>
          
          <div className="flex items-center space-x-2">
            {onUpdate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUpdate({})}
                disabled={isCardOptimistic || isCardDeleting}
                className="h-8"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isCardOptimistic || isCardDeleting}
                className="h-8 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface OptimisticCardGridProps {
  cards: Array<{
    id: string | number;
    title: string;
    content: React.ReactNode;
    actions?: React.ReactNode;
    isOptimistic?: boolean;
    isDeleting?: boolean;
  }>;
  onUpdate?: (id: string | number, data: any) => Promise<void>;
  onDelete?: (id: string | number) => Promise<void>;
  onAdd?: (card: any) => Promise<void>;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
  cardVariant?: 'default' | 'outlined' | 'elevated';
}

export function OptimisticCardGrid({
  cards,
  onUpdate,
  onDelete,
  onAdd,
  columns = 3,
  className,
  cardVariant = 'default'
}: OptimisticCardGridProps) {
  const [optimisticCards, setOptimisticCards] = useState(cards);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    setOptimisticCards(cards);
  }, [cards]);

  const handleAdd = async (newCard: any) => {
    if (!onAdd) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticCard = {
      id: tempId,
      ...newCard,
      isOptimistic: true,
    };

    // Optimistic update
    setOptimisticCards(prev => [...prev, optimisticCard]);

    try {
      startTransition(async () => {
        await onAdd(newCard);
        // Remove optimistic card after real one is added
        setOptimisticCards(prev => prev.filter(card => card.id !== tempId));
      });
    } catch (error) {
      // Revert optimistic update
      setOptimisticCards(prev => prev.filter(card => card.id !== tempId));
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, data: any) => {
    if (!onUpdate) return;

    const originalCard = optimisticCards.find(card => card.id === id);
    if (!originalCard) return;

    // Optimistic update
    setOptimisticCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, isOptimistic: true } : card
      )
    );

    try {
      startTransition(async () => {
        await onUpdate(id, data);
        setOptimisticCards(prev => 
          prev.map(card => 
            card.id === id ? { ...card, isOptimistic: false } : card
          )
        );
      });
    } catch (error) {
      // Revert optimistic update
      setOptimisticCards(prev => 
        prev.map(card => 
          card.id === id ? originalCard : card
        )
      );
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!onDelete) return;

    // Optimistic update
    setOptimisticCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, isDeleting: true } : card
      )
    );

    try {
      startTransition(async () => {
        await onDelete(id);
        setOptimisticCards(prev => prev.filter(card => card.id !== id));
      });
    } catch (error) {
      // Revert optimistic update
      setOptimisticCards(prev => 
        prev.map(card => 
          card.id === id ? { ...card, isDeleting: false } : card
        )
      );
      throw error;
    }
  };

  const gridColumns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className={cn("grid gap-6", gridColumns[columns])}>
        {optimisticCards.map((card) => (
          <OptimisticCard
            key={card.id}
            title={card.title}
            content={card.content}
            actions={card.actions}
            onUpdate={onUpdate ? (data) => handleUpdate(card.id, data) : undefined}
            onDelete={onDelete ? () => handleDelete(card.id) : undefined}
            isOptimistic={card.isOptimistic}
            isDeleting={card.isDeleting}
            variant={cardVariant}
          />
        ))}
      </div>
      
      {isPending && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-500">Updating cards...</span>
        </div>
      )}
    </div>
  );
}