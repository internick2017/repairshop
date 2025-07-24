import { useState, useCallback } from "react";
import { ActionResponse } from "../safe-actions";

interface UseSafeActionOptions<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
}

export function useSafeAction<TInput, TData, TError = string>(
  action: (input: TInput) => Promise<ActionResponse<TData>>,
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
        const result = await action(input);

        if (result.serverError) {
          const errorMessage = result.serverError as TError;
          setError(errorMessage);
          options?.onError?.(errorMessage);
        } else if (result.data) {
          setData(result.data);
          options?.onSuccess?.(result.data);
        }
      } catch (err) {
        const errorMessage = (err as Error).message as TError;
        setError(errorMessage);
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