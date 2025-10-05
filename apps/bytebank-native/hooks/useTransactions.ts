import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { TransactionsQueriesService } from '@fiap-tech-challenge/database/queries';
import {
  type Transaction,
  mapITransactionArrayToTransactionArray
} from '@/utils/transactionMapper';

export { type Transaction } from '@/utils/transactionMapper';

/**
 * Representa um intervalo de datas para filtros de transação
 *
 * @interface DateRange
 * @property {Date} [from] - Data de início do intervalo (opcional)
 * @property {Date} [to] - Data de fim do intervalo (opcional)
 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/**
 * Estado da paginação para listagem de transações
 *
 * @interface PaginationState
 * @property {number} page - Página atual (começando em 0)
 * @property {number} limit - Limite de items por página
 * @property {number | null} count - Total de items disponíveis (null se desconhecido)
 */
export interface PaginationState {
  page: number;
  limit: number;
  count: number | null;
}

/**
 * Estado dos filtros aplicados à listagem de transações
 *
 * @interface FiltersState
 * @property {string} searchTerm - Termo de busca textual
 * @property {string} typeFilter - Filtro por tipo de transação ('' para todos)
 * @property {DateRange} [dateRange] - Filtro por intervalo de datas (opcional)
 */
export interface FiltersState {
  searchTerm: string;
  typeFilter: string;
  dateRange?: DateRange;
}

function useDebouncedCallback<T extends (...args: unknown[]) => void>(callback: T, delay: number) {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
}

const initialPaginationState: PaginationState = {
  page: 1,
  limit: 10,
  count: null,
};

const initialFilters: FiltersState = {
  searchTerm: '',
  typeFilter: '',
  dateRange: undefined,
};

