import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { ITransaction } from '@fiap-tech-challenge/database/types';
import { TransactionsQueriesService } from '@fiap-tech-challenge/database/queries';
import { supabase } from '@/lib/supabase';
import { TransactionForm, TransactionInsertWithFile } from '../TransactionForm';
import { TransactionAttachmentService } from '@/lib/services/attachment-service';
import { Colors } from '@/constants/Colors';

const transactionService = new TransactionsQueriesService(supabase);
const attachmentService = new TransactionAttachmentService();

export interface CreateTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (transaction: ITransaction) => void;
  onError?: (error: Error) => void;
}

export function CreateTransactionModal({
  visible,
  onClose,
  onSuccess,
  onError,
}: CreateTransactionModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleCreateTransaction = async (transactionData: TransactionInsertWithFile) => {
    setSubmitting(true);

    try {
      const { selectedFile, ...cleanTransactionData } = transactionData;

      let createdTransaction = await transactionService.createTransaction(cleanTransactionData);
      if (selectedFile && createdTransaction) {
        try {
          await attachmentService.uploadAttachment(createdTransaction.id, selectedFile);

          const updatedTransaction = await transactionService.getTransactionById(createdTransaction.id);
          if (updatedTransaction) {
            createdTransaction = updatedTransaction;
          }
        } catch (uploadError) {
          console.error('Erro no upload do arquivo:', uploadError);
        }
      }

      onSuccess?.(createdTransaction);
      onClose();

      Alert.alert(
        'Sucesso!',
        selectedFile
          ? 'Transação e anexo criados com sucesso.'
          : 'Transação criada com sucesso.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      onError?.(error as Error);

      Alert.alert(
        'Erro',
        'Ocorreu um erro ao criar a transação. Tente novamente.',
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
            Nova transação
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            disabled={submitting}
            className={`w-8 h-8 items-center justify-center ${submitting ? 'opacity-50' : ''}`}
          >
            <Ionicons name="close" size={24} color={Colors.light.grayMedium} />
          </TouchableOpacity>
        </View>

        {submitting && (
          <View className="absolute inset-0 bg-black/20 z-10 items-center justify-center">
            <View className="bg-white rounded-lg p-4 items-center">
              <Text className="text-gray-700 mb-2">Criando transação...</Text>
              <View className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </View>
          </View>
        )}

        <View className="flex-1">
          <TransactionForm
            disabled={submitting}
            onSubmit={handleCreateTransaction}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
