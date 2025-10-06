import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { TransactionType } from '@fiap-tech-challenge/models';

/**
 * Estatísticas financeiras para o dashboard da home
 */
export interface DashboardStats {
  /** Saldo total (entradas - saídas) */
  balance: number;
  /** Total de entradas */
  totalIncome: number;
  /** Total de saídas */
  totalExpenses: number;
  /** Percentual de entradas em relação ao total movimentado */
  incomePercentage: number;
  /** Percentual de saídas em relação ao total movimentado */
  expensePercentage: number;
  /** Número total de transações */
  totalTransactions: number;
}

/**
 * Hook para gerenciar dados do dashboard da home
 *
 * Fornece estatísticas calculadas das transações, incluindo:
 * - Saldo total, entradas e saídas
 * - Percentuais para exibição na barra de progresso
 * - Estados de loading e erro herdados do useTransactions
 *
 * @returns Objeto com estatísticas, transações recentes e estados
 *
 * @example
 * ```tsx
 * const {
 *   stats,
 *   recentTransactions,
 *   loading,
 *   error,
 *   refreshData
 * } = useHomeDashboard();
 *
 * // Usar stats para exibir resumo financeiro
 * // Usar recentTransactions para lista (limitado a 3 itens)
 * ```
 */
export function useHomeDashboard() {
  const {
    transactions,
    loading,
    error,
    refreshTransactions,
    hasTransactions,
  } = useTransactions();

  /**
   * Calcula estatísticas financeiras baseadas nas transações
   */
  const stats = useMemo((): DashboardStats => {
    if (!hasTransactions) {
      return {
        balance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        incomePercentage: 0,
        expensePercentage: 0,
        totalTransactions: 0,
      };
    }

    const totalIncome = transactions
      .filter(t => t.type === TransactionType.CREDIT)
      .reduce((sum, t) => sum + t.value, 0);

    const totalExpenses = transactions
      .filter(t => t.type === TransactionType.DEBIT)
      .reduce((sum, t) => sum + t.value, 0);

    const balance = totalIncome - totalExpenses;
    const totalMovement = totalIncome + totalExpenses;

    const incomePercentage = totalMovement > 0 ? (totalIncome / totalMovement) * 100 : 0;
    const expensePercentage = totalMovement > 0 ? (totalExpenses / totalMovement) * 100 : 0;

    return {
      balance,
      totalIncome,
      totalExpenses,
      incomePercentage,
      expensePercentage,
      totalTransactions: transactions.length,
    };
  }, [transactions, hasTransactions]);

  /**
   * Transações recentes dos últimos 15 dias (ordenadas por data)
   */
  const recentTransactions = useMemo(() => {
    const fifteenDaysAgo = new Date();
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

    return [...transactions]
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= fifteenDaysAgo;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  /**
   * Verifica se há dados suficientes para exibir estatísticas
   */
  const hasStats = useMemo(() => {
    return hasTransactions && (stats.totalIncome > 0 || stats.totalExpenses > 0);
  }, [hasTransactions, stats.totalIncome, stats.totalExpenses]);

  return {
    stats,
    recentTransactions,
    loading,
    error,
    hasTransactions,
    hasStats,
    refreshData: refreshTransactions,
  };
}

/**
 * Hook especializado para o componente de resumo de entrada/saída
 *
 * @returns Dados formatados especificamente para IncomeExpenseSummaryCard
 */
export function useIncomeExpenseSummary() {
  const { stats, hasStats, loading, error } = useHomeDashboard();

  const summaryData = useMemo(() => ({
    income: {
      value: stats.totalIncome,
      percentage: stats.incomePercentage,
      label: 'Entradas totais',
    },
    expense: {
      value: stats.totalExpenses,
      percentage: stats.expensePercentage,
      label: 'Saídas totais',
    },
  }), [stats]);

  return {
    summaryData,
    hasStats,
    loading,
    error,
  };
}

export default useHomeDashboard;