/**
 * Hook personalizado para gerenciar transações com paginação, filtros e busca
 *
 * Fornece funcionalidades completas de CRUD para transações, incluindo:
 * - Listagem paginada com carregamento incremental
 * - Filtros por texto, tipo e intervalo de datas
 * - Cache otimizado e debouncing para performance
 * - Estados de loading separados para diferentes operações
 * - Tratamento de erros robusto
 *
 * @returns {Object} Objeto contendo:
 *   - transactions: Array de transações carregadas
 *   - hasMoreTransactions: Indica se há mais transações para carregar
 *   - loadingAllTransactions: Estado de loading inicial/refresh
 *   - loadingMoreTransactions: Estado de loading para carregamento incremental
 *   - error: Mensagem de erro atual (null se sem erro)
 *   - filters: Estado atual dos filtros
 *   - pagination: Estado atual da paginação
 *   - fetchTransactions: Função para buscar transações
 *   - loadMoreTransactions: Função para carregar mais transações
 *   - resetTransactions: Função para resetar lista e recarregar
 *   - updateFilters: Função para atualizar filtros
 *   - resetFilters: Função para limpar todos os filtros
 *
 * @example
 * ```typescript
 * const {
 *   transactions,
 *   loadingAllTransactions,
 *   error,
 *   filters,
 *   updateFilters,
 *   loadMoreTransactions,
 *   resetTransactions
 * } = useTransactions();
 *
 * // Atualizar filtros
 * updateFilters({
 *   searchTerm: 'pagamento',
 *   typeFilter: TransactionType.DEBIT
 * });
 *
 * // Carregar mais transações
 * if (hasMoreTransactions) {
 *   loadMoreTransactions();
 * }
 * ```
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [loadingAllTransactions, setLoadingAllTransactions] = useState(true);
  const [loadingMoreTransactions, setLoadingMoreTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>(initialPaginationState);

  const transactionsService = useMemo(() => new TransactionsQueriesService(supabase), []);

  const getQueryParams = useCallback(
    (from: number, to: number, customFilters?: FiltersState) => {
      const activeFilters = customFilters || filters;
      const { searchTerm, typeFilter, dateRange } = activeFilters;

      const queryParams: Record<string, unknown> = {
        from,
        to,
      };

      if (searchTerm.trim()) queryParams.term = searchTerm.trim().toLowerCase();
      if (typeFilter) queryParams.type = typeFilter;
      if (dateRange?.from) queryParams.startDate = dateRange.from.toISOString();
      if (dateRange?.to) queryParams.endDate = dateRange.to.toISOString();

      return queryParams;
    },
    [filters.searchTerm, filters.typeFilter, filters.dateRange?.from, filters.dateRange?.to]
  );

  const fetchAllTransactions = useCallback(async () => {
    try {
      setError(null);
      const queryParams = getQueryParams(0, pagination.limit - 1);
      const response = await transactionsService.getAllTransactions(queryParams);

      if (response.data) {
        const mappedTransactions: Transaction[] = mapITransactionArrayToTransactionArray(response.data);

        setTransactions(mappedTransactions);
        setLoadingAllTransactions(false);

        if (response.count !== null) {
          setHasMoreTransactions(mappedTransactions.length < response.count);
          setPagination(prev => ({
            ...prev,
            count: response.count,
            page: prev.page + 1,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações');
      setLoadingAllTransactions(false);
    }
  }, [getQueryParams, pagination.limit, transactionsService]);

  const fetchMoreTransactions = useCallback(async () => {
    if (!hasMoreTransactions) return;

    try {
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;

      const queryParams = getQueryParams(from, to);
      const response = await transactionsService.getAllTransactions(queryParams);

      if (response.data) {
        const mappedTransactions: Transaction[] = mapITransactionArrayToTransactionArray(response.data);

        const newTransactions = [...transactions, ...mappedTransactions];
        setTransactions(newTransactions);
        setHasMoreTransactions(response.count !== null && newTransactions.length < response.count);

        setPagination(prev => ({
          ...prev,
          count: response.count,
          page: prev.page + 1,
        }));
      }
    } catch (err) {
      console.error('Error fetching more transactions:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar mais transações');
    }
  }, [getQueryParams, hasMoreTransactions, pagination.limit, pagination.page, transactions, transactionsService]);

  const debouncedFetchMoreTransactions = useDebouncedCallback(() => {
    if (hasMoreTransactions && !loadingMoreTransactions) {
      setLoadingMoreTransactions(true);
      fetchMoreTransactions().finally(() => setLoadingMoreTransactions(false));
    }
  }, 200);

  const resetStateAndFetch = useCallback(async (customFilters: FiltersState = initialFilters) => {
    setFilters(customFilters);
    setPagination(initialPaginationState);
    setTransactions([]);
    setHasMoreTransactions(true);
    setLoadingAllTransactions(true);

    try {
      setError(null);
      const queryParams = getQueryParams(0, initialPaginationState.limit - 1, customFilters);
      const response = await transactionsService.getAllTransactions(queryParams);

      if (response.data) {
        const mappedTransactions: Transaction[] = mapITransactionArrayToTransactionArray(response.data);

        setTransactions(mappedTransactions);
        setLoadingAllTransactions(false);

        if (response.count !== null) {
          setHasMoreTransactions(mappedTransactions.length < response.count);
          setPagination(prev => ({
            ...prev,
            count: response.count,
            page: prev.page + 1,
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar transações');
      setLoadingAllTransactions(false);
    }
  }, [getQueryParams, transactionsService]);

  const clearFilters = useCallback(async () => {
    await resetStateAndFetch(initialFilters);
  }, [resetStateAndFetch]);

  const refreshTransactions = useCallback(() => {
    resetStateAndFetch(filters);
  }, [resetStateAndFetch, filters]);

  const applyFilters = useCallback(() => {
    resetStateAndFetch(filters);
  }, [resetStateAndFetch, filters]);

  const debouncedApplyFilters = useDebouncedCallback(() => {
    applyFilters();
  }, 300);

  const handleSyncTransactions = useCallback((
    transaction: Transaction,
    action: 'create' | 'edit' | 'delete',
  ) => {
    setTransactions(prevTransactions => {
      if (action === 'create') {
        return [transaction, ...prevTransactions];
      }

      const index = prevTransactions.findIndex(t => t.id === transaction.id);

      if (index === -1) {
        return prevTransactions;
      }

      if (action === 'edit') {
        const updated = [...prevTransactions];
        updated[index] = transaction;
        return updated;
      }

      if (action === 'delete') {
        return prevTransactions.filter(t => t.id !== transaction.id);
      }

      return prevTransactions;
    });
  }, []);

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      setLoadingAllTransactions(true);
      fetchAllTransactions();
    }
  }, [fetchAllTransactions, isInitialized]);

  const transactionCount = useMemo(() => transactions.length, [transactions.length]);
  const hasTransactions = useMemo(() => transactions.length > 0, [transactions.length]);
  const isFilterActive = useMemo(() =>
    filters.searchTerm !== '' ||
    filters.typeFilter !== '' ||
    filters.dateRange !== undefined
  , [filters.searchTerm, filters.typeFilter, filters.dateRange]);

  return useMemo(() => ({
    transactions,
    transactionCount,
    hasTransactions,
    loading: loadingAllTransactions,
    loadingMore: loadingMoreTransactions,
    hasMore: hasMoreTransactions,
    error,
    filters,
    pagination,
    isFilterActive,
    setFilters,
    refreshTransactions,
    fetchMoreTransactions: debouncedFetchMoreTransactions,
    applyFilters,
    debouncedApplyFilters,
    clearFilters,
    handleSyncTransactions,
  }), [
    transactions,
    transactionCount,
    hasTransactions,
    loadingAllTransactions,
    loadingMoreTransactions,
    hasMoreTransactions,
    error,
    filters,
    pagination,
    isFilterActive,
    setFilters,
    refreshTransactions,
    debouncedFetchMoreTransactions,
    applyFilters,
    debouncedApplyFilters,
    clearFilters,
    handleSyncTransactions,
  ]);
}
