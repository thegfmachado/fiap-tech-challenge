import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTransactions } from '@/hooks/useTransactions';
import { ErrorState } from '@/components/transactions/TransactionStates';
import TransactionSkeleton from '@/components/transactions/TransactionSkeleton';
import { CreateTransactionModal } from '@/components/transactions/modals/CreateTransactionModal';
import { EditTransactionModal } from '@/components/transactions/modals/EditTransactionModal';
import { ViewTransactionModal } from '@/components/transactions/modals/ViewTransactionModal';
import { DeleteTransactionModal } from '@/components/transactions/modals/DeleteTransactionModal';
import type { ITransaction } from '@fiap-tech-challenge/database/types';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import { TransactionAction } from '@/components/transactions/TransactionAction';
import TransactionsList from '@/components/transactions/TransactionsList';
import { TransactionsQueriesService } from '@fiap-tech-challenge/database/queries';
import { supabase } from '@/lib/supabase';
import { mapTransactionToITransaction, mapITransactionToTransaction, type Transaction } from '@/utils/transactionMapper';
import { Colors } from '@/constants/Colors';

const transactionService = new TransactionsQueriesService(supabase);

export default function TransactionsScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState<ITransaction | null>(null);
  const [viewTransaction, setViewTransaction] = useState<ITransaction | null>(null);
  const [deleteTransaction, setDeleteTransaction] = useState<ITransaction | null>(null);

  const {
    transactions,
    loading,
    error,
    filters,
    loadingMore,
    setFilters,
    applyFilters,
    clearFilters,
    refreshTransactions,
    handleSyncTransactions,
  } = useTransactions();

  const handleEdit = useCallback((transaction: Transaction) => {
    const fullTransaction: ITransaction = mapTransactionToITransaction({
      ...transaction,
      attachment_name: transaction.attachment_name ?? null,
      attachment_url: transaction.attachment_url ?? null,
    });

    setEditTransaction(fullTransaction);
  }, []);

  const handleDelete = useCallback(async (transactionId: string) => {
    try {
      const transaction = await transactionService.getTransactionById(transactionId);
      setDeleteTransaction(transaction);
    } catch (error) {
      console.error('❌ Erro ao buscar transação para deleção:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da transação.');
    }
  }, []);

  const handleConfirmDelete = useCallback(async (transactionId: string) => {
    try {
      await transactionService.deleteTransaction(transactionId);
      await refreshTransactions();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      Alert.alert('Erro', `Falha ao excluir transação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      throw error;
    }
  }, [refreshTransactions]);

  const handleCreateTransaction = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const handleTransactionCreated = useCallback((newTransaction: ITransaction) => {
    const localTransaction: Transaction = mapITransactionToTransaction(newTransaction);

    handleSyncTransactions(localTransaction, 'create');
    setShowCreateModal(false);
  }, [handleSyncTransactions]);

  const handleTransactionPress = useCallback((transaction: Transaction) => {
    const fullTransaction: ITransaction = mapTransactionToITransaction(transaction);

    setViewTransaction(fullTransaction);
  }, []);

  const handleTransactionUpdated = useCallback((updatedTransaction: ITransaction) => {
    const localTransaction: Transaction = mapITransactionToTransaction(updatedTransaction);

    handleSyncTransactions(localTransaction, 'edit');
    setEditTransaction(null);
  }, [handleSyncTransactions]);

  const handleViewToEdit = useCallback((transaction: ITransaction) => {
    setViewTransaction(null);
    setEditTransaction(transaction);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshTransactions}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
      >
        <LinearGradient
          colors={['rgba(102, 67, 115, 0.15)', '#ffffff']}
          className="flex-col items-center w-full px-8 p-8 gap-4"
        >
          <View className="w-full flex-col gap-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-gray-900">
                Transações
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilters(!showFilters)}
                className={`p-2 ${showFilters ? 'opacity-100' : 'opacity-60'}`}
              >
                <Ionicons
                  name="funnel-outline"
                  size={24}
                  color={showFilters ? Colors.light.primary : Colors.light.grayMedium}
                />
              </TouchableOpacity>
            </View>

            {showFilters && (
              <TransactionFilters
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={() => {
                  applyFilters();
                  setShowFilters(false);
                }}
                onClearFilters={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
              />
            )}
          </View>
        </LinearGradient>

        {loading ? (
          <TransactionSkeleton />
        ) : (
          <>
            <TransactionsList
              title="Extrato completo"
              transactions={transactions}
              onCreateNew={handleCreateTransaction}
              onTransactionPress={handleTransactionPress}
              renderActions={(transaction: Transaction) => {
                return (
                  <>
                    <TransactionAction
                      type="edit"
                      onClick={() => handleEdit(transaction)}
                    />
                    <TransactionAction
                      type="delete"
                      onClick={() => handleDelete(transaction.id)}
                    />
                  </>
                );
              }}
            />
            {loadingMore && (
              <View className="flex-row items-center justify-center w-full p-4 h-20 gap-4">
                <ActivityIndicator size="small" color={Colors.light.grayMedium} />
                <Text className="text-sm text-gray-500">
                  Carregando mais...
                </Text>
              </View>
            )}
          </>
        )}

        {error && (
          <ErrorState message={error} onRetry={refreshTransactions} />
        )}
      </ScrollView>

      <CreateTransactionModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleTransactionCreated}
        onError={(error) => {
          console.error('Erro ao criar transação:', error);
          setShowCreateModal(false);
        }}
      />

      {viewTransaction && (
        <ViewTransactionModal
          visible={!!viewTransaction}
          transaction={viewTransaction}
          onClose={() => setViewTransaction(null)}
          onEdit={handleViewToEdit}
        />
      )}

      {editTransaction && (
        <EditTransactionModal
          visible={!!editTransaction}
          transaction={editTransaction}
          onClose={() => setEditTransaction(null)}
          onSuccess={handleTransactionUpdated}
          onError={(error) => {
            console.error('Erro ao editar transação:', error);
            setEditTransaction(null);
          }}
          readOnly={false}
        />
      )}

      <DeleteTransactionModal
        visible={!!deleteTransaction}
        transaction={deleteTransaction}
        onClose={() => setDeleteTransaction(null)}
        onConfirm={handleConfirmDelete}
      />
    </SafeAreaView>
  );
}


