"use client";

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { addBreadcrumb, captureException } from '@/lib/sentry-utils';

interface OptimisticState<T> {
  data: T | null;
  isOptimistic: boolean;
  originalData: T | null;
  pendingActions: Set<string>;
}

interface OptimisticUpdateOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  errorMessage?: string;
  revertDelay?: number;
}

export function useOptimisticUpdates<T>() {
  const [state, setState] = useState<OptimisticState<T>>({
    data: null,
    isOptimistic: false,
    originalData: null,
    pendingActions: new Set(),
  });

  const revertTimeoutRef = useRef<NodeJS.Timeout>();

  const setData = useCallback((data: T) => {
    setState(prev => ({
      ...prev,
      data,
      isOptimistic: false,
      originalData: data,
    }));
  }, []);

  const applyOptimisticUpdate = useCallback((
    actionId: string,
    optimisticData: T,
    actualUpdate: () => Promise<T>,
    options: OptimisticUpdateOptions = {}
  ) => {
    const {
      onSuccess,
      onError,
      successMessage,
      errorMessage,
      revertDelay = 5000
    } = options;

    // Store original data if this is the first optimistic update
    setState(prev => {
      const newPendingActions = new Set(prev.pendingActions);
      newPendingActions.add(actionId);

      return {
        data: optimisticData,
        isOptimistic: true,
        originalData: prev.originalData || prev.data,
        pendingActions: newPendingActions,
      };
    });

    addBreadcrumb({
      message: `Optimistic update applied: ${actionId}`,
      category: 'form',
      level: 'info',
      data: { actionId, hasOriginalData: !!state.originalData },
    });

    // Set up automatic revert if the actual update takes too long
    if (revertTimeoutRef.current) {
      clearTimeout(revertTimeoutRef.current);
    }

    revertTimeoutRef.current = setTimeout(() => {
      setState(prev => {
        if (prev.pendingActions.has(actionId)) {
          const newPendingActions = new Set(prev.pendingActions);
          newPendingActions.delete(actionId);

          toast.warning(`Update taking longer than expected - reverting optimistic changes`);

          return {
            data: prev.originalData,
            isOptimistic: newPendingActions.size > 0,
            originalData: newPendingActions.size > 0 ? prev.originalData : null,
            pendingActions: newPendingActions,
          };
        }
        return prev;
      });
    }, revertDelay);

    // Execute the actual update
    actualUpdate()
      .then((result) => {
        // Clear timeout
        if (revertTimeoutRef.current) {
          clearTimeout(revertTimeoutRef.current);
        }

        setState(prev => {
          const newPendingActions = new Set(prev.pendingActions);
          newPendingActions.delete(actionId);

          addBreadcrumb({
            message: `Optimistic update confirmed: ${actionId}`,
            category: 'form',
            level: 'info',
            data: { actionId, remainingActions: newPendingActions.size },
          });

          return {
            data: result,
            isOptimistic: newPendingActions.size > 0,
            originalData: newPendingActions.size > 0 ? prev.originalData : null,
            pendingActions: newPendingActions,
          };
        });

        if (successMessage) {
          toast.success(successMessage);
        }

        onSuccess?.();
      })
      .catch((error) => {
        // Clear timeout
        if (revertTimeoutRef.current) {
          clearTimeout(revertTimeoutRef.current);
        }

        // Revert to original data
        setState(prev => {
          const newPendingActions = new Set(prev.pendingActions);
          newPendingActions.delete(actionId);

          captureException(error, {
            tags: {
              component: 'OptimisticUpdates',
              action: 'update_failed',
              actionId,
            },
            extra: {
              actionId,
              remainingActions: newPendingActions.size,
            },
            level: 'warning',
          });

          return {
            data: prev.originalData,
            isOptimistic: newPendingActions.size > 0,
            originalData: newPendingActions.size > 0 ? prev.originalData : null,
            pendingActions: newPendingActions,
          };
        });

        const message = errorMessage || 'Update failed - changes reverted';
        toast.error(message);

        onError?.(error);
      });
  }, [state.originalData]);

  const revertOptimisticUpdate = useCallback((actionId: string) => {
    setState(prev => {
      const newPendingActions = new Set(prev.pendingActions);
      newPendingActions.delete(actionId);

      addBreadcrumb({
        message: `Optimistic update reverted: ${actionId}`,
        category: 'form',
        level: 'info',
        data: { actionId, remainingActions: newPendingActions.size },
      });

      return {
        data: prev.originalData,
        isOptimistic: newPendingActions.size > 0,
        originalData: newPendingActions.size > 0 ? prev.originalData : null,
        pendingActions: newPendingActions,
      };
    });
  }, []);

  const clearAllOptimisticUpdates = useCallback(() => {
    if (revertTimeoutRef.current) {
      clearTimeout(revertTimeoutRef.current);
    }

    setState(prev => {
      addBreadcrumb({
        message: `All optimistic updates cleared`,
        category: 'form',
        level: 'info',
        data: { clearedActions: prev.pendingActions.size },
      });

      return {
        data: prev.originalData,
        isOptimistic: false,
        originalData: null,
        pendingActions: new Set(),
      };
    });
  }, []);

  const isPending = (actionId: string) => state.pendingActions.has(actionId);

  return {
    data: state.data,
    isOptimistic: state.isOptimistic,
    hasPendingActions: state.pendingActions.size > 0,
    pendingActions: Array.from(state.pendingActions),
    setData,
    applyOptimisticUpdate,
    revertOptimisticUpdate,
    clearAllOptimisticUpdates,
    isPending,
  };
}