import React from 'react';
import { ScrollView, RefreshControl, View, Text, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


import { useHomeDashboard } from '@/hooks/useHomeDashboard';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/contexts/auth-context';

import { BalanceCard } from '@/components/BalanceCard';
import { IncomeExpenseSummaryCard } from '@/components/IncomeExpenseSummaryCard';
import { RecentTransactions } from '@/components/RecentTransactions';
import { ViewTransactionModal } from '@/components/ViewTransactionModal';
import { CreateTransactionModal } from '@/components/CreateTransactionModal';

import { mapTransactionToITransaction, mapITransactionToTransaction, Transaction } from '@/utils/transactionMapper';

import type { ITransaction } from '@fiap-tech-challenge/database/types';

export default function HomeScreen() {
  const {
    stats,
    recentTransactions,
    loading,
    refreshData
  } = useHomeDashboard();

  const { handleSyncTransactions } = useTransactions();
  const { user } = useAuth();

  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error('Error refreshing home data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refreshData]);
  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleViewAllTransactions = () => {
    router.push('/transactions');
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTransaction(null);
  };

  const handleCreateTransaction = () => {
    setShowCreateModal(true);
  };

  const handleTransactionCreated = (newTransaction: ITransaction) => {
    const localTransaction: Transaction = mapITransactionToTransaction(newTransaction);

    handleSyncTransactions(localTransaction, 'create');
    refreshData();
    setShowCreateModal(false);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col items-center w-full bg-primary/[.08] py-7 px-10">
          <View className="flex-col items-start self-stretch gap-1">
            <Text className="font-semibold text-2xl leading-6 text-gray-900">
              Olá,
            </Text>
            <Text className="text-base leading-6 text-gray-900">
              {user?.user_metadata?.name?.split(' ')[0] || 'Usuário'}
            </Text>
          </View>
        </View>

        <View className="px-6 bg-primary/[.08]">
          <IncomeExpenseSummaryCard />
        </View>

        <View className="flex-col items-center w-full px-10 py-6 gap-4 bg-primary/[.08]">
          <BalanceCard
            balance={stats.balance}
            loading={loading}
            initiallyHidden={false}
          />

          <TouchableOpacity
            onPress={handleCreateTransaction}
            className="flex-row items-center px-8 py-4 rounded-lg bg-primary"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text className="text-white font-semibold ml-3 text-lg">
              Nova transação
            </Text>
          </TouchableOpacity>
        </View>

        <RecentTransactions
          title="Extrato recente"
          transactions={recentTransactions.slice(0, 5)}
          loading={loading}
          showAllTransactionsButton={true}
          onTransactionPress={handleTransactionPress}
          onViewAllPress={handleViewAllTransactions}
        />

        <View className="h-6" />
      </ScrollView>

      {selectedTransaction && (
        <ViewTransactionModal
          visible={showTransactionModal}
          transaction={mapTransactionToITransaction(selectedTransaction)}
          onClose={handleCloseTransactionModal}
        />
      )}

      <CreateTransactionModal
        visible={showCreateModal}
        onClose={handleCloseCreateModal}
        onSuccess={handleTransactionCreated}
      />
    </SafeAreaView>
  );
}


