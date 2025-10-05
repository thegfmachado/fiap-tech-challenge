import React from 'react';
import { ScrollView, RefreshControl, View, Text, TouchableOpacity } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/utils/constants';

import { useHomeDashboard } from '@/hooks/useHomeDashboard';
import { useTransactions } from '@/hooks/useTransactions';
import { useCurrentUser } from '@/hooks/use-current-user';

import BalanceCard from '@/components/BalanceCard';
import IncomeExpenseSummaryCard from '@/components/IncomeExpenseSummaryCard';
import RecentTransactions from '@/components/RecentTransactions';
import { ViewTransactionModal } from '@/components/ViewTransactionModal';
import { CreateTransactionModal } from '@/components/CreateTransactionModal';

import { mapTransactionToITransaction, mapITransactionToTransaction, Transaction } from '@/utils/transactionMapper';

import type { ITransaction } from '@fiap-tech-challenge/database/types';

export default function HomeScreen() {
  const { 
    stats, 
    recentTransactions, 
    loading,
    hasStats,
    refreshData
  } = useHomeDashboard();

  const { handleSyncTransactions } = useTransactions();
  const { currentUser, loading: userLoading } = useCurrentUser();

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
        <View 
          className="flex-col items-center w-full"
          style={{ 
            backgroundColor: COLORS.PRIMARY + '15',
            paddingTop: 28,
            paddingBottom: 28,
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          <View className="flex-col items-start self-stretch" style={{ gap: 4 }}>
            {userLoading ? (
              <>
                <View className="w-16 h-6 bg-gray-200 rounded" />
                <View className="w-32 h-5 bg-gray-200 rounded" />
              </>
            ) : (
              <>
                <Text 
                  style={{ 
                    fontWeight: '600',
                    fontSize: 24,
                    lineHeight: 22,
                    color: '#241B28',
                  }}
                >
                  Olá,
                </Text>
                <Text 
                  style={{ 
                    fontWeight: '400',
                    fontSize: 16,
                    lineHeight: 18.8,
                    color: '#241B28',
                  }}
                >
                  {currentUser?.user_metadata?.name?.split(' ')[0] || 'Usuário'}
                </Text>
              </>
            )}
          </View>
        </View>

        <View 
          className="px-6"
          style={{ backgroundColor: COLORS.PRIMARY + '15' }}
        >
          <IncomeExpenseSummaryCard
            income={{
              value: stats.totalIncome,
              percentage: stats.incomePercentage,
              label: 'Entradas totais'
            }}
            expense={{
              value: stats.totalExpenses,
              percentage: stats.expensePercentage,
              label: 'Saídas totais'
            }}
            loading={loading}
            hasData={hasStats}
          />
        </View>

        <View 
          className="flex-col items-center w-full px-10 py-6 gap-4"
          style={{ backgroundColor: COLORS.PRIMARY + '15' }}
        >
          <BalanceCard
            balance={stats.balance}
            loading={loading}
            initiallyHidden={false}
          />

          <TouchableOpacity
            onPress={handleCreateTransaction}
            className="flex-row items-center px-8 py-4 rounded-lg"
            style={{ backgroundColor: COLORS.PRIMARY }}
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


