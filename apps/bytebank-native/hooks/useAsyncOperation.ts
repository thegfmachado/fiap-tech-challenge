import { useState, useCallback } from 'react';

/**
 * Options for configuring async operation behavior
 */
export interface UseAsyncOperationOptions {
  /** Custom error handler - receives the error and should return the error message to display */
  onError?: (error: unknown) => string;
  /** Custom success handler - receives the result of the operation */
  onSuccess?: (result?: unknown) => void;
  /** Whether to automatically reset the error state when starting a new operation */
  autoResetError?: boolean;
}

/**
 * Result object returned by useAsyncOperation hook
 */
export interface AsyncOperationState<T = unknown> {
  /** Whether the operation is currently running */
  isLoading: boolean;
  /** Error message if the operation failed */
  error: string | null;
  /** Result data from the last successful operation */
  data: T | null;
  /** Execute the async operation */
  execute: (operation: () => Promise<T>) => Promise<T | null>;
  /** Reset the state (loading, error, and data) */
  reset: () => void;
  /** Clear only the error state */
  clearError: () => void;
}

/**
 * Hook personalizado para gerenciar operações assíncronas com estados de carregamento e erro
 * 
 * @param options Opções de configuração para o hook
 * @returns Objeto contendo estado e métodos para gerenciar operações assíncronas
 * 
 * @example
 * ```tsx
 * const { isLoading, error, execute, reset } = useAsyncOperation({
 *   onError: (error) => `Failed to save: ${error.message}`,
 *   onSuccess: () => Alert.alert('Success', 'Operation completed!')
 * });
 * 
 * const handleSave = async () => {
 *   await execute(async () => {
 *     return await saveTransaction(data);
 *   });
 * };
 * ```
 */
export function useAsyncOperation<T = unknown>(
  options: UseAsyncOperationOptions = {}
): AsyncOperationState<T> {
  const {
    onError,
    onSuccess,
    autoResetError = true,
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    try {
      setIsLoading(true);
      
      if (autoResetError) {
        setError(null);
      }

      const result = await operation();
      setData(result);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const errorMessage = onError 
        ? onError(err)
        : err instanceof Error 
          ? err.message 
          : 'Ocorreu um erro inesperado';
      
      setError(errorMessage);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [onError, onSuccess, autoResetError]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
    clearError,
  };
}

/**
 * Specialized version of useAsyncOperation for operations that don't return data
 * Useful for delete operations, void functions, etc.
 */
export function useAsyncAction(
  options: UseAsyncOperationOptions = {}
): Omit<AsyncOperationState<void>, 'data'> {
  const { isLoading, error, execute, reset, clearError } = useAsyncOperation<void>(options);

  return {
    isLoading,
    error,
    execute,
    reset,
    clearError,
  };
}