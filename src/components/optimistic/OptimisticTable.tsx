"use client";

import React, { useState, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Check, X, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OptimisticTableRow {
  id: string | number;
  data: Record<string, any>;
  isOptimistic?: boolean;
  isDeleting?: boolean;
  isEditing?: boolean;
}

interface OptimisticTableColumn<T> {
  key: string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
}

interface OptimisticTableProps<T extends OptimisticTableRow> {
  columns: OptimisticTableColumn<T>[];
  data: T[];
  onAdd?: (row: Omit<T, 'id'>) => Promise<T>;
  onUpdate?: (id: string | number, data: Partial<T['data']>) => Promise<T>;
  onDelete?: (id: string | number) => Promise<void>;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  showActions?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
  rowClassName?: string | ((row: T) => string);
}

export function OptimisticTable<T extends OptimisticTableRow>({
  columns,
  data,
  onAdd,
  onUpdate,
  onDelete,
  onSort,
  sortColumn,
  sortDirection,
  showActions = true,
  emptyState,
  className,
  rowClassName
}: OptimisticTableProps<T>) {
  const [optimisticData, setOptimisticData] = useState<T[]>(data);
  const [editingRow, setEditingRow] = useState<string | number | null>(null);
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    setOptimisticData(data);
  }, [data]);

  const handleAdd = async (newRow: Omit<T, 'id'>) => {
    if (!onAdd) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticRow = {
      ...newRow,
      id: tempId,
      isOptimistic: true,
    } as T;

    // Optimistic update
    setOptimisticData(prev => [...prev, optimisticRow]);

    try {
      startTransition(async () => {
        const realRow = await onAdd(newRow);
        setOptimisticData(prev => 
          prev.map(row => 
            row.id === tempId ? { ...realRow, isOptimistic: false } : row
          )
        );
      });
    } catch (error) {
      // Revert optimistic update
      setOptimisticData(prev => prev.filter(row => row.id !== tempId));
      throw error;
    }
  };

  const handleUpdate = async (id: string | number, updates: Partial<T['data']>) => {
    if (!onUpdate) return;

    const originalRow = optimisticData.find(row => row.id === id);
    if (!originalRow) return;

    // Optimistic update
    setOptimisticData(prev => 
      prev.map(row => 
        row.id === id 
          ? { ...row, data: { ...row.data, ...updates }, isOptimistic: true }
          : row
      )
    );

    try {
      startTransition(async () => {
        const updatedRow = await onUpdate(id, updates);
        setOptimisticData(prev => 
          prev.map(row => 
            row.id === id ? { ...updatedRow, isOptimistic: false } : row
          )
        );
        setEditingRow(null);
      });
    } catch (error) {
      // Revert optimistic update
      setOptimisticData(prev => 
        prev.map(row => 
          row.id === id ? originalRow : row
        )
      );
      throw error;
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!onDelete) return;

    // Optimistic update
    setOptimisticData(prev => 
      prev.map(row => 
        row.id === id ? { ...row, isDeleting: true } : row
      )
    );

    try {
      startTransition(async () => {
        await onDelete(id);
        setOptimisticData(prev => prev.filter(row => row.id !== id));
      });
    } catch (error) {
      // Revert optimistic update
      setOptimisticData(prev => 
        prev.map(row => 
          row.id === id ? { ...row, isDeleting: false } : row
        )
      );
      throw error;
    }
  };

  const handleSort = (column: string) => {
    if (!onSort) return;
    
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column, newDirection);
  };

  if (optimisticData.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        {emptyState || (
          <div className="text-gray-500 dark:text-gray-400">
            <p>No data available</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                  column.sortable && "cursor-pointer hover:text-gray-700 dark:hover:text-gray-300",
                  column.width && `w-${column.width}`
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {column.sortable && sortColumn === column.key && (
                    <span className="text-blue-500">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {showActions && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
          {optimisticData.map((row, index) => (
            <tr
              key={row.id}
              className={cn(
                "hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-150",
                row.isOptimistic && "bg-blue-50 dark:bg-blue-900/20",
                row.isDeleting && "opacity-50 bg-red-50 dark:bg-red-900/20",
                typeof rowClassName === 'function' ? rowClassName(row) : rowClassName
              )}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  <div className="relative">
                    {column.render 
                      ? column.render(row.data[column.key], row)
                      : row.data[column.key]
                    }
                    {row.isOptimistic && (
                      <div className="absolute -top-1 -right-1">
                        <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>
                </td>
              ))}
              
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {!row.isDeleting && onUpdate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingRow(editingRow === row.id ? null : row.id)}
                        disabled={row.isOptimistic}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {!row.isDeleting && onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(row.id)}
                        disabled={row.isOptimistic}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {row.isDeleting && (
                      <div className="flex items-center space-x-1 text-red-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-xs">Deleting...</span>
                      </div>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {isPending && (
        <div className="flex items-center justify-center py-4 border-t border-gray-200 dark:border-gray-800">
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-500">Updating table...</span>
        </div>
      )}
    </div>
  );
}

interface SimpleOptimisticTableProps {
  columns: { key: string; header: string }[];
  data: Record<string, any>[];
  onUpdate?: (index: number, data: Record<string, any>) => Promise<void>;
  onDelete?: (index: number) => Promise<void>;
  className?: string;
}

export function SimpleOptimisticTable({
  columns,
  data,
  onUpdate,
  onDelete,
  className
}: SimpleOptimisticTableProps) {
  const tableData = data.map((item, index) => ({
    id: index,
    data: item,
  }));

  return (
    <OptimisticTable
      columns={columns}
      data={tableData}
      onUpdate={onUpdate ? async (id, updates) => {
        await onUpdate(id as number, updates);
        return { id, data: updates };
      } : undefined}
      onDelete={onDelete ? async (id) => {
        await onDelete(id as number);
      } : undefined}
      className={className}
    />
  );
}