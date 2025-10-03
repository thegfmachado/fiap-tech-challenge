import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { ITransaction } from '@fiap-tech-challenge/database/types';
import { TransactionsQueriesService } from '@fiap-tech-challenge/database/queries';
import { supabase } from '@/lib/supabase';
import { TransactionForm } from './TransactionForm';

const transactionService = new TransactionsQueriesService(supabase);

export interface EditTransactionModalProps {
  visible: boolean;
  transaction: ITransaction;
  onClose: () => void;
  onSuccess?: (transaction: ITransaction) => void;
  onError?: (error: Error) => void;
  readOnly?: boolean;
}

export function EditTransactionModal({
  visible,
  transaction,
  onClose,
  onSuccess,
  onError,
  readOnly = false,
}: EditTransactionModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateTransaction = async (transactionData: any) => {
    setSubmitting(true);
    
    try {
      const { selectedFile, ...cleanTransactionData } = transactionData;
      const updatedTransaction = await transactionService.updateTransaction(
        transaction.id, 
        cleanTransactionData
      );
      
      onSuccess?.(updatedTransaction);
      
      Alert.alert(
        'Sucesso!',
        readOnly ? 'Transação visualizada.' : 'Transação atualizada com sucesso.',
        [{ text: 'OK' }]
      );
      
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      onError?.(error as Error);
      
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao atualizar a transação. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      onClose();
    }
  };

  const handleAttachmentChange = (updatedTransaction: ITransaction) => {
    onSuccess?.(updatedTransaction);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <View className="w-8" />
          <Text className="text-lg font-semibold text-gray-900">
            {readOnly ? 'Detalhes da transação' : 'Editar transação'}
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            disabled={submitting}
            className={`w-8 h-8 items-center justify-center ${submitting ? 'opacity-50' : ''}`}
          >
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {submitting && (
          <View className="absolute inset-0 bg-black/20 z-10 items-center justify-center">
            <View className="bg-white rounded-lg p-4 items-center">
              <Text className="text-gray-700 mb-2">
                {readOnly ? 'Carregando...' : 'Salvando transação...'}
              </Text>
              <View className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </View>
          </View>
        )}

        <View className="flex-1">
          <TransactionForm
            disabled={submitting}
            readOnly={readOnly}
            onSubmit={handleUpdateTransaction}
            transaction={transaction}
            onAttachmentChange={handleAttachmentChange}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}