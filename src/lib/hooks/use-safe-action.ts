import { useState, useCallback } from "react";
import { toast } from "sonner";
import { captureException, addBreadcrumb } from "@/lib/sentry-utils";

interface UseSafeActionOptions<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
  showToast?: boolean; // Option to enable/disable automatic toast notifications
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string | ((error: TError) => string);
}

export function useSafeAction<TInput, TData, TError = string>(
  action: (input: TInput) => Promise<{ data?: TData; serverError?: unknown }>,
  options?: UseSafeActionOptions<TData, TError>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<TError | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);
      setError(null);

      try {
        // Add breadcrumb for action execution
        addBreadcrumb({
          message: `Executing safe action`,
          category: 'action',
          data: { action: action.name },
        });

        const result = await action(input);

        // Handle Safe Actions response structure
        if (result?.serverError) {
          const errorMessage = (typeof result.serverError === 'string' 
            ? result.serverError 
            : (result.serverError as Record<string, unknown>)?.serverError || 'An error occurred') as TError;
          setError(errorMessage);
          
          // Log to Sentry
          captureException(new Error(String(errorMessage)), {
            tags: {
              action: 'safe-action',
              type: 'server-error',
            },
            extra: {
              input,
              serverError: result.serverError,
            },
            level: 'warning',
          });
          
          // Show error toast if enabled
          if (options?.showToast !== false) {
            const toastMessage = options?.errorMessage 
              ? (typeof options.errorMessage === 'function' 
                  ? options.errorMessage(errorMessage) 
                  : options.errorMessage)
              : String(errorMessage);
            toast.error(toastMessage);
          }
          
          options?.onError?.(errorMessage);
        } else if (result?.data) {
          setData(result.data);
          
          // Show success toast if enabled
          if (options?.showToast !== false && options?.successMessage) {
            const toastMessage = typeof options.successMessage === 'function' 
              ? options.successMessage(result.data) 
              : options.successMessage;
            toast.success(toastMessage);
          }
          
          options?.onSuccess?.(result.data);
        }
      } catch (err) {
        const errorMessage = (err as Error).message as TError;
        setError(errorMessage);
        
        // Show error toast for caught exceptions
        if (options?.showToast !== false) {
          const toastMessage = options?.errorMessage 
            ? (typeof options.errorMessage === 'function' 
                ? options.errorMessage(errorMessage) 
                : options.errorMessage)
            : String(errorMessage);
          toast.error(toastMessage);
        }
        
        options?.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
        options?.onSettled?.();
      }
    },
    [action, options]
  );

  return {
    execute,
    isLoading,
    error,
    data,
    reset: useCallback(() => {
      setError(null);
      setData(null);
    }, []),
  };
} 