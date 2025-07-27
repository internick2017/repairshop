"use client";

import React, { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Minus, Check, X, Loader2 } from 'lucide-react';

interface OptimisticListItem {
  id: string | number;
  content: React.ReactNode;
  isOptimistic?: boolean;
  isDeleting?: boolean;
}

interface OptimisticListProps<T extends OptimisticListItem> {
  items: T[];
  onAdd?: (item: Omit<T, 'id'>) => Promise<T>;
  onRemove?: (id: string | number) => Promise<void>;
  onUpdate?: (id: string | number, item: Partial<T>) => Promise<T>;
  renderItem: (item: T, actions: {
    isOptimistic: boolean;
    isDeleting: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
  }) => React.ReactNode;
  addButton?: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
  itemClassName?: string;
}

export function OptimisticList<T extends OptimisticListItem>({
  items,
  onAdd,
  onRemove,
  onUpdate,
  renderItem,
  addButton,
  emptyState,
  className,
  itemClassName
}: OptimisticListProps<T>) {
  const [optimisticItems, setOptimisticItems] = useState<T[]>(items);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    setOptimisticItems(items);
  }, [items]);

  const handleAdd = async (newItem: Omit<T, 'id'>) => {
    if (!onAdd) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticItem = {
      ...newItem,
      id: tempId,
      isOptimistic: true,
    } as T;

    // Optimistic update
    setOptimisticItems(prev => [...prev, optimisticItem]);

    try {
      startTransition(async () => {
        const realItem = await onAdd(newItem);
        setOptimisticItems(prev => 
          prev.map(item => 
            item.id === tempId ? { ...realItem, isOptimistic: false } : item
          )
        );
      });
    } catch (error) {
      // Revert optimistic update
      setOptimisticItems(prev => prev.filter(item => item.id !== tempId));
      throw error;
    }
  };

  const handleRemove = async (id: string | number) => {
    if (!onRemove) return;

    // Optimistic update
    setOptimisticItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isDeleting: true } : item
      )
    );

    try {
      startTransition(async () => {
        await onRemove(id);
        setOptimisticItems(prev => prev.filter(item => item.id !== id));
      });
    } catch (error) {
      // Revert optimistic update
      setOptimisticItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, isDeleting: false } : item
        )
      );
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, updates: Partial<T>) => {
    if (!onUpdate) return;

    const originalItem = optimisticItems.find(item => item.id === id);
    if (!originalItem) return;

    // Optimistic update
    setOptimisticItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates, isOptimistic: true } : item
      )
    );

    try {
      startTransition(async () => {
        const updatedItem = await onUpdate(id, updates);
        setOptimisticItems(prev => 
          prev.map(item => 
            item.id === id ? { ...updatedItem, isOptimistic: false } : item
          )
        );
      });
    } catch (error) {
      // Revert optimistic update
      setOptimisticItems(prev => 
        prev.map(item => 
          item.id === id ? originalItem : item
        )
      );
      throw error;
    }
  };

  if (optimisticItems.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        {emptyState || (
          <div className="text-gray-500 dark:text-gray-400">
            <p>No items found</p>
          </div>
        )}
        {addButton}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {optimisticItems.map(item => (
        <div
          key={item.id}
          className={cn(
            "relative transition-all duration-200",
            item.isOptimistic && "opacity-70",
            item.isDeleting && "opacity-50 animate-pulse",
            itemClassName
          )}
        >
          {renderItem(item, {
            isOptimistic: Boolean(item.isOptimistic),
            isDeleting: Boolean(item.isDeleting),
            onEdit: onUpdate ? () => handleUpdate(item.id, {}) : undefined,
            onDelete: onRemove ? () => handleRemove(item.id) : undefined,
          })}
          
          {/* Loading indicator for optimistic operations */}
          {(item.isOptimistic || item.isDeleting) && (
            <div className="absolute top-2 right-2">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      ))}
      
      {addButton && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          {addButton}
        </div>
      )}
      
      {isPending && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-500">Updating...</span>
        </div>
      )}
    </div>
  );
}

interface SimpleOptimisticListProps {
  items: string[];
  onAdd?: (item: string) => Promise<void>;
  onRemove?: (index: number) => Promise<void>;
  className?: string;
}

export function SimpleOptimisticList({
  items,
  onAdd,
  onRemove,
  className
}: SimpleOptimisticListProps) {
  const listItems = items.map((item, index) => ({
    id: index,
    content: item,
  }));

  return (
    <OptimisticList
      items={listItems}
      onAdd={onAdd ? async (item) => {
        await onAdd(item.content as string);
        return { id: Date.now(), content: item.content };
      } : undefined}
      onRemove={onRemove ? async (id) => {
        await onRemove(id as number);
      } : undefined}
      renderItem={(item, { isOptimistic, isDeleting, onDelete }) => (
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <span className={cn(
            "flex-1",
            isDeleting && "line-through text-gray-500"
          )}>
            {item.content}
          </span>
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      className={className}
    />
  );
}